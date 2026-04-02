import { Link } from 'react-router-dom';
import DTHLogoSVGBlue from '../../Images/logo-blue.svg';

// theme and toggletheme are passed as props from App.jsx 
// they are used to determine the current theme and toggle it when the button is clicked
function Navbar({ theme, toggleTheme }) {
  return (
    <div className="d-flex justify-content-between align-items-center py-2 px-4 mt-3 sticky-top bg-body z-3 shadow-lg rounded-pill mx-2">
      
      {/* 1. Logo aan de linkerkant */}
      <img 
        src={DTHLogoSVGBlue} 
        alt="DTH Logo" 
        style={{ height: '40px' }} // Pas dit getal aan om het logo groter of kleiner te maken
      />

      {/* 2 & 3. Container voor Navigatie en Knop (naast elkaar gezet met d-flex) */}
      <div className="d-flex align-items-center gap-4">
        
        <nav className="fs-5">
          <Link to="/" className="text-decoration-none me-2">Home</Link> 
          |{" "}
          <Link to="/Avatar" className="text-decoration-none ms-2 me-2">Avatar</Link>
          |{" "}
          <Link to="/LogIn" className="text-decoration-none ms-2">Log In</Link>
        </nav>
        
        {/* Theme Toggle Button */}
        {/* Let op: ik heb 'd-inline' verwijderd, want dat is nu overbodig dankzij d-flex in de parent div */}
        <button 
          className={`btn ${theme === 'light' ? 'btn-dark' : 'btn-light'} rounded-pill`} 
          onClick={toggleTheme}
        >
          <i className={`bi bi-${theme === 'light' ? 'moon' : 'sun'}-fill`}></i>
        </button>
        
      </div>
    </div>
  );
}

export default Navbar;