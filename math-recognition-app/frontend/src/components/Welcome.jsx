import React, { useState, useEffect } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/Welcome.css";
import backgroundVideo from "../assets/math_bg.mp4"; // Ensure video is added to the assets folder

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
      {/* Video Background */}
      <video autoPlay loop muted playsinline className="background-video">
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Floating Stars */}
      <div className="stars-container">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          >
            <Sparkles className="text-white/20" size={Math.random() * 20 + 10} />
          </div>
        ))}
      </div>

      {/* Welcome Content */}
      <div className={`content-container ${showContent ? "show" : ""}`}>
        <h1 className="welcome-title">NumBuddy</h1>
        <p className="welcome-text">
          AI-powered Math Recognition <br />
          <span className="highlight-text">Transform Numbers into Knowledge</span>
        </p>
        {showButton && (
          <button className="start-button" onClick={() => navigate("/signin")}>
            Unlock Now
            <ChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default Welcome;