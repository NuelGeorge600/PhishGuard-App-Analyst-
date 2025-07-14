document.addEventListener("DOMContentLoaded", () => {
  fetch("/event-stats")
    .then(res => res.json())
    .then(data => {
      document.getElementById("eventCount").innerText = data.total_events || 0;
      document.getElementById("revenue").innerText = "₦" + (data.total_events * 50000 || 0).toLocaleString();
    })
    .catch(() => {
      document.getElementById("eventCount").innerText = "Error";
      document.getElementById("revenue").innerText = "Error";
    });
});