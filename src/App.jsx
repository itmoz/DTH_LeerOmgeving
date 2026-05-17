// App.js
import { useState, useEffect } from 'react';
import AppRoutes from './AppRoutes/AppRoutes';
import Navbar from './WebsiteElements/Navbar/Navbar';

const API_BASE = "http://localhost:3000";

function App() {
  // 1. Theme State & LocalStorage
  const [theme, setTheme] = useState(localStorage.getItem('app-theme') || 'light');

  // Nieuw: state voor backend-data
  const [userData, setUserData] = useState(null);

  // 2. Apply theme to HTML tag
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  // Nieuw: één keer /user ophalen bij laden van de app
  useEffect(() => {
    fetch(`${API_BASE}/user`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Data van backend /user:", data);
        setUserData(data); // bv. { user: null }
      })
      .catch((err) => {
        console.error("Fout bij ophalen /user:", err);
      });
  }, []);

  // 3. Toggle Function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
}

export default App;