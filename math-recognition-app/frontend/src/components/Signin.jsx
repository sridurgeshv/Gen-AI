import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Signin.css';

function SignIn() {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (result) {      
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white">
        <h2>Unleash the Power: Dive into the AI Frontier!</h2>
        <button className="sign-in-btn" onClick={handleSignIn}>
          <img
            src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg"
            alt="Google"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default SignIn;