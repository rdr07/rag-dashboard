const JSONBIN_ID = '69bfbba1aa77b81da9096eea';
const JSONBIN_KEY = '$2a$10$Hn26zN1NYwQHRVnuLPfXjumfgHscmKPHbf3a1nNpenXM/zuFc.T5i'; // paste from notepad, don't share here!

// ── 1. LIVE CLOCK ──
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent =
    now.toLocaleTimeString('en-US', {hour12: false}) + ' UTC';
}
setInterval(updateClock, 1000);
updateClock();

// ── 2. FETCH LIVE DATA FROM JSONBIN ──
async function fetchLiveData() {
  try {
    const response = await fetch(
      `https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`,
      { headers: { 'X-Master-Key': JSONBIN_KEY } }
    );
    const data = await response.json();
    const r = data.record;

    document.getElementById('query-count').textContent = r.executions.toLocaleString();
    document.getElementById('response-time').textContent = r.responseTime + 'ms';
    document.getElementById('threat-count').textContent = r.errors;

  const logList = document.getElementById('log-list');

// Clear old entries first
logList.innerHTML = '';

// Add status entry
const entry = document.createElement('div');
entry.className = r.errors > 0 ? 'log-entry warn' : 'log-entry success';
entry.textContent = `✅ Live sync: ${new Date().toLocaleTimeString()} — Executions: ${r.executions} — Errors: ${r.errors}`;
logList.appendChild(entry);

// Add last updated entry
const logList = document.getElementById('log-list');
logList.innerHTML = '';
const entry = document.createElement('div');
entry.className = r.errors > 0 ? 'log-entry warn' : 'log-entry success';
entry.textContent = `✅ Live sync: ${new Date().toLocaleTimeString()} — Executions: ${r.executions} — Errors: ${r.errors}`;
logList.appendChild(entry);
const entry2 = document.createElement('div');
entry2.className = 'log-entry info';
entry2.textContent = `🕐 Last n8n update: ${r.lastUpdated}`;
logList.appendChild(entry2);

// ── 3. VECTORS COUNT ──
let v = 0;
const vEl = document.getElementById('vector-count');
const vTimer = setInterval(() => {
  v += 64;
  if (v >= 3842) { vEl.textContent = '3,842'; clearInterval(vTimer); }
  else vEl.textContent = v.toLocaleString();
}, 16);

// ── 4. SECURITY THREATS TABLE ──
const threats = [
  { time: '16:06:11', event: 'Prompt Injection Attempt',  source: 'Chat Webhook', severity: 'high' },
  { time: '15:43:02', event: 'Unusual Query Pattern',     source: 'AI Agent',     severity: 'med'  },
  { time: '14:21:44', event: 'API Rate Limit Hit',        source: 'Gemini API',   severity: 'med'  },
  { time: '13:58:30', event: 'Embedding Model Timeout',   source: 'Pinecone',     severity: 'low'  },
  { time: '13:10:05', event: 'File Hash Mismatch',        source: 'Google Drive', severity: 'low'  },
];

const tbody = document.getElementById('threat-table-body');
threats.forEach((t, i) => {
  setTimeout(() => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${t.time}</td>
      <td>${t.event}</td>
      <td>${t.source}</td>
      <td><span class="severity ${t.severity}">${t.severity.toUpperCase()}</span></td>
    `;
    tbody.appendChild(row);
  }, i * 300);
});

// ── 5. THREAT DETECTION LINE CHART ──
const ctx = document.getElementById('threatChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00','00:00','01:00','02:00'],
    datasets: [
      {
        label: 'Threats',
        data: [4, 7, 5, 12, 8, 15, 18, 10, 22, 14, 19, 25],
        borderColor: '#ff2d55',
        backgroundColor: 'rgba(255,45,85,0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#ff2d55',
        pointRadius: 4,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Resolved',
        data: [3, 5, 4, 9, 6, 11, 14, 8, 17, 11, 15, 20],
        borderColor: '#00ff9d',
        backgroundColor: 'rgba(0,255,157,0.05)',
        borderWidth: 2,
        pointBackgroundColor: '#00ff9d',
        pointRadius: 4,
        borderDash: [5, 5],
        tension: 0.4,
        fill: true,
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#a8d8ea', font: { family: 'Courier New', size: 11 } }
      }
    },
    scales: {
      x: { ticks: { color: '#3a6080', font: { family: 'Courier New', size: 10 } }, grid: { color: 'rgba(10,37,64,0.8)' } },
      y: { ticks: { color: '#3a6080', font: { family: 'Courier New', size: 10 } }, grid: { color: 'rgba(10,37,64,0.8)' } }
    }
  }
});
