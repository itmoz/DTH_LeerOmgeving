// App.js
import { useState, useEffect } from 'react';
import AppRoutes from './AppRoutes/AppRoutes';
import Navbar from './WebsiteElements/Navbar/Navbar';

const API_BASE = "http://127.0.0.1:3000";

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

  return (
    <div className="container">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <AppRoutes />
        <section style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
          <h2>Debug: data van backend (/user)</h2>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </section>
      </main>
    </div>
  );
}

export default App;