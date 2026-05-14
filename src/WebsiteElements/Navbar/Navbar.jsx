import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DTHLogoSVGBlue from "../../Images/logo-blue.svg";
import DTHLogoSVGWhite from "../../Images/logo-white.svg";

function Navbar({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [userEmail, setUserEmail] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const refreshAuth = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3000/user", {
        credentials: "include",
      });
      if (!res.ok) {
        setUserEmail(null);
        return;
      }
      const data = await res.json();
      setUserEmail(data.email ?? null);
      if (data.email) {
        localStorage.setItem("userEmail", data.email);
      }
    } catch {
      setUserEmail(null);
    } finally {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
    const onAuthChange = () => {
      refreshAuth();
    };
    window.addEventListener("auth-changed", onAuthChange);
    return () => window.removeEventListener("auth-changed", onAuthChange);
  }, [refreshAuth]);

  useEffect(() => {
    if (!profileOpen) return;

    const onPointerDown = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [profileOpen]);

  useEffect(() => {
    const loadBalance = async () => {
      try {
        const res = await fetch("http://localhost:3000/balance", {
          credentials: "include",
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
  }, [userEmail]);

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
    setUserEmail(null);
    setBalance(0);
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
          {authChecked && userEmail ? (
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
                    <div className="text-break fw-medium">{userEmail}</div>
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
          ) : authChecked ? (
            <Link to="/LogIn" className="text-decoration-none">
              Log in
            </Link>
          ) : (
            <span
              className="text-muted small px-2"
              aria-busy="true"
              aria-label="Sessie laden"
            >
              …
            </span>
          )}
          <div className="d-inline ms-2">
            <i className="dth-coin"></i> {balance}
          </div>
        </nav>

        <button
          className={`btn ${theme === "light" ? "btn-dark" : "btn-light"} rounded-pill`}
          type="button"
          onClick={toggleTheme}
        >
          <i className={`bi bi-${theme === "light" ? "moon" : "sun"}-fill`}></i>
        </button>
      </div>
    </div>
  );
}

export default Navbar;
