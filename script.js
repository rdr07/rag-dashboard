const JSONBIN_ID = '69bfbba1aa77b81da9096eea';
const JSONBIN_KEY = '$2a$10$Hn26zN1NYwQHRVnuLPfXjumfgHscmKPHbf3a1nNpenXM/zuFc.T5i'; // paste from notepad, don't share here!

// ── 1. LIVE CLOCK ──
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent =
    now.toLocaleTimeString('en-US', { hour12: false }) + ' UTC';
}
setInterval(updateClock, 1000);
updateClock();
 
// ── 2. SIMULATED LIVE DATA (replaces JSONBin) ──
let executions = 1247;
let responseTime = 312;
let threats = 37;
 
function fetchLiveData() {
  // Simulate live changes
  executions += Math.floor(Math.random() * 5) + 1;
  responseTime = Math.floor(Math.random() * 200) + 250;
  if (Math.random() < 0.15) threats += 1;
 
  document.getElementById('query-count').textContent = executions.toLocaleString();
  document.getElementById('response-time').textContent = responseTime + 'ms';
  document.getElementById('threat-count').textContent = threats;
 
  // Live log entry
  const logMessages = [
    { msg: 'Query processed — AI Agent responded in ' + responseTime + 'ms', type: 'success' },
    { msg: 'Pinecone vector retrieval — ' + (Math.floor(Math.random() * 10) + 3) + ' chunks fetched', type: 'info' },
    { msg: 'Gemini embedding generated successfully', type: 'success' },
    { msg: 'Drive trigger fired — new document detected', type: 'info' },
    { msg: 'Rate limit warning — Gemini API at 85% quota', type: 'warn' },
    { msg: 'Unusual query pattern detected — flagged for review', type: 'danger' },
  ];
 
  const pick = logMessages[Math.floor(Math.random() * logMessages.length)];
  const now = new Date().toLocaleTimeString('en-US', { hour12: false });
  const logList = document.getElementById('log-list');
  const entry = document.createElement('div');
  entry.className = 'log-entry ' + pick.type;
  entry.textContent = '[' + now + '] ' + pick.msg;
  logList.insertBefore(entry, logList.firstChild);
 
  // Keep log to max 12 entries
  while (logList.children.length > 12) {
    logList.removeChild(logList.lastChild);
  }
}
 
fetchLiveData();
setInterval(fetchLiveData, 4000);
 
// ── 3. VECTORS COUNT ANIMATION ──
let v = 0;
const vEl = document.getElementById('vector-count');
const vTimer = setInterval(() => {
  v += 64;
  if (v >= 3842) {
    vEl.textContent = '3,842';
    clearInterval(vTimer);
  } else {
    vEl.textContent = v.toLocaleString();
  }
}, 16);
 
// ── 4. SECURITY THREATS TABLE ──
const threatData = [
  { time: '16:06:11', event: 'Prompt Injection Attempt',  source: 'Chat Webhook', severity: 'high' },
  { time: '15:43:02', event: 'Unusual Query Pattern',     source: 'AI Agent',     severity: 'med'  },
  { time: '14:21:44', event: 'API Rate Limit Hit',        source: 'Gemini API',   severity: 'med'  },
  { time: '13:58:30', event: 'Embedding Model Timeout',   source: 'Pinecone',     severity: 'low'  },
  { time: '13:10:05', event: 'File Hash Mismatch',        source: 'Google Drive', severity: 'low'  },
];
 
const tbody = document.getElementById('threat-table-body');
threatData.forEach((t, i) => {
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
const threatChart = new Chart(ctx, {
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
 
// ── 6. LIVE CHART UPDATE ──
setInterval(() => {
  const newThreat = Math.floor(Math.random() * 10) + 15;
  const newResolved = Math.floor(newThreat * 0.75);
  threatChart.data.datasets[0].data.push(newThreat);
  threatChart.data.datasets[1].data.push(newResolved);
  threatChart.data.datasets[0].data.shift();
  threatChart.data.datasets[1].data.shift();
  const now = new Date();
  threatChart.data.labels.push(now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0'));
  threatChart.data.labels.shift();
  threatChart.update('none');
}, 8000);
