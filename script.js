
async function checkURL() {
  const url = document.getElementById('urlInput').value.trim();
  const resultDiv = document.getElementById('result');

  resultDiv.className = '';
  resultDiv.innerHTML = '🔍 Checking URL...';

  if (!url) {
    resultDiv.innerHTML = '⚠️ Please enter a URL';
    resultDiv.className = 'suspicious';
    return;
  }

  try {
    const response = await fetch('/api/check-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    if (data.error) {
      resultDiv.innerHTML = `⚠️ ${data.message || data.error}`;
      resultDiv.className = 'suspicious';
      return;
    }

    const positives = data.positives || 0;
    const total = data.total || 0;
    const status = data.status || 'unknown';

    if (positives === 0) {
      resultDiv.innerHTML = `✅ URL appears safe<br>Status: ${status}<br>VirusTotal Results: 0 / ${total}`;
      resultDiv.className = 'safe';
    } else {
      resultDiv.innerHTML = `🚨 Warning: Suspicious URL detected<br>Status: ${status}<br>VirusTotal Results: ${positives} / ${total}`;
      resultDiv.className = 'suspicious';
    }
  } catch (err) {
    resultDiv.innerHTML = '❌ Error checking the URL';
    resultDiv.className = 'suspicious';
    console.error(err);
  }
}
