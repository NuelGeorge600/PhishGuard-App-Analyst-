import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import UrlScanner from './components/UrlScanner';
import EmailAnalyzer from './components/EmailAnalyzer';
import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';
import './styles.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/scan-url" element={<UrlScanner />} />
          <Route path="/analyze-email" element={<EmailAnalyzer />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
