import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import DTHLogoSVGBlue from '../../Images/logo-blue.svg';
import DTHLogoSVGWhite from '../../Images/logo-white.svg';

// theme and toggletheme are passed as props from App.jsx 
// they are used to determine the current theme and toggle it when the button is clicked
function Navbar({ theme, toggleTheme }) {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const loadBalance = async () => {
      try {
        const res = await fetch("http://localhost:3000/balance", {
          credentials: "include"
        });
        if (!res.ok) {
          setBalance(0);
          return;
        }
        const data = await res.json();
        setBalance(data.balance ?? 0);
      } catch {
        setBalance(0);
      }
    };

    loadBalance();

    window.addEventListener("balance-updated", loadBalance);
    return () => window.removeEventListener("balance-updated", loadBalance);
  }, []);

  return (
    <div className="d-flex justify-content-between align-items-center py-3 px-5 my-3 sticky-top bg-body z-3 shadow-lg rounded-pill mx-2">
      
      {/* 1. Logo aan de linkerkant */}
      <img 
        // AANGEPAST: Hier controleren we het thema om het juiste logo te kiezen
        src={theme === 'light' ? DTHLogoSVGBlue : DTHLogoSVGWhite} 
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
          <div className='d-inline ms-4'><i className="dth-coin"></i> {balance}</div>
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