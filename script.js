const N8N_URL = 'https://diyarathod.app.n8n.cloud';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwYWQ1MjIwMC1kOTlmLTRiY2YtYmQzOC0zNzQ2MDgzNWFiNTQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiY2M0NTA3ODAtMWY2MS00OWIwLWFmMzgtYzM0ZWZjYzFiYjBjIiwiaWF0IjoxNzcyMTMyNzk5LCJleHAiOjE3NzQ2NTI0MDB9.y6p0eXFKZU7P76ualqEvVV4lyhhAFCqsWS5S-g4kN4w'; 
const WORKFLOW_ID = 'WehNpRzyRjwIQ2jD';

// ── 1. LIVE CLOCK ──
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent =
    now.toLocaleTimeString('en-US', {hour12: false}) + ' UTC';
}
setInterval(updateClock, 1000);
updateClock();

// ── 2. REAL N8N DATA ──
async function fetchN8nData() {
  try {
    const response = await fetch(
      `${N8N_URL}/api/v1/executions?workflowId=${WORKFLOW_ID}&limit=25`,
      { headers: { 'X-N8N-API-KEY': API_KEY } }
    );

    const data = await response.json();
    const executions = data.data || [];

    // Update total queries with real count
    document.getElementById('query-count').textContent =
      executions.length.toLocaleString();

    // Calculate real average response time
    const times = executions
      .filter(e => e.stoppedAt && e.startedAt)
      .map(e => new Date(e.stoppedAt) - new Date(e.startedAt));

    if (times.length > 0) {
      const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
      document.getElementById('response-time').textContent = avg + 'ms';
    } else {
      document.getElementById('response-time').textContent = '0ms';
    }

    // Count failed executions as threats
    const failed = executions.filter(e => e.status === 'error').length;
    document.getElementById('threat-count').textContent = failed;

    // Update activity log with real execution data
    const logList = document.getElementById('log-list');
    logList.innerHTML = '';

    if (executions.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'log-entry info';
      empty.textContent = 'No executions found yet — run your workflow!';
      logList.appendChild(empty);
    } else {
      executions.slice(0, 8).forEach(e => {
        const entry = document.createElement('div');
        const status = e.status === 'success' ? 'success' : 'danger';
        const time = new Date(e.startedAt).toLocaleTimeString();
        entry.className = 'log-entry ' + status;
        entry.textContent = `${time} — Execution ${e.status.toUpperCase()} (ID: ${e.id.slice(0,8)}...)`;
        logList.appendChild(entry);
      });
    }

    console.log('✅ n8n connected! Executions loaded:', executions.length);

  } catch (error) {
    console.log('❌ n8n connection failed:', error.message);

    // Fall back to demo data if API fails
    document.getElementById('query-count').textContent = '1,247';
    document.getElementById('response-time').textContent = '843ms';
    document.getElementById('threat-count').textContent = '7';

    const logList = document.getElementById('log-list');
    logList.innerHTML = '';
    demoLogs.forEach((log, i) => {
      setTimeout(() => addLog(log), i * 500);
    });
  }
}

// Fetch immediately then every 30 seconds
fetchN8nData();
setInterval(fetchN8nData, 30000);

// ── 3. DEMO LOGS (used as fallback if API fails) ──
const demoLogs = [
  { type: 'success', message: 'Chat message processed — response delivered in 834ms' },
  { type: 'info',    message: 'Google Drive: file change detected — Jungle Palace 45e.pdf' },
  { type: 'success', message: 'PDF extracted — 18 chunks embedded into Pinecone' },
  { type: 'warn',    message: 'High token usage on last query — 4.2k tokens used' },
  { type: 'danger',  message: 'Suspicious prompt detected — possible injection attempt' },
];

function addLog(log) {
  const logList = document.getElementById('log-list');
  const entry = document.createElement('div');
  entry.className = 'log-entry ' + log.type;
  entry.textContent = log.message;
  logList.insertBefore(entry, logList.firstChild);
}

// ── 4. VECTORS COUNT (Pinecone - stays as demo for now) ──
let v = 0;
const vEl = document.getElementById('vector-count');
const vTimer = setInterval(() => {
  v += 64;
  if (v >= 3842) { vEl.textContent = '3,842'; clearInterval(vTimer); }
  else vEl.textContent = v.toLocaleString();
}, 16);

// ── 5. SECURITY THREATS TABLE ──
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

// ── 6. THREAT DETECTION LINE CHART ──
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
        labels: {
          color: '#a8d8ea',
          font: { family: 'Courier New', size: 11 }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#3a6080', font: { family: 'Courier New', size: 10 } },
        grid: { color: 'rgba(10,37,64,0.8)' }
      },
      y: {
        ticks: { color: '#3a6080', font: { family: 'Courier New', size: 10 } },
        grid: { color: 'rgba(10,37,64,0.8)' }
      }
    }
  }
});
