const state = {
  activeRoute: "home",
  isAnimating: false,
  charts: {},
  mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  ring: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
};

const navItems = Array.from(document.querySelectorAll(".nav-item"));
const pages = Array.from(document.querySelectorAll(".page-section"));
const wipe = document.getElementById("transition-wipe");
const hudRoute = document.getElementById("hud-route");
const pageStage = document.getElementById("page-stage");
const cursorDot = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");
const wipeLabel = document.getElementById("wipe-label");
const contextDock = document.getElementById("context-dock");
const dockTitle = document.getElementById("dock-title");
const dockBody = document.getElementById("dock-body");
const dockCitations = document.getElementById("dock-citations");
const dockToggle = document.getElementById("dock-toggle");
const detailDrawer = document.getElementById("detail-drawer");
const detailBackdrop = document.getElementById("detail-backdrop");
const drawerClose = document.getElementById("drawer-close");
const drawerTitle = document.getElementById("drawer-title");
const drawerSummary = document.getElementById("drawer-summary");
const drawerReading = document.getElementById("drawer-reading");
const drawerMeaning = document.getElementById("drawer-meaning");
const drawerLinks = document.getElementById("drawer-links");

const chartPalette = {
  navy: "#0f172a",
  blue: "#2563eb",
  sky: "#38bdf8",
  slate: "#94a3b8",
  muted: "#64748b",
  grid: "rgba(15, 23, 42, 0.07)",
  whiteGrid: "rgba(226, 232, 240, 0.12)"
};

const sources = {
  grandView: { label: "Grand View", url: "https://www.grandviewresearch.com/industry-analysis/autonomous-vehicles-market" },
  marketUs: { label: "Market.us", url: "https://www.news.market.us/autonomous-vehicles-statistics/" },
  mckinseyIndustry: { label: "McKinsey AV", url: "https://www.mckinsey.com/features/mckinsey-center-for-future-mobility/our-insights/future-of-autonomous-vehicles-industry" },
  mckinseyConsumer: { label: "McKinsey Consumer", url: "https://www.mckinsey.com/industries/automotive-and-assembly/our-insights/autonomous-drivings-future-convenient-and-connected" },
  econObservatory: { label: "Econ Observatory", url: "https://www.economicsobservatory.com/what-might-be-the-economic-implications-of-autonomous-vehicles" },
  aaa: { label: "AAA", url: "https://newsroom.aaa.com/2024/03/aaa-fear-of-self-driving-cars-persists-as-industry-faces-an-uncertain-future/" },
  pew: { label: "Pew", url: "https://www.pewresearch.org/internet/2022/03/17/americans-cautious-about-the-deployment-of-driverless-cars/" },
  blsTruck: { label: "BLS Trucking", url: "https://www.bls.gov/ooh/transportation-and-material-moving/heavy-and-tractor-trailer-truck-drivers.htm" },
  blsTaxi: { label: "BLS Taxi", url: "https://www.bls.gov/ooh/transportation-and-material-moving/taxi-drivers-and-chauffeurs.htm" },
  mckinseyFreight: { label: "McKinsey Freight", url: "https://www.mckinsey.com/industries/automotive-and-assembly/our-insights/will-autonomy-usher-in-the-future-of-truck-freight-transportation" },
  crunchbase: { label: "Crunchbase", url: "https://news.crunchbase.com/transportation/autonomous-driving-startup-funding-wayve-cruise/" },
  waymo: { label: "Waymo", url: "https://waymo.com/blog/2026/02/waymo-raises-usd16-billion-investment-round/" },
  driverlessDigest: { label: "Driverless Digest", url: "https://www.thedriverlessdigest.com/p/15-charts-that-explain-the-autonomous" }
};

const pageMeaning = {
  home: {
    title: "Home: the whole argument",
    body: "The opening claim is that autonomous vehicles are not just a nicer car feature. They change production costs, ownership models, labor demand, insurance, city policy, and platform power all at once.",
    citations: ["grandView", "marketUs", "mckinseyIndustry"]
  },
  "research-question": {
    title: "Research Question: what is being tested",
    body: "This page turns the topic into an economics problem: where does the new equilibrium land once falling costs meet uncertain consumer trust and regulation?",
    citations: ["econObservatory", "mckinseyIndustry"]
  },
  "market-structure": {
    title: "Market Structure: why a few firms matter",
    body: "AV markets tend toward oligopoly because data, permits, fleet scale, and R&D spending compound. The question is not only who makes cars, but who controls the mobility platform.",
    citations: ["mckinseyIndustry", "waymo", "driverlessDigest"]
  },
  "consumer-adoption": {
    title: "Consumer Adoption: demand is trust-limited",
    body: "Even if the technology exists, consumers must believe it is safe and valuable. Fear, legal uncertainty, and price sensitivity slow the shift from early adopters to mass demand.",
    citations: ["aaa", "pew", "mckinseyConsumer"]
  },
  "labor-macro": {
    title: "Labor & Macro: innovation has a distribution problem",
    body: "AVs can raise productivity and GDP, but the gains are uneven. Driving occupations face disruption while software, fleet operations, logistics, and infrastructure roles expand.",
    citations: ["blsTruck", "blsTaxi", "econObservatory", "mckinseyFreight"]
  },
  investment: {
    title: "Investment: markets price the platform option",
    body: "Valuations reflect expectations about future networks, not just present revenue. That creates upside but also bubble risk when deployment timelines slip.",
    citations: ["crunchbase", "waymo", "mckinseyIndustry"]
  },
  policy: {
    title: "Policy: externalities decide the social outcome",
    body: "Regulation affects whether AV safety gains, congestion impacts, privacy risks, and platform concentration are managed as public-interest problems.",
    citations: ["econObservatory", "mckinseyIndustry"]
  },
  equilibrium: {
    title: "Equilibrium: where the system settles",
    body: "The final equilibrium is where lower costs, higher trust, platform scale, and policy permission meet. Price falls and quantity rises only if demand shifts outward with supply.",
    citations: ["grandView", "marketUs", "econObservatory"]
  },
  "data-lab": {
    title: "Data Lab: the controls behind the story",
    body: "The dashboard shows how the same thesis becomes a model: change trust, cost decline, region, and adoption horizon to see different market paths.",
    citations: ["marketUs", "mckinseyIndustry", "aaa", "blsTruck"]
  },
  sources: {
    title: "Sources: what supports the interface",
    body: "The evidence base mixes forecasts, surveys, labor statistics, funding reports, and economic theory. Links are live so every claim can be traced back.",
    citations: ["grandView", "mckinseyIndustry", "aaa", "blsTruck", "crunchbase"]
  },
  conclusion: {
    title: "Conclusion: the purpose of the site",
    body: "The site argues that AVs are a market architecture shift. The final question is how society shares the gains while limiting labor shock and platform concentration.",
    citations: ["econObservatory", "mckinseyIndustry", "grandView"]
  }
};

const chartDetails = {
  home: {
    title: "Adoption Signal",
    summary: "This curve combines market-growth forecasts with a trust index to show why AV adoption can be technologically ready before it is socially ready.",
    reading: "The blue line represents projected AV unit growth; the dashed line represents trust catching up more slowly. When the lines rise together, adoption becomes easier to sustain.",
    meaning: "The main takeaway is that supply improvements alone are not enough. AV markets need both cheaper technology and greater willingness to ride.",
    citations: ["grandView", "marketUs", "aaa"]
  },
  concentration: {
    title: "Market-Power Index",
    summary: "This placeholder compares strategic power across platform players, installed-base leaders, legacy OEMs, startups, and rideshare networks.",
    reading: "Higher bars mean stronger control over data, fleets, capital, or deployment access. It is an index, not a final market-share claim.",
    meaning: "The economic concept is oligopoly: a small number of firms can shape price, access, standards, and innovation speed.",
    citations: ["mckinseyIndustry", "waymo", "driverlessDigest"]
  },
  trust: {
    title: "Trust Curve",
    summary: "This chart contrasts willingness to ride with fear of fully autonomous vehicles.",
    reading: "The fear barrier starts high, while willingness rises as safety proof, legal clarity, and city pilots become visible.",
    meaning: "Demand for AVs is behavioral. Consumers are not buying only transportation; they are buying confidence in a machine decision system.",
    citations: ["aaa", "pew", "mckinseyConsumer"]
  },
  labor: {
    title: "Labor Versus Autonomy Capital",
    summary: "This chart shows a stylized capital-deepening shift: firms substitute autonomous systems and fleet software for some driving labor.",
    reading: "The dashed labor line falls while autonomy capital rises, showing how production can become more capital-intensive.",
    meaning: "The macro issue is distribution. Productivity may rise, but workers in exposed roles need transition pathways.",
    citations: ["blsTruck", "blsTaxi", "mckinseyFreight"]
  },
  gdp: {
    title: "GDP Impact Channels",
    summary: "The doughnut chart breaks potential GDP gains into safety, productive travel time, logistics efficiency, and congestion effects.",
    reading: "Each slice is a channel through which AVs could raise output or reduce economic waste.",
    meaning: "GDP upside is not magic growth; it comes from fewer crashes, less wasted time, and cheaper movement of goods and people.",
    citations: ["econObservatory", "mckinseyFreight"]
  },
  investment: {
    title: "Valuation Map",
    summary: "This bubble chart positions companies by valuation and autonomy confidence.",
    reading: "Bubble size and position communicate how much investors are pricing future autonomy potential rather than present vehicle sales alone.",
    meaning: "Speculation is rational up to a point: if a firm owns a future mobility platform, its upside is much larger than a normal automaker's.",
    citations: ["crunchbase", "waymo", "mckinseyIndustry"]
  },
  policy: {
    title: "Policy Matrix",
    summary: "This radar chart compares public benefit against regulatory complexity across major policy domains.",
    reading: "Large gaps show areas where impact is high but governance is difficult, such as privacy, liability, and safety.",
    meaning: "Policy decides whether AVs produce broad welfare gains or private platform gains with unmanaged side effects.",
    citations: ["econObservatory", "mckinseyIndustry"]
  },
  equilibrium: {
    title: "Equilibrium Model",
    summary: "This graph represents the long-run movement toward a stable AV market once cost, trust, scale, and regulation align.",
    reading: "Supply rises as costs fall. Demand rises as trust improves. The long-run equilibrium is where those forces stabilize together.",
    meaning: "The final point is not one forecast number. It is the condition under which AVs become mainstream infrastructure.",
    citations: ["grandView", "marketUs", "econObservatory"]
  },
  dataLab: {
    title: "Forecast Explorer",
    summary: "The Data Lab chart compares base, delayed-trust, and accelerated-fleet scenarios.",
    reading: "The gap between curves shows how sensitive the market is to consumer trust and fleet deployment speed.",
    meaning: "The site becomes useful when viewers can see the assumptions, not just the conclusion.",
    citations: ["marketUs", "mckinseyIndustry", "aaa"]
  },
  sources: {
    title: "Evidence Mix",
    summary: "This chart shows how the research relies on multiple types of evidence rather than one source.",
    reading: "Forecasts support market sizing, surveys support demand assumptions, labor data supports macro risk, and funding data supports investment analysis.",
    meaning: "A stronger economics project explains where each claim comes from and what role that evidence plays.",
    citations: ["grandView", "aaa", "blsTruck", "crunchbase", "econObservatory"]
  }
};

function setHud(label) {
  if (hudRoute) hudRoute.textContent = label || "HOME";
}

function renderSourceLinks(keys = []) {
  return keys
    .map((key) => sources[key])
    .filter(Boolean)
    .map((source) => `<a class="hover-target" href="${source.url}" target="_blank" rel="noopener noreferrer">${source.label}</a>`)
    .join("");
}

function updateContextDock(route) {
  const info = pageMeaning[route] || pageMeaning.home;
  if (dockTitle) dockTitle.textContent = info.title;
  if (dockBody) dockBody.textContent = info.body;
  if (dockCitations) dockCitations.innerHTML = renderSourceLinks(info.citations);
  initHoverTargets();
}

function openChartDetails(key) {
  const detail = chartDetails[key];
  if (!detail || !detailDrawer) return;

  if (drawerTitle) drawerTitle.textContent = detail.title;
  if (drawerSummary) drawerSummary.textContent = detail.summary;
  if (drawerReading) drawerReading.textContent = detail.reading;
  if (drawerMeaning) drawerMeaning.textContent = detail.meaning;
  if (drawerLinks) drawerLinks.innerHTML = renderSourceLinks(detail.citations);

  detailDrawer.classList.add("is-open");
  detailDrawer.setAttribute("aria-hidden", "false");
  detailBackdrop?.classList.add("is-open");
  detailBackdrop?.setAttribute("aria-hidden", "false");
  initHoverTargets();
}

function closeChartDetails() {
  detailDrawer?.classList.remove("is-open");
  detailDrawer?.setAttribute("aria-hidden", "true");
  detailBackdrop?.classList.remove("is-open");
  detailBackdrop?.setAttribute("aria-hidden", "true");
}

function activePage() {
  return document.querySelector(".page-section.is-active");
}

function routeLabel(route) {
  const nav = navItems.find((item) => item.dataset.route === route);
  return nav?.dataset.label || route.replaceAll("-", " ").toUpperCase();
}

function triggerReveals(section) {
  section.querySelectorAll(".reveal").forEach((element) => {
    element.classList.remove("is-visible");
    window.setTimeout(() => element.classList.add("is-visible"), 40);
  });
}

function setActiveNav(route) {
  navItems.forEach((item) => item.classList.toggle("is-active", item.dataset.route === route));
}

function navigate(route) {
  if (state.isAnimating || route === state.activeRoute) return;

  const current = activePage();
  const next = document.getElementById(route);
  if (!current || !next) return;

  state.isAnimating = true;
  state.activeRoute = route;
  setActiveNav(route);
  setHud(routeLabel(route));
  updateContextDock(route);
  closeChartDetails();

  wipe?.classList.remove("active");
  if (wipeLabel) wipeLabel.textContent = routeLabel(route);
  void wipe?.offsetWidth;
  wipe?.classList.add("active");
  pageStage?.classList.add("is-transitioning");

  current.classList.add("is-leaving");
  current.classList.remove("is-active");

  window.setTimeout(() => {
    next.classList.add("is-active");
    next.scrollTop = 0;
    pageStage.scrollTop = 0;
    triggerReveals(next);
    initCharts(route);
    initHoverTargets();
    initGlassHover();
  }, 390);

  window.setTimeout(() => {
    current.classList.remove("is-leaving");
    wipe?.classList.remove("active");
    pageStage?.classList.remove("is-transitioning");
    state.isAnimating = false;
  }, 900);
}

function initNavigation() {
  navItems.forEach((item) => {
    item.addEventListener("click", () => navigate(item.dataset.route));
  });

  document.querySelectorAll("[data-jump], [data-route-link]").forEach((element) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();
      const route = element.dataset.jump || element.dataset.routeLink;
      navigate(route);
    });
  });
}

function initHoverTargets() {
  document.querySelectorAll(".hover-target, button, a, .panel, .metric-card, .source-card").forEach((element) => {
    if (element.dataset.hoverReady) return;
    element.dataset.hoverReady = "true";
    element.addEventListener("mouseenter", () => cursorRing?.classList.add("hover"));
    element.addEventListener("mouseleave", () => cursorRing?.classList.remove("hover"));
  });
}

function initGlassHover() {
  document.querySelectorAll(".liquid-glass, .panel, .metric-card, .source-card").forEach((element) => {
    if (element.dataset.glassReady) return;
    element.dataset.glassReady = "true";
    element.addEventListener("mousemove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      element.style.setProperty("--mx", `${x}%`);
      element.style.setProperty("--my", `${y}%`);
    });
  });
}

function initChartDetails() {
  document.querySelectorAll(".interactive-chart[data-chart-key]").forEach((element) => {
    if (element.dataset.detailReady) return;
    element.dataset.detailReady = "true";
    element.setAttribute("role", "button");
    element.setAttribute("tabindex", "0");
    element.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      openChartDetails(element.dataset.chartKey);
    });
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openChartDetails(element.dataset.chartKey);
      }
    });
  });

  drawerClose?.addEventListener("click", closeChartDetails);
  detailBackdrop?.addEventListener("click", closeChartDetails);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeChartDetails();
  });
}

function initMeaningDock() {
  updateContextDock(state.activeRoute);
  dockToggle?.addEventListener("click", () => {
    contextDock?.classList.toggle("is-collapsed");
    dockToggle.textContent = contextDock?.classList.contains("is-collapsed") ? "+" : "−";
  });
}

function initCursor() {
  window.addEventListener("mousemove", (event) => {
    state.mouse.x = event.clientX;
    state.mouse.y = event.clientY;
  });

  function frame() {
    state.ring.x += (state.mouse.x - state.ring.x) * 0.16;
    state.ring.y += (state.mouse.y - state.ring.y) * 0.16;

    if (cursorDot) {
      cursorDot.style.left = `${state.mouse.x}px`;
      cursorDot.style.top = `${state.mouse.y}px`;
    }

    if (cursorRing) {
      cursorRing.style.left = `${state.ring.x}px`;
      cursorRing.style.top = `${state.ring.y}px`;
    }

    requestAnimationFrame(frame);
  }

  frame();
}

function scrambleHero() {
  const target = document.getElementById("scramble-title");
  if (!target || !target.dataset.value) return;

  const finalValue = target.dataset.value;
  const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/+-";
  let iteration = 0;

  const timer = window.setInterval(() => {
    target.textContent = finalValue
      .split("")
      .map((letter, index) => {
        if (letter === " ") return " ";
        if (index < iteration) return finalValue[index];
        return glyphs[Math.floor(Math.random() * glyphs.length)];
      })
      .join("");

    if (iteration >= finalValue.length) {
      window.clearInterval(timer);
      target.textContent = finalValue;
    }

    iteration += 1.35;
  }, 28);
}

function initTerminalTabs() {
  const tabs = Array.from(document.querySelectorAll(".terminal-tab"));
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("is-active"));
      tab.classList.add("is-active");
    });
  });
}

function initCanvasNetwork() {
  const canvas = document.getElementById("network-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let particles = [];
  let lastFrame = 0;

  function resize() {
    width = canvas.width = window.innerWidth * window.devicePixelRatio;
    height = canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    particles = createParticles(Math.min(58, Math.floor(window.innerWidth / 24)));
  }

  function createParticles(count) {
    return Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22 * window.devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.22 * window.devicePixelRatio,
      r: (Math.random() * 1.6 + 0.6) * window.devicePixelRatio,
      a: Math.random() * 0.24 + 0.08
    }));
  }

  function step(timestamp = 0) {
    if (timestamp - lastFrame < 32) {
      requestAnimationFrame(step);
      return;
    }
    lastFrame = timestamp;

    ctx.clearRect(0, 0, width, height);

    const mx = state.mouse.x * window.devicePixelRatio;
    const my = state.mouse.y * window.devicePixelRatio;

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      const dxMouse = mx - p.x;
      const dyMouse = my - p.y;
      const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

      if (distMouse < 170 * window.devicePixelRatio) {
        p.x -= dxMouse * 0.0009;
        p.y -= dyMouse * 0.0009;
      }

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(37, 99, 235, ${p.a})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j += 2) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 128 * window.devicePixelRatio;
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(37, 99, 235, ${(1 - dist / maxDist) * 0.12})`;
          ctx.lineWidth = 0.8 * window.devicePixelRatio;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  }

  window.addEventListener("resize", resize);
  resize();
  step();
}

function chartBaseOptions({ dark = false, legend = false } = {}) {
  const grid = dark ? chartPalette.whiteGrid : chartPalette.grid;
  const color = dark ? "rgba(226, 232, 240, 0.72)" : chartPalette.muted;

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1300, easing: "easeOutQuart" },
    interaction: { intersect: false, mode: "index" },
    plugins: {
      legend: {
        display: legend,
        labels: {
          color,
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          font: { family: "Inter", weight: "700" }
        }
      },
      tooltip: {
        backgroundColor: dark ? "#020617" : "#0f172a",
        padding: 12,
        titleFont: { family: "Inter", weight: "800" },
        bodyFont: { family: "Inter", weight: "600" },
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: { color: grid, drawBorder: false },
        ticks: { color, font: { family: "Inter", weight: "700" } }
      },
      y: {
        beginAtZero: true,
        grid: { color: grid, drawBorder: false },
        ticks: { color, font: { family: "Inter", weight: "700" } }
      }
    }
  };
}

function getCanvas(id) {
  const canvas = document.getElementById(id);
  if (!canvas || typeof Chart === "undefined") return null;
  return canvas.getContext("2d");
}

function gradient(ctx, color) {
  const grad = ctx.createLinearGradient(0, 0, 0, 360);
  grad.addColorStop(0, color);
  grad.addColorStop(1, "rgba(255,255,255,0)");
  return grad;
}

function ensureChart(key, id, builder) {
  if (typeof Chart === "undefined") return;

  if (state.charts[key]) {
    state.charts[key].resize();
    state.charts[key].update();
    return;
  }

  const ctx = getCanvas(id);
  if (!ctx) return;

  state.charts[key] = builder(ctx);
}

function initCharts(route) {
  if (typeof Chart !== "undefined") {
    Chart.defaults.font.family = "Inter, system-ui, sans-serif";
    Chart.defaults.color = chartPalette.muted;
  }

  if (route === "home") {
    ensureChart("home", "chartHomeAdoption", (ctx) => new Chart(ctx, {
      type: "line",
      data: {
        labels: ["2023", "2025", "2027", "2030", "2032", "2035", "2040"],
        datasets: [
          {
            label: "Projected AV units",
            data: [21, 45, 72, 126, 210, 390, 720],
            borderColor: chartPalette.blue,
            backgroundColor: gradient(ctx, "rgba(37, 99, 235, 0.22)"),
            fill: true,
            borderWidth: 3,
            tension: 0.42,
            pointRadius: 0
          },
          {
            label: "Consumer trust index",
            data: [28, 33, 38, 46, 54, 63, 72],
            borderColor: chartPalette.navy,
            borderWidth: 2,
            borderDash: [6, 7],
            tension: 0.35,
            pointRadius: 0
          }
        ]
      },
      options: { ...chartBaseOptions({ legend: true }), scales: { ...chartBaseOptions().scales, y: { ...chartBaseOptions().scales.y, title: { display: true, text: "Index / units baseline", color: chartPalette.muted } } } }
    }));
  }

  if (route === "market-structure") {
    ensureChart("concentration", "chartConcentration", (ctx) => new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Waymo", "Tesla", "Legacy OEMs", "Startups", "Rideshare"],
        datasets: [{
          label: "Strategic power index",
          data: [88, 82, 54, 38, 44],
          backgroundColor: [chartPalette.navy, chartPalette.blue, "#64748b", "#94a3b8", chartPalette.sky],
          borderRadius: 6
        }]
      },
      options: chartBaseOptions()
    }));
  }

  if (route === "consumer-adoption") {
    ensureChart("trust", "chartTrust", (ctx) => new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Safety proof", "Legal clarity", "Price decline", "City pilots", "Mass access"],
        datasets: [
          {
            label: "Willingness to ride",
            data: [37, 42, 51, 61, 74],
            borderColor: chartPalette.blue,
            backgroundColor: gradient(ctx, "rgba(37, 99, 235, 0.2)"),
            fill: true,
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: "#ffffff",
            pointBorderColor: chartPalette.blue,
            pointBorderWidth: 2
          },
          {
            label: "Fear barrier",
            data: [66, 61, 55, 48, 39],
            borderColor: "#94a3b8",
            borderDash: [6, 6],
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 0
          }
        ]
      },
      options: chartBaseOptions({ legend: true })
    }));
  }

  if (route === "labor-macro") {
    ensureChart("labor", "chartLabor", (ctx) => new Chart(ctx, {
      type: "line",
      data: {
        labels: ["2025", "2028", "2030", "2032", "2035"],
        datasets: [
          { label: "Driving labor demand", data: [100, 92, 82, 70, 55], borderColor: "#94a3b8", borderWidth: 3, borderDash: [5, 6], tension: 0.35, pointRadius: 0 },
          { label: "Autonomy capital", data: [100, 130, 178, 240, 340], borderColor: chartPalette.blue, backgroundColor: gradient(ctx, "rgba(37, 99, 235, 0.18)"), fill: true, borderWidth: 3, tension: 0.35, pointRadius: 0 }
        ]
      },
      options: chartBaseOptions({ legend: true })
    }));

    ensureChart("gdp", "chartGDP", (ctx) => new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Safety gains", "Productive travel time", "Logistics efficiency", "Lower congestion"],
        datasets: [{
          data: [34, 28, 25, 13],
          backgroundColor: [chartPalette.blue, chartPalette.navy, chartPalette.sky, "#94a3b8"],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: chartPalette.muted, usePointStyle: true, font: { family: "Inter", weight: "700" } }
          }
        },
        animation: { duration: 1300, easing: "easeOutQuart" }
      }
    }));
  }

  if (route === "investment") {
    ensureChart("investment", "chartInvestment", (ctx) => new Chart(ctx, {
      type: "bubble",
      data: {
        datasets: [
          { label: "Waymo", data: [{ x: 126, y: 88, r: 24 }], backgroundColor: "rgba(37, 99, 235, 0.78)" },
          { label: "Tesla", data: [{ x: 1500, y: 92, r: 34 }], backgroundColor: "rgba(15, 23, 42, 0.82)" },
          { label: "GM", data: [{ x: 86, y: 54, r: 16 }], backgroundColor: "rgba(100, 116, 139, 0.72)" },
          { label: "Ford", data: [{ x: 52, y: 44, r: 14 }], backgroundColor: "rgba(148, 163, 184, 0.82)" },
          { label: "VW", data: [{ x: 20, y: 38, r: 11 }], backgroundColor: "rgba(56, 189, 248, 0.72)" }
        ]
      },
      options: {
        ...chartBaseOptions({ legend: true }),
        scales: {
          x: {
            title: { display: true, text: "Valuation / market cap, $B", color: chartPalette.muted },
            min: 0,
            max: 1600,
            grid: { color: chartPalette.grid },
            ticks: { color: chartPalette.muted }
          },
          y: {
            title: { display: true, text: "Autonomy confidence index", color: chartPalette.muted },
            min: 0,
            max: 100,
            grid: { color: chartPalette.grid },
            ticks: { color: chartPalette.muted }
          }
        }
      }
    }));
  }

  if (route === "policy") {
    ensureChart("policy", "chartPolicy", (ctx) => new Chart(ctx, {
      type: "radar",
      data: {
        labels: ["Safety", "Privacy", "Liability", "Competition", "Infrastructure", "Congestion"],
        datasets: [
          {
            label: "Public benefit",
            data: [92, 62, 72, 68, 78, 56],
            borderColor: chartPalette.blue,
            backgroundColor: "rgba(37, 99, 235, 0.16)",
            pointBackgroundColor: chartPalette.blue
          },
          {
            label: "Regulatory complexity",
            data: [76, 88, 82, 71, 64, 69],
            borderColor: chartPalette.navy,
            backgroundColor: "rgba(15, 23, 42, 0.09)",
            pointBackgroundColor: chartPalette.navy
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { color: chartPalette.muted, usePointStyle: true, font: { family: "Inter", weight: "700" } } }
        },
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 100,
            angleLines: { color: chartPalette.grid },
            grid: { color: chartPalette.grid },
            pointLabels: { color: chartPalette.muted, font: { family: "Inter", weight: "800" } },
            ticks: { display: false }
          }
        }
      }
    }));
  }

  if (route === "equilibrium") {
    ensureChart("equilibrium", "chartEquilibrium", (ctx) => new Chart(ctx, {
      type: "line",
      data: {
        labels: ["High price", "Cost fall", "Trust gain", "Fleet scale", "Policy clarity", "Long-run"],
        datasets: [
          { label: "Supply", data: [25, 42, 55, 70, 82, 94], borderColor: chartPalette.sky, backgroundColor: "rgba(56, 189, 248, 0.12)", fill: true, tension: 0.36, borderWidth: 3, pointRadius: 0 },
          { label: "Demand", data: [18, 28, 50, 66, 76, 88], borderColor: "#ffffff", borderDash: [6, 6], tension: 0.36, borderWidth: 2, pointRadius: 0 }
        ]
      },
      options: chartBaseOptions({ dark: true, legend: true })
    }));
  }

  if (route === "data-lab") {
    ensureChart("dataLab", "chartDataLab", (ctx) => new Chart(ctx, {
      type: "line",
      data: {
        labels: ["2024", "2026", "2028", "2030", "2032", "2035"],
        datasets: [
          { label: "Base case", data: [68, 104, 156, 214, 360, 620], borderColor: chartPalette.sky, backgroundColor: gradient(ctx, "rgba(56, 189, 248, 0.18)"), fill: true, tension: 0.38, borderWidth: 3, pointRadius: 0 },
          { label: "Delayed trust", data: [68, 92, 118, 156, 230, 360], borderColor: "rgba(226, 232, 240, 0.7)", borderDash: [6, 6], tension: 0.38, borderWidth: 2, pointRadius: 0 },
          { label: "Accelerated fleets", data: [68, 126, 210, 330, 560, 920], borderColor: chartPalette.blue, tension: 0.38, borderWidth: 2, pointRadius: 0 }
        ]
      },
      options: chartBaseOptions({ dark: true, legend: true })
    }));
  }

  if (route === "sources") {
    ensureChart("sources", "chartSources", (ctx) => new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Forecasts", "Surveys", "Labor", "Investment", "Theory"],
        datasets: [{
          label: "Evidence weight",
          data: [32, 21, 18, 16, 13],
          backgroundColor: [chartPalette.blue, chartPalette.sky, chartPalette.navy, "#64748b", "#94a3b8"],
          borderRadius: 6
        }]
      },
      options: chartBaseOptions()
    }));
  }
}

function init() {
  initNavigation();
  initCursor();
  initHoverTargets();
  initGlassHover();
  initChartDetails();
  initMeaningDock();
  initCanvasNetwork();
  initTerminalTabs();
  setHud("HOME");
  triggerReveals(document.getElementById("home"));
  scrambleHero();
  initCharts("home");
}

document.addEventListener("DOMContentLoaded", init);
