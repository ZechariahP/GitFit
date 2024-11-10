import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import MainPage from './components/MainPage';
import './App.css';

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('user'); // Check if the user is authenticated

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={isAuthenticated ? <MainPage /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect to login page by default */}
      </Routes>
    </Router>
  );
};

export default App;