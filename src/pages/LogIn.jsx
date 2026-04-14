import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const USERS_KEY = 'dth_users';
const LOCK_KEY = 'dth_login_lockouts';
const STARTING_BALANCE = 1000;

const normalizeEmail = (email) => email.trim().toLowerCase();

const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));

const toHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

const hashPassword = async (password, salt) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${password}`);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return toHex(digest);
};

const getLockouts = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCK_KEY) || '{}');
  } catch {
    return {};
  }
};

const setLockouts = (data) => {
  localStorage.setItem(LOCK_KEY, JSON.stringify(data));
};

export default function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(3);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [lockSeconds, setLockSeconds] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      setAttempts(3);
      setLockedUntil(0);
      setLockSeconds(0);
      return;
    }

    const locks = getLockouts();
    const key = normalizeEmail(email);
    const record = locks[key];

    if (record && record.lockedUntil && record.lockedUntil > Date.now()) {
      setLockedUntil(record.lockedUntil);
      setAttempts(record.attemptsLeft ?? 0);
      setMessage(`Te vaak fout ingevoerd. Probeer opnieuw over ...`);
    } else {
      setLockedUntil(0);
      setAttempts(3);
      if (record) {
        delete locks[key];
        setLockouts(locks);
      }
    }
  }, [email]);

  useEffect(() => {
    if (!lockedUntil || lockedUntil <= Date.now()) {
      setLockSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockedUntil(0);
        setAttempts(3);
        setMessage('Je kunt opnieuw inloggen.');
        clearInterval(interval);
      } else {
        setLockSeconds(remaining);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [lockedUntil]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const normalizedEmail = normalizeEmail(email);

    if (!validateEmail(email)) {
      setError('Voer een geldig e-mailadres in.');
      return;
    }

    if (lockedUntil > Date.now()) {
      setError(`Account gelocked. Wacht ${lockSeconds} seconden.`);
      return;
    }

    try {
      const providedHash = await hashPassword(password, normalizedEmail);

      const res = await fetch("http://127.0.0.1:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: normalizedEmail,
          passwordHash: providedHash
        })
      });

      const data = await res.json();

      if (!res.ok) {
        // handle failed attempts
        const lockouts = getLockouts();
        const current = lockouts[normalizedEmail] || { attemptsLeft: 3, lockedUntil: 0 };
        const nextAttempts = Math.max(0, current.attemptsLeft - 1);

        if (nextAttempts <= 0) {
          const newLockedUntil = Date.now() + 60 * 1000;
          lockouts[normalizedEmail] = {
            attemptsLeft: 0,
            lockedUntil: newLockedUntil,
          };
          setLockouts(lockouts);
          setLockedUntil(newLockedUntil);
          setAttempts(0);
          setLockSeconds(60);
          setError('Fout wachtwoord. Te veel keren fout. 1 minuut blokkering.');
          return;
        }

        lockouts[normalizedEmail] = {
          attemptsLeft: nextAttempts,
          lockedUntil: 0,
        };
        setLockouts(lockouts);
        setAttempts(nextAttempts);
        setError(`Fout wachtwoord. Nog ${nextAttempts} poging(en).`);
        return;
      }

      // SUCCESS
      const lockouts = getLockouts();
      delete lockouts[normalizedEmail];
      setLockouts(lockouts);

      setAttempts(3);
      setError('');
      setMessage('Inloggen geslaagd!');

      navigate('/LearningDashboard');

    } catch (err) {
      setError("Server niet bereikbaar");
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
            disabled={Boolean(lockedUntil > Date.now())}
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
            disabled={Boolean(lockedUntil > Date.now())}
            style={{ backgroundColor: lockedUntil > Date.now() ? '#e9ecef' : 'inherit' }}
          />
          <label className="form-label" htmlFor="loginPassword">
            Wachtwoord
          </label>
        </div>

        {lockedUntil > Date.now() && (
          <p className="text-warning">Probeer over {lockSeconds} seconden opnieuw.</p>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-block mb-4 w-100"
          disabled={Boolean(lockedUntil > Date.now())}
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