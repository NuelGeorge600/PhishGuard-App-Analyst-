const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// Main API endpoint for URL checking
app.post('/api/check-url', async (req, res) => {
  const { url } = req.body;
  const apiKey = process.env.VIRUSTOTAL_API_KEY;

  console.log('Received URL check request for:', url);
  console.log('API Key available:', apiKey ? 'Yes' : 'No');

  if (!apiKey || apiKey === 'your_api_key_here') {
    console.log('API key not configured');
    return res.json({ 
      error: 'VirusTotal API key not configured',
      message: 'API key needed for VirusTotal integration'
    });
  }

  try {
    console.log('Submitting URL to VirusTotal...');

    // Submit URL for analysis
    const submitResponse = await axios.post(
      'https://www.virustotal.com/api/v3/urls', 
      new URLSearchParams({ url: url }),
      { 
        headers: { 
          'x-apikey': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const analysisId = submitResponse.data.data.id;
    console.log('Analysis ID received:', analysisId);

    // Wait for analysis to complete
    console.log('Waiting for analysis to complete...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Get analysis results
    console.log('Fetching analysis results...');
    const resultResponse = await axios.get(
      `https://www.virustotal.com/api/v3/analyses/${analysisId}`, 
      {
        headers: { 'x-apikey': apiKey }
      }
    );

    const analysisData = resultResponse.data.data.attributes;
    const stats = analysisData.stats;

    console.log('Analysis results:', stats);

    const maliciousCount = stats.malicious || 0;
    const suspiciousCount = stats.suspicious || 0;
    const totalEngines = Object.values(stats).reduce((a, b) => a + b, 0);

    const result = {
      status: analysisData.status,
      total: totalEngines,
      positives: maliciousCount + suspiciousCount,
      malicious: maliciousCount,
      suspicious: suspiciousCount,
      stats: stats
    };

    console.log('Sending result:', result);
    res.json(result);

  } catch (error) {
    console.error('VirusTotal API Error:', error.response?.data || error.message);
    res.json({ 
      error: 'Error analyzing the URL with VirusTotal',
      message: error.response?.data?.error?.message || error.message 
    });
  }
});

// Root route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`PhishGuard Server running on port ${PORT}`);
  console.log(`Environment loaded from: ${path.join(__dirname, '.env')}`);
  console.log(`VirusTotal API Key configured: ${process.env.VIRUSTOTAL_API_KEY ? 'Yes' : 'No'}`);
  if (process.env.VIRUSTOTAL_API_KEY) {
    console.log(`API Key preview: ${process.env.VIRUSTOTAL_API_KEY.substring(0, 8)}...`);
  }
});