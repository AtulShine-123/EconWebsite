// --- DOM Elements ---
const navItems = document.querySelectorAll('.nav-item');
const wipe = document.getElementById('transition-wipe');
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

// --- Custom Cursor Logic ---
document.addEventListener('mousemove', (e) => {
  cursorDot.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
  cursorRing.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
});
document.querySelectorAll('button, a, .card, .fake-toggle').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

// --- SPA Routing ---
let isAnimating = false;

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    if(isAnimating) return;
    
    const targetRoute = item.getAttribute('data-route');
    const currentActive = document.querySelector('.page-section.is-active');
    
    if(currentActive.id === targetRoute) return;
    
    isAnimating = true;
    
    // Trigger transition wipe
    wipe.classList.add('active');
    
    setTimeout(() => {
        // Swap active statistics on nav
        document.querySelector('.nav-item.is-active').classList.remove('is-active');
        item.classList.add('is-active');
        
        // Swap sections
        currentActive.classList.remove('is-active');
        const nextSection = document.getElementById(targetRoute);
        nextSection.classList.add('is-active');
        
        // Reset scroll
        document.querySelector('.main-content').scrollTop = 0;
        
        // Trigger Chart.js updates if entering specific sections
        initCharts(targetRoute);
        
        // Reset fade-ups for new section
        resetFadeUps(nextSection);
    }, 600); // Wait for wipe to cover screen
    
    setTimeout(() => {
        wipe.classList.remove('active');
        isAnimating = false;
        triggerFadeUps();
    }, 1200);
  });
});

// --- Scroll Animations (Fade Up) ---
function resetFadeUps(section) {
  const fadeEls = section.querySelectorAll('.fade-up');
  fadeEls.forEach(el => el.classList.remove('visible'));
}

function triggerFadeUps() {
  const activeSection = document.querySelector('.page-section.is-active');
  if(!activeSection) return;
  const fadeEls = activeSection.querySelectorAll('.fade-up');
  fadeEls.forEach(el => {
    setTimeout(() => el.classList.add('visible'), 50);
  });
}
// Initial trigger
setTimeout(triggerFadeUps, 200);

// --- Background Network Canvas ---
const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
   this.x = Math.random() * width;
   this.y = Math.random() * height;
   this.vx = (Math.random() - 0.5) * 0.2;
   this.vy = (Math.random() - 0.5) * 0.2;
   this.radius = Math.random() * 2 + 1;
 }
 update() {
   this.x += this.vx;
   this.y += this.vy;
   if(this.x < 0 || this.x > width) this.vx *= -1;
   if(this.y < 0 || this.y > height) this.vy *= -1;
 }
 draw() {
   ctx.beginPath();
   ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
   ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
   ctx.fill();
 }
}
for(let i=0; i<60; i++) particles.push(new Particle());

function animateCanvas() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach(p => { p.update(); p.draw(); });
  // Connect near particles
  for(let i=0; i<particles.length; i++) {
    for(let j=i+1; j<particles.length; j++) {
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < 180) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(14, 165, 233, ${0.08 - dist/2500})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

// --- Chart.js Implementations (Premium Theme) ---
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = "#94a3b8";
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false, drawBorder: false } },
    y: { grid: { color: 'rgba(15, 23, 42, 0.05)', drawBorder: false }, beginAtZero: true }
  },
  elements: {
    line: { tension: 0.4 },
    point: { radius: 0, hitRadius: 10, hoverRadius: 6 }
  },
  animation: { duration: 2500, easing: 'easeOutQuart' }
};

let charts = {}; // Keep track of initialized charts

function initCharts(route) {
  if(route === 'market-structure' && !charts.market) {
    const ctx = document.getElementById('chartMarketShare').getContext('2d');
    charts.market = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Legacy Auto', 'Tech Giants', 'Pure AV Startups', 'Rideshare Net'],
        datasets: [{
          data: [30, 45, 15, 10],
          backgroundColor: ['#e2e8f0', '#0ea5e9', '#1e293b', '#94a3b8'],
          borderRadius: 6
        }]
      },
      options: chartOptions
    });
  }
  if(route === 'consumer-adoption' && !charts.adoption) {
    const ctx = document.getElementById('chartAdoption').getContext('2d');
    const x = Array.from({ length: 20 }, (_,i) => i + 2025);
    const y = x.map(yr => 100 / (1 + Math.exp(-0.5 * (yr - 2032))));
    
    let grad = ctx.createLinearGradient(0, 0, 0, 400);
    grad.addColorStop(0, 'rgba(14, 165, 233, 0.25)');
    grad.addColorStop(1, 'rgba(14, 165, 233, 0)');

    charts.adoption = new Chart(ctx, {
      type: 'line',
      data: {
        labels: x,
        datasets: [{
          label: 'Adoption %', data: y,
          borderColor: '#0ea5e9', backgroundColor: grad,
          borderWidth: 4, fill: true,
          pointBackgroundColor: '#ffffff', pointBorderWidth: 2
        }]
      },
      options: chartOptions
    });
  }
  if(route === 'labor-macro' && !charts.capital) {
    const ctx = document.getElementById('chartCapital').getContext('2d');
    charts.capital = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Y1','Y2','Y3','Y4','Y5'],
        datasets: [
          { label: 'Labor Demand', data: [100, 95, 80, 60, 45], borderColor: '#94a3b8', borderDash: [5,6], borderWidth: 2 },
          { label: 'Capital Inv', data: [100, 120, 160, 220, 390], borderColor: '#1e293b', borderWidth: 3 }
        ]
      },
      options: { ...chartOptions, plugins: { legend: { display: true, position: 'top', labels: { usePointStyle: false } } } }
    });
  }
  if(route === 'investment' && !charts.investment) {
    const ctx = document.getElementById('chartInvestment').getContext('2d');
    charts.investment = new Chart(ctx, {
      type: 'bubble',
      data: {
        datasets: [
          { label: 'Waymo', data: [{ x: 2026, y: 150, r: 25 }], backgroundColor: 'rgba(14, 165, 233, 0.8)' },
          { label: 'Tesla', data: [{ x: 2027, y: 200, r: 35 }], backgroundColor: 'rgba(30, 41, 59, 0.8)' },
          { label: 'Aurora', data: [{ x: 2026, y: 50, r: 15 }], backgroundColor: 'rgba(148, 163, 180, 0.8)' }
        ]
      },
      options: {
        ...chartOptions,
        plugins: { legend: { display: true } },
        scales: { x: { min: 2025, max: 2029, grid: { display: false } }, y: { grid: { display: false } } }
      }
    });
  }
}

// ----------------------------------------------------
// 3D Parallax Hover for Cards
// ----------------------------------------------------
function initParallaxCards() {
  document.querySelectorAll('.card, .stat-card, .featured-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
      card.style.transition = 'none';
      card.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.transition = 'transform 0.5s var(--ease-spring), box-shadow 0.5s var(--ease-spring), background 0.5s';
      card.style.zIndex = '1';
    });
  });
}
initParallaxCards();

// ----------------------------------------------------
// Chart.js Implementations (Mock Data)
// ----------------------------------------------------

Chart.defaults.color = '#64748b';
