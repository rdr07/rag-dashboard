// ── 1. LIVE CLOCK ──
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent =
    now.toLocaleTimeString('en-US', {hour12: false}) + ' UTC';
}
setInterval(updateClock, 1000);
updateClock();

// ── 2. COUNT UP ANIMATIONS ──
function countUp(elementId, target) {
  const el = document.getElementById(elementId);
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);
}

countUp('query-count', 1247);
countUp('vector-count', 3842);
countUp('threat-count', 7);

let rt = 0;
const rtEl = document.getElementById('response-time');
const rtTimer = setInterval(() => {
  rt += 14;
  if (rt >= 843) { rtEl.textContent = '843ms'; clearInterval(rtTimer); }
  else rtEl.textContent = rt + 'ms';
}, 16);

// ── 3. ACTIVITY LOG ──
const logs = [
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

logs.forEach((log, i) => setTimeout(() => addLog(log), i * 500));

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

// ── 6. LIVE QUERY COUNTER (simulates real activity) ──
let queryBase = 1247;
setInterval(() => {
  if (Math.random() > 0.6) {
    queryBase++;
    document.getElementById('query-count').textContent = queryBase.toLocaleString();
  }
}, 3000);
