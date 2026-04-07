import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const USERS_KEY = 'dth_users';
const STARTING_BALANCE = 1000;

const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
};

const setUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

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

  const max = 100;
  if (score > max) score = max;

  let label = 'Zwak';
  if (score >= 80) label = 'Sterk';
  else if (score >= 60) label = 'Goed';
  else if (score >= 40) label = 'Matig';

  return { score, label };
};

const toHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

const randomSalt = () => {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return toHex(array);
};

const hashPassword = async (password, salt) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${password}`);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return toHex(digest);
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

  const [validationMessage, setValidationMessage] = useState('');

  const canSubmit =
    validateEmail(email) &&
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password) &&
    password === confirmPassword;

  useEffect(() => {
    if (!email || !password || !confirmPassword) {
      setValidationMessage('Vul alle velden in om te kunnen registreren.');
      return;
    }

    if (!validateEmail(email)) {
      setValidationMessage('Gebruik een geldig e-mailadres.');
      return;
    }

    if (password.length < 8) {
      setValidationMessage('Wachtwoord moet minimaal 8 tekens zijn.');
      return;
    }

    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      setValidationMessage('Wachtwoord moet hoofdletter, kleine letter, cijfer en speciaal teken bevatten.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationMessage('Wachtwoorden zijn niet gelijk.');
      return;
    }

    setValidationMessage('Prima! Je kunt registreren.');
  }, [email, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateEmail(email)) {
      setError('Voer een geldig e-mailadres in.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Wachtwoorden komen niet overeen.');
      return;
    }

    if (!canSubmit) {
      setError(
        'Wachtwoord moet minimaal 8 tekens hebben, kleine en hoofdletter, cijfer en speciaal teken.',
      );
      return;
    }

    setSubmitting(true);

    const users = getUsers();
    if (users[normalizedEmail]) {
      setError('E-mail is al geregistreerd. Gebruik een ander e-mailadres.');
      setSubmitting(false);
      return;
    }

    try {
      const salt = randomSalt();
      const passwordHash = await hashPassword(password, salt);

      users[normalizedEmail] = {
        email: normalizedEmail,
        passwordHash,
        salt,
        balance: STARTING_BALANCE,
        createdAt: Date.now(),
      };

      setUsers(users);
      setSuccess('Registratie gelukt! Je wordt doorgestuurd naar inloggen...');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/LogIn');
      }, 1000);
    } catch (err) {
      setError('Er is een fout opgetreden tijdens het registreren. Probeer het opnieuw.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // reset messages bij input wijziging
    setError('');
    setSuccess('');
  }, [email, password, confirmPassword]);

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <form
        onSubmit={handleSubmit}
        className="w-100"
        style={{ maxWidth: '500px' }}
        autoComplete="off"
      >
        <h2 className="mb-4 text-center">Registreer</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="form-outline mb-3">
          <input
            type="email"
            id="registerEmail"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="form-label" htmlFor="registerEmail">
            E-mail adres
          </label>
        </div>

        <div className="form-outline mb-3">
          <input
            type="password"
            id="registerPassword"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <label className="form-label" htmlFor="registerPassword">
            Wachtwoord
          </label>
        </div>

        <div className="mb-3">
          <div className="progress" style={{ height: '10px' }}>
            <div
              className={`progress-bar ${
                score >= 80 ? 'bg-success' : score >= 60 ? 'bg-info' : 'bg-danger'
              }`}
              role="progressbar"
              style={{ width: `${score}%` }}
              aria-valuenow={score}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <small className="text-muted">
            Sterkte: {label} ({score}%) - minimaal 8 tekens, hoofdletter, kleine letter, cijfer
            en speciaal teken.
          </small>
        </div>

        <div className="form-outline mb-4">
          <input
            type="password"
            id="confirmPassword"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <label className="form-label" htmlFor="confirmPassword">
            Bevestig wachtwoord
          </label>
        </div>

        <div className="mb-3">
          <small className={canSubmit ? 'text-success' : 'text-danger'}>{validationMessage}</small>
        </div>

        <button type="submit" className="btn btn-primary btn-block mb-4 w-100" disabled={submitting || !canSubmit}>
          {submitting ? 'Registreren...' : 'Registreren'}
        </button>

        <div className="text-center">
          <p>
            Al lid?{' '}
            <button type="button" className="btn btn-link p-0" onClick={() => navigate('/LogIn')}>
              Log in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
