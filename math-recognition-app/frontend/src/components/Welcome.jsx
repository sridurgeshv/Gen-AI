import React, { useState, useEffect } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Welcome.css';

const Welcome = ({ onComplete }) => {
    const [showContent, setShowContent] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
      setTimeout(() => setShowContent(true), 500);
      setTimeout(() => setShowButton(true), 2000);
    }, []);
  
    return (
      <div className="welcome-container">
        <div className="stars-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            >
              <Sparkles className="text-white/20" size={Math.random() * 20 + 10} />
            </div>
          ))}
        </div>
  
        <div className={`content-container ${showContent ? 'show' : ''}`}>
          <h1 className="welcome-title">NumBuddy</h1>
          <p className="welcome-text">Your journey to math mastery begins here</p>
          {showButton && (
              <button className="start-button"
      onClick={() => navigate('/signin')}>Unlock Now
              <ChevronRight />
            </button>
          )}
        </div>
      </div>
    );
  };
  
  export default Welcome;