import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Settings, LogOut, User } from 'lucide-react';
import '../styles/UserMenu.css';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/welcome');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSettings = () => {
    navigate('/settings');
    setIsOpen(false);
  };

  return (
    <div className="user-menu">
      {/* User Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="user-icon-button"
      >
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="User"
            className="user-avatar"
          />
        ) : (
          <div className="user-icon-wrapper">
            <User className="user-icon" />
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="dropdown-menu">
          <button
            onClick={handleSettings}
            className="menu-item"
          >
            <Settings className="menu-icon" />
            Settings
          </button>
          <button
            onClick={handleSignOut}
            className="menu-item"
          >
            <LogOut className="menu-icon" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;