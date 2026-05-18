
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DTHLogoSVGBlue from "../../Images/logo-blue.svg";
import DTHLogoSVGWhite from "../../Images/logo-white.svg";

function Navbar({ theme, toggleTheme, userData }) {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // cookie cleared server-side on success; proceed with client cleanup
    }
    localStorage.removeItem("userEmail");
    setProfileOpen(false);
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/");
  };

  return (
    <div className="d-flex justify-content-between align-items-center py-3 px-5 my-3 sticky-top bg-body z-3 shadow-lg rounded-pill mx-2">
      <img
        src={theme === "light" ? DTHLogoSVGBlue : DTHLogoSVGWhite}
        alt="DTH Logo"
        style={{ height: "40px" }}
      />

      <div className="d-flex align-items-center gap-4">
        <nav className="fs-5 d-flex align-items-center flex-wrap gap-2">
          <Link to="/" className="text-decoration-none">
            Home
          </Link>
          <span className="text-secondary">|</span>
          <Link to="/Avatar" className="text-decoration-none">
            Avatar
          </Link>
          <span className="text-secondary">|</span>
          {userData && userData.email ? (
            <div className="position-relative d-inline-flex" ref={profileRef}>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary rounded-pill d-flex align-items-center gap-2"
                onClick={() => setProfileOpen((o) => !o)}
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <i className="bi bi-person-circle" aria-hidden="true"></i>
                Profiel
                <i
                  className={`bi bi-chevron-${profileOpen ? "up" : "down"} small`}
                  aria-hidden="true"
                ></i>
              </button>
              {profileOpen && (
                <div
                  className="dropdown-menu show position-absolute end-0 mt-1 shadow"
                  style={{ minWidth: "14rem", top: "100%" }}
                >
                  <div className="px-3 py-2 border-bottom">
                    <div className="small text-muted">Ingelogd als</div>
                    <div className="text-break fw-medium">{userData.email}</div>
                  </div>
                  <Link
                    className="dropdown-item"
                    to="/LearningDashboard"
                    onClick={() => setProfileOpen(false)}
                  >
                    <i className="bi bi-grid-3x3-gap me-2"></i>
                    Leeromgeving
                  </Link>
                  <button
                    type="button"
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Uitloggen
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/LogIn" className="text-decoration-none">
              Log in
            </Link>
          )}
        </nav>
        <button
          className="btn btn-outline-secondary rounded-pill ms-2"
          onClick={toggleTheme}
        >
          <i className={`bi bi-${theme === "light" ? "moon" : "sun"}`} aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
}

export default Navbar;

