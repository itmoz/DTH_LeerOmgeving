import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Make sure React Router is installed

export default function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    
    // Check if both email and password have input
    if (email.trim() && password.trim()) {
      console.log('Sign in with:', { email, password, rememberMe });
      // Navigate to dashboard or home page (adjust the route as needed)
      navigate('/LearningDashboard');
    } else {
      console.log('Please fill in both email and password');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <form onSubmit={handleSignIn} className="w-100" style={{ maxWidth: '500px' }}>
        {/* Email input */}
        <div className="form-outline mb-4">
          <input
            type="email"
            id="form2Example1"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="form-label" htmlFor="form2Example1">
            Email adres
          </label>
        </div>

        {/* Password input */}
        <div className="form-outline mb-4">
          <input
            type="password"
            id="form2Example2"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className="form-label" htmlFor="form2Example2">
            Wachtwoord
          </label>
        </div>

        {/* 2 column grid layout for inline styling */}
        <div className="row mb-4">
          <div className="col d-flex justify-content-center">
            {/* Checkbox */}
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="form2Example31"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="form2Example31">
                {' '}
                Onthoud mij{' '}
              </label>
            </div>
          </div>

          <div className="col">
            {/* Simple link */}
            <a href="#!">Wachtwoord vergeten?</a>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="btn btn-primary btn-block mb-4 w-100"
        >
          Log in
        </button>

        {/* Register buttons */}
        <div className="text-center">
          <p>
            Nog geen lid? <a href="#!">Registreer!</a>
          </p>
        </div>
      </form>
    </div>
  );
}