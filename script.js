const API_KEY = "abc123";

async function scanURL() {
  const url = document.getElementById("urlInput").value;
  const res = await fetch("/scan-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: url, api_key: API_KEY })
  });
  const data = await res.json();
  document.getElementById("scanResult").innerText = JSON.stringify(data, null, 2);
}

async function analyzeHeader() {
  const header = document.getElementById("emailHeader").value;
  const res = await fetch("/analyze-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ header: header })
  });
  const data = await res.json();
  document.getElementById("headerResult").innerText = JSON.stringify(data, null, 2);
}

async function trackEvent(eventType) {
  const userId = document.getElementById("userId").value;
  const res = await fetch("/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, event_type: eventType })
  });
  const data = await res.json();
  document.getElementById("revenueResult").innerText = JSON.stringify(data, null, 2);
}