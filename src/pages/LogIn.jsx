import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const normalizeEmail = (email) => email.trim().toLowerCase();

const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));

export default function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const checkSession = async () => {
      try {
        const res = await fetch('http://localhost:3000/user', {
          credentials: 'include',
        });
        if (!cancelled && res.ok) {
          navigate('/LearningDashboard', { replace: true });
        }
      } catch {
        // blijf op login
      }
    };
    checkSession();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const normalizedEmail = normalizeEmail(email);

    if (!validateEmail(email)) {
      setError('Voer een geldig e-mailadres in.');
      return;
    }

    try {
      const loginRes = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: normalizedEmail, password })
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        setError(loginData.error || "Inloggen mislukt");
        return;
      }

      localStorage.setItem("userEmail", loginData.email || normalizedEmail);
      window.dispatchEvent(new Event('auth-changed'));

      setError('');
      setMessage('Inloggen geslaagd!');
      navigate('/LearningDashboard');

    } catch (err) {
      setError('Server niet bereikbaar');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <form onSubmit={handleSignIn} className="w-100" style={{ maxWidth: '500px' }}>
        <h2 className="mb-4">Inloggen</h2>

        {message && <div className="alert alert-info">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="form-outline mb-4">
          <input
            type="email"
            id="loginEmail"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="form-label" htmlFor="loginEmail">
            E-mail adres
          </label>
        </div>

        <div className="form-outline mb-4">
          <input
            type="password"
            id="loginPassword"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className="form-label" htmlFor="loginPassword">
            Wachtwoord
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block mb-4 w-100"
        >
          Log in
        </button>

        <div className="text-center">
          <p>
            Nog geen lid?{' '}
            <button type="button" className="btn btn-link p-0" onClick={() => navigate('/register')}>
              Registreer hier
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}