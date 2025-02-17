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
    <div className="min-hs-screen">
      <div className="bg-white">
        <h2>NumBuddy</h2>
        <button onClick={handleSignIn}>
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