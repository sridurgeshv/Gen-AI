import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import Canvas from './Canvas';
import UserMenu from './UserMenu';

function Dashboard() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="app-container">
      <div className="header-wrapper">
        <div className="header-container">
          <h1 className="animated-title">
            <span className="letter">N</span>
            <span className="letter">u</span>
            <span className="letter">m</span>
            <span className="letter bounce">B</span>
            <span className="letter">u</span>
            <span className="letter">d</span>
            <span className="letter">d</span>
            <span className="letter">y</span>
          </h1>
          <p className={`tagline ${isVisible ? 'slide-in' : ''}`}>
            Your Friendly Math Sidekick!
          </p>
        </div>
        <div className="user-menu-container">
          <UserMenu />
        </div>
      </div>
      <Canvas />
    </div>
  );
}

export default Dashboard;