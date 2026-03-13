/* ============================================
   CropNet AI - Dashboard JavaScript
============================================ */

'use strict';

// ── Dashboard Navigation ───────────────────
document.querySelectorAll('.dash-nav-link').forEach(link => {
  link.addEventListener('click', function() {
    document.querySelectorAll('.dash-nav-link').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    const section = this.dataset.section;
    document.querySelectorAll('.dash-section').forEach(s => {
      s.style.display = s.dataset.section === section ? 'block' : 'none';
    });
  });
});

// ── Live Weather Widget ────────────────────
const weatherData = [
  { day: 'Mon', temp: 28, condition: '☀️', humidity: 62 },
  { day: 'Tue', temp: 25, condition: '🌤️', humidity: 71 },
  { day: 'Wed', temp: 22, condition: '🌧️', humidity: 85 },
  { day: 'Thu', temp: 27, condition: '⛅', humidity: 68 },
  { day: 'Fri', temp: 30, condition: '☀️', humidity: 55 },
  { day: 'Sat', temp: 26, condition: '🌤️', humidity: 60 },
  { day: 'Sun', temp: 24, condition: '🌥️', humidity: 73 },
];

function renderWeather() {
  const container = document.querySelector('#weather-widget');
  if (!container) return;

  container.innerHTML = weatherData.map((d, i) => `
    <div class="weather-day ${i === 0 ? 'today' : ''}" style="
      padding: 10px 8px;
      border-radius: 10px;
      text-align: center;
      background: ${i === 0 ? 'rgba(39,174,96,0.15)' : 'rgba(255,255,255,0.03)'};
      border: 1px solid ${i === 0 ? 'rgba(39,174,96,0.3)' : 'rgba(255,255,255,0.06)'};
      flex: 1;
    ">
      <div style="font-size: 0.68rem; color: var(--text-muted); margin-bottom: 4px;">${d.day}</div>
      <div style="font-size: 1.3rem; margin-bottom: 4px;">${d.condition}</div>
      <div style="font-family: var(--font-display); font-weight: 700; font-size: 0.95rem; color: var(--green-200);">${d.temp}°</div>
      <div style="font-size: 0.62rem; color: var(--text-muted);">${d.humidity}%</div>
    </div>
  `).join('');
  container.style.display = 'flex';
  container.style.gap = '6px';
}
renderWeather();

// ── Yield Prediction Chart ─────────────────
function renderYieldChart() {
  const canvas = document.getElementById('yield-chart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const data = [42, 55, 48, 63, 59, 72, 68, 81, 75, 88, 82, 95];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const w = canvas.width = canvas.parentElement.clientWidth;
  const h = canvas.height = 140;
  const pad = { top: 20, right: 20, bottom: 30, left: 40 };

  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);

  ctx.clearRect(0, 0, w, h);

  // Grid lines
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (h - pad.top - pad.bottom) * (i / 4);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();
  }

  // X labels
  const stepX = (w - pad.left - pad.right) / (data.length - 1);
  months.forEach((m, i) => {
    const x = pad.left + i * stepX;
    ctx.fillStyle = 'rgba(155,200,167,0.5)';
    ctx.font = '9px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(m, x, h - 6);
  });

  // Area gradient
  const gradient = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
  gradient.addColorStop(0, 'rgba(39,174,96,0.25)');
  gradient.addColorStop(1, 'rgba(39,174,96,0)');

  ctx.beginPath();
  data.forEach((val, i) => {
    const x = pad.left + i * stepX;
    const y = pad.top + (h - pad.top - pad.bottom) * (1 - (val - minVal) / (maxVal - minVal));
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(pad.left + (data.length - 1) * stepX, h - pad.bottom);
  ctx.lineTo(pad.left, h - pad.bottom);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Line
  ctx.beginPath();
  data.forEach((val, i) => {
    const x = pad.left + i * stepX;
    const y = pad.top + (h - pad.top - pad.bottom) * (1 - (val - minVal) / (maxVal - minVal));
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#2ecc71';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Dots
  data.forEach((val, i) => {
    const x = pad.left + i * stepX;
    const y = pad.top + (h - pad.top - pad.bottom) * (1 - (val - minVal) / (maxVal - minVal));
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#27ae60';
    ctx.strokeStyle = '#0a1f0e';
    ctx.lineWidth = 1.5;
    ctx.fill();
    ctx.stroke();
  });
}
renderYieldChart();

// ── Disease Detection Upload ───────────────
const uploadWidget = document.querySelector('.upload-widget');
const uploadInput = document.querySelector('#leaf-upload');
const uploadResult = document.querySelector('#upload-result');

uploadWidget?.addEventListener('click', () => uploadInput?.click());
uploadWidget?.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadWidget.style.borderColor = 'var(--green-300)';
  uploadWidget.style.background = 'rgba(39,174,96,0.08)';
});
uploadWidget?.addEventListener('dragleave', () => {
  uploadWidget.style.borderColor = '';
  uploadWidget.style.background = '';
});
uploadWidget?.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadWidget.style.borderColor = '';
  handleLeafUpload(e.dataTransfer.files[0]);
});
uploadInput?.addEventListener('change', (e) => handleLeafUpload(e.target.files[0]));

const diseases = [
  { name: 'Early Blight', confidence: 94, severity: 'Moderate', treatment: 'Apply copper-based fungicide every 7-10 days. Remove affected leaves immediately.' },
  { name: 'Healthy Leaf', confidence: 98, severity: 'None', treatment: 'No treatment needed. Continue regular care.' },
  { name: 'Powdery Mildew', confidence: 87, severity: 'Low', treatment: 'Apply neem oil solution. Ensure proper air circulation.' },
  { name: 'Bacterial Leaf Spot', confidence: 91, severity: 'High', treatment: 'Remove infected parts. Apply bactericide. Avoid overhead irrigation.' },
];

function handleLeafUpload(file) {
  if (!file || !uploadResult) return;

  const result = diseases[Math.floor(Math.random() * diseases.length)];
  const isHealthy = result.name === 'Healthy Leaf';

  uploadWidget.innerHTML = `
    <div class="upload-icon">🔬</div>
    <div style="font-size: 0.85rem; color: var(--green-300); font-weight: 500;">Analyzing: ${file.name}</div>
    <div class="shimmer" style="height: 4px; border-radius: 2px; margin-top: 8px; width: 100%;"></div>
  `;

  setTimeout(() => {
    uploadResult.innerHTML = `
      <div style="background: rgba(${isHealthy ? '39,174,96' : '231,76,60'},0.08); border: 1px solid rgba(${isHealthy ? '39,174,96' : '231,76,60'},0.2); border-radius: 12px; padding: 16px; margin-top: 12px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: 600; font-size: 0.95rem; color: ${isHealthy ? 'var(--green-300)' : '#e74c3c'};">${result.name}</span>
          <span style="font-size: 0.75rem; background: rgba(255,255,255,0.06); padding: 3px 10px; border-radius: 100px; color: var(--text-secondary);">Confidence: ${result.confidence}%</span>
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px;">Severity: <span style="color: var(--text-secondary);">${result.severity}</span></div>
        <div style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">${result.treatment}</div>
      </div>
    `;
    uploadWidget.innerHTML = `<div class="upload-icon">🍃</div><div class="upload-text">Upload another leaf image</div>`;
    uploadResult.style.display = 'block';
  }, 2200);
}

// ── Soil Input Form ────────────────────────
const soilForm = document.querySelector('#soil-form');
const soilResult = document.querySelector('#soil-result');

soilForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = soilForm.querySelector('button');
  btn.textContent = 'Analyzing...';
  btn.disabled = true;

  setTimeout(() => {
    const score = 68 + Math.floor(Math.random() * 25);
    const crops = ['Wheat', 'Maize', 'Soybean', 'Cotton', 'Rice', 'Tomato'];
    const recommended = crops.sort(() => Math.random() - 0.5).slice(0, 3);

    if (soilResult) {
      soilResult.style.display = 'block';
      soilResult.innerHTML = `
        <div style="margin-top: 16px; padding: 16px; background: rgba(39,174,96,0.06); border: 1px solid rgba(39,174,96,0.2); border-radius: 12px;">
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 0.82rem; color: var(--text-secondary);">
              <span>Soil Health Score</span><span style="color: var(--green-300); font-weight: 600;">${score}/100</span>
            </div>
            <div class="progress-bar"><div class="progress-fill" style="width: ${score}%;"></div></div>
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 6px;">Recommended Crops:</div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            ${recommended.map((c, i) => `<span style="padding: 4px 12px; border-radius: 100px; font-size: 0.75rem; font-weight: 600; background: rgba(39,174,96,${0.15 - i * 0.03}); color: var(--green-${i === 0 ? '200' : '300'}); border: 1px solid rgba(39,174,96,0.2);">#${i+1} ${c}</span>`).join('')}
          </div>
        </div>
      `;
    }

    btn.textContent = 'Analyze Soil →';
    btn.disabled = false;
  }, 2000);
});

// ── Real-time clock ────────────────────────
function updateClock() {
  const el = document.querySelector('#dash-clock');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
updateClock();
setInterval(updateClock, 1000);

// ── Refresh dashboard data ─────────────────
const refreshBtn = document.querySelector('#refresh-btn');
refreshBtn?.addEventListener('click', () => {
  refreshBtn.style.transform = 'rotate(360deg)';
  refreshBtn.style.transition = 'transform 0.6s ease';
  setTimeout(() => {
    refreshBtn.style.transform = '';
    renderYieldChart();
  }, 600);
});
