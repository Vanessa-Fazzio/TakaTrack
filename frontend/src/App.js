<<<<<<< HEAD
import React from 'react';
import './App.css';
import MapsAndNotifications from './components/MapsAndNotifications';

function App() {
  return (
    <div className="App">
      <h1>TakaTrack — Maps & Notifications</h1>
      <MapsAndNotifications />
    </div>
  );
}

export default App;
=======
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder component for protected routes - 1A will replace with actual pages
const PlaceholderPage = ({ title }) => (
  <div>
    <h1>{title}</h1>
    <p>This page will be built by Frontend Developer 1A</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PlaceholderPage title="Dashboard" />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
>>>>>>> 74bb4300876fc4e54dbf381014984a0fb585a7f3
