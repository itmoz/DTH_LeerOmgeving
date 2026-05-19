// App.js
import { useState, useEffect } from 'react';
import AppRoutes from './AppRoutes/AppRoutes';
import Navbar from './WebsiteElements/Navbar/Navbar';
import AchievementToastHost from './WebsiteElements/Notifications/AchievementToastHost';

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
    <div className="container">
      
      {/* Roep de Navbar aan en geef de props door */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <AchievementToastHost />
      {/* Main Content Area */}
      <main>
        <AppRoutes />
      </main>
      
    </div>
  );
}

export default App;