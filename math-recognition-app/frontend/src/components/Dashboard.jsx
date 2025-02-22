import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import Canvas from './Canvas';
import UserMenu from './UserMenu';
import RealTimeMathRecognition from './RealTimeMathRecognition';
import '../styles/Dashboard.css';

function Dashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [showRealTime, setShowRealTime] = useState(false);

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
      
      <div className="realtime-section">
      <button 
          className="realtime-toggle-btn flex items-center gap-2 hover:scale-105 transform transition-all"
          onClick={() => setShowRealTime(!showRealTime)}
        >
          <Camera className="w-5 h-5" />
          <span>{showRealTime ? 'Hide Live-Feed' : 'Live-Feed'}</span>
        </button>
      </div>
        
        {showRealTime && (
          <div className="realtime-container">
            <RealTimeMathRecognition />
          </div>
        )}
      </div>
  );
}

export default Dashboard;