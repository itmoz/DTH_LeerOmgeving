import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppRoutes from './AppRoutes/AppRoutes';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // 1. Theme State & LocalStorage
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'light');

  // 2. Apply theme to HTML tag
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  // 3. Toggle Function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="container mt-5">
      {/* Top Navigation & Theme Toggle Area */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        
        {/* React Router Links */}
        <nav className="fs-5">
          <Link to="/" className="text-decoration-none me-2">Home</Link> 
          |{" "}
          <Link to="/Avatar" className="text-decoration-none ms-2 me-2">Avatar</Link>
          |{" "}
          <Link to="/LogIn" className="text-decoration-none ms-2">Log In</Link>
        </nav>
        
        {/* Theme Toggle Button */}
        <button 
          className={`btn ${theme === 'light' ? 'btn-dark' : 'btn-light'}`} 
          onClick={toggleTheme}
        >
          Enable {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>

      <hr className="mb-4" />

      {/* Main Content Area (Where your pages will render) */}
      <main>
        <AppRoutes />
      </main>
      
    </div>
  );
}

export default App;