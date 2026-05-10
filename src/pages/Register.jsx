import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const normalizeEmail = (email) => email.trim().toLowerCase();

const validateEmail = (email) => {
  const normalized = normalizeEmail(email);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
};

const computeStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 10;
  if (/[a-z]/.test(password)) score += 20;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 10;

  if (score > 100) score = 100;

  let label = 'Zwak';
  if (score >= 80) label = 'Sterk';
  else if (score >= 60) label = 'Goed';
  else if (score >= 40) label = 'Matig';

  return { score, label };
};

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const normalizedEmail = normalizeEmail(email);
  const { score, label } = useMemo(() => computeStrength(password), [password]);

  const canSubmit =
    validateEmail(email) &&
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password) &&
    password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateEmail(email)) {
      setError('Voer een geldig e-mailadres in.');
      return;
    }

    if (!canSubmit) {
      setError('Wachtwoord voldoet niet aan de eisen.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registratie mislukt");
        return;
      }

      setSuccess('Registratie gelukt! Je wordt doorgestuurd...');

      setTimeout(() => {
        navigate('/LogIn');
      }, 1000);

    } catch (err) {
      setError('Server niet bereikbaar');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    setError('');
    setSuccess('');
  }, [email, password, confirmPassword]);

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: '500px' }}>
        <h2 className="mb-4 text-center">Registreer</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control mb-3"
          placeholder="E-mail"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control mb-3"
          placeholder="Wachtwoord"
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="form-control mb-3"
          placeholder="Bevestig wachtwoord"
        />

        <div className="mb-3">
          <small>Wachtwoord sterkte: {label} ({score}%)</small>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={submitting || !canSubmit}
        >
          {submitting ? 'Registreren...' : 'Registreren'}
        </button>
      </form>
    </div>
  );
}