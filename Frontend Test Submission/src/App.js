import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { URLProvider } from './context/URLContext.js';
import URLShortenerPage from './components/URLShortnerPage.js';
import URLStatisticsPage from './components/URLStatisticsPage.js';
import RedirectHandler from './components/RedirectHandler.js';
import AuthSetup from './components/AuthSetup.js';
import { Log } from './logger.js';
import './styles/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if(isAuthenticated) {
      Log('info', 'page', 'Main application loaded after successful authentication.');
    }
  }, [isAuthenticated]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <AuthSetup onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <URLProvider>
      <Router>
        <header className="app-header">
          <nav className="navbar">
            <Link to="/" className="logo">Frontend Test</Link>
            <div className="nav-links">
              <Link to="/">Shortener</Link>
              <Link to="/stats">Statistics</Link>
            </div>
          </nav>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<URLShortenerPage />} />
            <Route path="/stats" element={<URLStatisticsPage />} />
            <Route path="/:shortCode" element={<RedirectHandler />} />
          </Routes>
        </main>
      </Router>
    </URLProvider>
  );
}

export default App;