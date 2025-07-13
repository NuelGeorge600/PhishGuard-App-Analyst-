
const checkButton = document.getElementById("checkButton");
const resultBox = document.getElementById("resultBox");
const resultText = document.getElementById("resultText");
const resultIcon = document.getElementById("resultIcon");

const useFakeMode = false; // Set to true to simulate results

checkButton.addEventListener("click", async () => {
  const urlInput = document.getElementById("urlInput");
  const url = urlInput.value.trim();
  if (!url) return;

  resultBox.classList.add("d-none");

  if (useFakeMode) {
    const isPhishing = url.includes("phish");
    resultBox.classList.remove("d-none");
    resultBox.classList.toggle("alert-danger", isPhishing);
    resultBox.classList.toggle("alert-success", !isPhishing);
    resultIcon.textContent = isPhishing ? "❌" : "✅";
    resultText.textContent = isPhishing ? "This URL is potentially malicious." : "This URL appears safe.";
    return;
  }

  try {
    const response = await fetch("/api/check-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "abc123"
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();
    resultBox.classList.remove("d-none");

    if (response.ok) {
      const { isPhishing, positives } = data;
      resultBox.classList.toggle("alert-danger", isPhishing);
      resultBox.classList.toggle("alert-success", !isPhishing);
      resultIcon.textContent = isPhishing ? "❌" : "✅";
      resultText.textContent = isPhishing
        ? `⚠️ Detected by ${positives} engine(s). This URL may be malicious.`
        : "✅ This URL appears safe.";
    } else {
      throw new Error(data.error || "Unknown error");
    }
  } catch (error) {
    resultBox.classList.remove("d-none", "alert-success");
    resultBox.classList.add("alert-danger");
    resultIcon.textContent = "❌";
    resultText.textContent = "❌ Error checking the URL";
    console.error("Error:", error.message);
  }
});
