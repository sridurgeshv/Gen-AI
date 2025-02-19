import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Welcome from './components/Welcome';
import SignIn from './components/Signin';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; 
  }
  
  return user ? children : <Navigate to="/signin" />;
}

function App() {
  return (
      <AuthProvider>
        <Router>
         <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/signin" element={<SignIn />} />
          <Route 
            path="/dashboard" 
            element={
             <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } 
          />
         </Routes>
        </Router>
      </AuthProvider>
  );
}

export default App;