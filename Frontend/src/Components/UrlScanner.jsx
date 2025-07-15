import React, { useState } from 'react';
import axios from 'axios';

const UrlScanner = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const scanUrl = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/analyze-url`, { url });
      setResult(response.data);
    } catch (error) {
      console.error('Error scanning URL:', error);
      setResult({ error: 'Failed to scan URL' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scanner-container">
      <h2>Website Safety Checker</h2>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL to scan"
      />
      <button onClick={scanUrl} disabled={loading}>
        {loading ? 'Scanning...' : 'Scan URL'}
      </button>
      
      {result && (
        <div className="result">
          <h3>Scan Results:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UrlScanner;
