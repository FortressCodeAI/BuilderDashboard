// CONFIG — replace with your gateway URL
const API_URL = "https://your-api-gateway-url.com";

// DOM
const contentArea = document.getElementById("content-area");
const eventLog = document.getElementById("event-log");

// NAVIGATION
document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => loadView(btn.dataset.view));
});

// INITIAL LOAD
loadView("dashboard");
verifyIdentity();
connectEventStream();

// VIEWS
function loadView(view) {
  if (view === "dashboard") {
    contentArea.innerHTML = `
      <h1>Builder Dashboard</h1>
      <p>Welcome to the BaseLayerOS Builder Environment.</p>
      <button onclick="openEnvelope()">Open Governance Envelope</button>
    `;
  }

  if (view === "modules") {
    contentArea.innerHTML = `
      <h1>Modules</h1>
      <p>Module builder coming soon.</p>
    `;
  }

  if (view === "envelope") {
    contentArea.innerHTML = `
      <h1>Governance Envelope</h1>
      <p>Select an envelope to view its lifecycle.</p>
    `;
  }

  if (view === "hitl") loadHITL();

  if (view === "logs") {
    contentArea.innerHTML = `<h1>Substrate Logs</h1>`;
  }
}

// AUTH
async function verifyIdentity() {
  const res = await fetch(`${API_URL}/auth/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      signature: "dev-mode",
      publicKey: "dev-mode",
      nonce: "123"
    })
  });

  const data = await res.json();
  document.getElementById("user-name").textContent = data.userId;
  document.getElementById("authority-level").textContent = `Authority: ${data.authorityLevel}`;
}

// OPEN ENVELOPE
async function openEnvelope() {
  const res = await fetch(`${API_URL}/envelope/open`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      request: "Test request from Builder UI",
      policyBindings: [],
      riskClass: "low"
    })
  });

  const data = await res.json();
  alert("Envelope opened: " + data.envelopeId);
}

// HITL
async function loadHITL() {
  const res = await fetch(`${API_URL}/hitl/pending`);
  const data = await res.json();

  contentArea.innerHTML = `
    <h1>HITL Approvals</h1>
    <pre>${JSON.stringify(data, null, 2)}</pre>
  `;
}

// EVENT STREAM
function connectEventStream() {
  const ws = new WebSocket(`${API_URL.replace("https", "wss")}/events`);

  ws.onmessage = (msg) => {
    const event = JSON.parse(msg.data);
    eventLog.textContent += `\n${new Date().toISOString()} — ${event.type}`;
  };
}
