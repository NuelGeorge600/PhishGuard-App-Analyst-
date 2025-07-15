import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useDeviceFingerprint from '../hooks/useDeviceFingerprint';

const LandingPage = () => {
  const navigate = useNavigate();
  const fingerprint = useDeviceFingerprint();

  const handleAction = async (actionType) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/${actionType}`, {
        fingerprint,
        action: actionType
      });
      // Redirect or show success message
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="landing-container">
      <h1>Welcome to My Bio Page</h1>
      <p>Security Researcher | Web Developer</p>
      
      <div className="action-buttons">
        <button onClick={() => handleAction('visit')}>Visit</button>
        <button onClick={() => handleAction('signup')}>Sign Up</button>
        <button onClick={() => navigate('/login')}>Login</button>
      </div>
      
      <div className="security-tools">
        <h2>Security Tools</h2>
        <button onClick={() => navigate('/scan-url')}>Scan URL</button>
        <button onClick={() => navigate('/analyze-email')}>Analyze Email</button>
      </div>
    </div>
  );
};

export default LandingPage;
