
async function checkURL() {
  const url = document.getElementById('urlInput').value.trim();
  const resultDiv = document.getElementById('result');
  
  // Clear previous results
  resultDiv.className = '';
  
  if (!url) {
    resultDiv.innerHTML = '⚠️ Please enter a URL';
    resultDiv.className = 'suspicious';
    return;
  }
  
  // Show checking status
  resultDiv.innerHTML = '🔍 Checking URL...';
  resultDiv.className = 'checking';
  
  // Basic client-side validation
  const warnings = [];
  
  // Check if URL starts with http/https
  if (!url.match(/^https?:\/\//i)) {
    warnings.push('URL should start with http:// or https://');
  }
  
  // Check for IP address usage
  if (url.match(/^https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
    warnings.push('Uses IP address instead of domain name');
  }
  
  // Check for suspicious characters
  if (url.includes('@')) {
    warnings.push('Contains @ symbol which can hide the real destination');
  }
  
  // Check for suspicious keywords
  const suspiciousKeywords = ['login', 'secure', 'bank', 'update', 'confirm', 'verify', 'suspend'];
  const foundKeywords = suspiciousKeywords.filter(keyword => 
    url.toLowerCase().includes(keyword)
  );
  
  if (foundKeywords.length > 0) {
    warnings.push(`Contains suspicious keywords: ${foundKeywords.join(', ')}`);
  }
  
  // Check for excessive subdomains
  try {
    const urlObj = new URL(url);
    const domainParts = urlObj.hostname.split('.');
    if (domainParts.length > 3) {
      warnings.push('Multiple subdomains detected - could be subdomain spoofing');
    }
  } catch (e) {
    warnings.push('Invalid URL format');
  }
  
  // Check for URL shorteners
  const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'short.link'];
  const isShortened = shorteners.some(shortener => url.includes(shortener));
  if (isShortened) {
    warnings.push('URL appears to be shortened - destination is hidden');
  }

  // Try VirusTotal API check
  let virusTotalResult = null;
  try {
    const response = await fetch('/api/check-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    
    const data = await response.json();
    console.log('VirusTotal response:', data);
    
    if (data.error) {
      console.log('VirusTotal error:', data.error);
    } else if (data.total !== undefined && data.positives !== undefined) {
      virusTotalResult = {
        total: data.total,
        positives: data.positives,
        malicious: data.malicious || data.positives,
        suspicious: data.suspicious || 0
      };
      console.log('VirusTotal result processed:', virusTotalResult);
    }
  } catch (error) {
    console.log('VirusTotal check failed:', error);
  }
  
  // Display results
  let resultHTML = '';
  let resultClass = '';
  
  // Check VirusTotal results first for priority
  if (virusTotalResult && virusTotalResult.positives > 0) {
    resultHTML = `
      ⚠️ <strong>This URL is potentially unsafe!</strong><br>
      🦠 <strong>VirusTotal:</strong> ${virusTotalResult.positives} out of ${virusTotalResult.total} security engines detected threats
    `;
    resultClass = 'suspicious';
  } else if (virusTotalResult && virusTotalResult.positives === 0) {
    resultHTML = `
      ✅ <strong>This URL appears to be safe</strong><br>
      🛡️ <strong>VirusTotal:</strong> No threats detected (0 / ${virusTotalResult.total} engines)
    `;
    resultClass = 'safe';
  } else if (warnings.length > 0) {
    resultHTML = `
      🚨 <strong>Suspicious URL Detected!</strong><br>
      <ul style="text-align: left; margin: 0.5em 0;">
        ${warnings.map(warning => `<li>${warning}</li>`).join('')}
      </ul>
    `;
    resultClass = 'suspicious';
  } else {
    resultHTML = '✅ <strong>Client-side checks passed</strong><br>No obvious suspicious patterns detected';
    resultClass = 'safe';
  }
  
  // Add additional warning if no VirusTotal result
  if (!virusTotalResult) {
    resultHTML += '<br><em>Note: VirusTotal analysis not available - using client-side validation only</em>';
  }
  
  resultHTML += '<br><em>Always stay vigilant online!</em>';
  
  resultDiv.innerHTML = resultHTML;
  resultDiv.className = resultClass;
}

// Allow Enter key to trigger check
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('urlInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      checkURL();
    }
  });
});
