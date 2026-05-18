import { useState, useEffect } from 'react';
import AppRoutes from './AppRoutes/AppRoutes';
import Navbar from './WebsiteElements/Navbar/Navbar';

const API_BASE = "http://localhost:3000";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'light');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  useEffect(() => {
    fetch(`${API_BASE}/user`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
      })
      .catch(() => {
        setUserData(null);
      });
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} userData={userData} />
      <AppRoutes userData={userData} />
    </>
 );
}

export default App;