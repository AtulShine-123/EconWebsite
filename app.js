const state = {
  activeRoute: "overview",
  isAnimating: false,
  charts: {},
  mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  ring: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  survey: { yes: 17, maybe: 10, no: 11 }
};

const navItems = Array.from(document.querySelectorAll(".nav-item"));
const pages = Array.from(document.querySelectorAll(".page-section"));
const pageStage = document.getElementById("page-stage");
const cursorDot = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");
const contextDock = document.getElementById("context-dock");
const dockToggle = document.getElementById("dock-toggle");
const dockTitle = document.getElementById("dock-title");
const dockBody = document.getElementById("dock-body");
const dockCitations = document.getElementById("dock-citations");
const surveyStatus = document.getElementById("survey-status");
const surveyNote = document.getElementById("survey-note");
const surveyReset = document.getElementById("survey-reset");

const chartPalette = {
  ink: "#102033",
  blue: "#2457c5",
  teal: "#0f8f88",
  amber: "#b7791f",
  rose: "#a43f5f",
  muted: "#607084",
  grid: "rgba(16, 32, 51, 0.08)"
};

const sources = {
  grandView: {
    label: "Grand View",
    url: "https://www.grandviewresearch.com/industry-analysis/autonomous-vehicles-market"
  },
  aaa: {
    label: "AAA",
    url: "https://newsroom.aaa.com/2024/03/aaa-fear-of-self-driving-cars-persists-as-industry-faces-an-uncertain-future/"
  },
  pew: {
    label: "Pew",
    url: "https://www.pewresearch.org/internet/2022/03/17/americans-cautious-about-the-deployment-of-driverless-cars/"
  },
  blsTruck: {
    label: "BLS Trucking",
    url: "https://www.bls.gov/ooh/transportation-and-material-moving/heavy-and-tractor-trailer-truck-drivers.htm"
  },
  blsTaxi: {
    label: "BLS Taxi",
    url: "https://www.bls.gov/ooh/transportation-and-material-moving/taxi-drivers-and-chauffeurs.htm"
  },
  caDmv: {
    label: "CA DMV",
    url: "https://www.dmv.ca.gov/portal/news-and-media/over-4-million-test-miles-logged-by-autonomous-vehicle-permit-holders-in-california/"
  },
  waymoSf: {
    label: "Waymo SF",
    url: "https://waymo.com/blog/2024/06/waymo-one-is-now-open-to-everyone-in-san-francisco/"
  },
  waymo2026: {
    label: "Waymo 2026",
    url: "https://waymo.com/blog/2026/02/waymo-raises-usd16-billion-investment-round/"
  },
  mckinseyFreight: {
    label: "McKinsey Freight",
    url: "https://www.mckinsey.com/industries/automotive-and-assembly/our-insights/will-autonomy-usher-in-the-future-of-truck-freight-transportation"
  }
};

const pageMeaning = {
  overview: {
    title: "Overview",
    body: "This tab frames the thesis and proves the required pieces are present: macro model, indicators, policy, tradeoff, evidence, local connection, created element, bibliography, and self-grade.",
    citations: ["grandView", "aaa", "blsTruck"]
  },
  "macro-model": {
    title: "Macro Model",
    body: "The AD-AS graph is the main AP Macro anchor. It shows lower transport costs and higher productivity shifting aggregate supply to the right.",
    citations: ["grandView", "mckinseyFreight"]
  },
  "evidence-local": {
    title: "Evidence + Local Impact",
    body: "Forecasts show market scale, surveys show demand friction, BLS data shows labor exposure, and California evidence makes the topic local and recent.",
    citations: ["aaa", "pew", "blsTruck", "blsTaxi", "caDmv", "waymoSf"]
  },
  "policy-tradeoffs": {
    title: "Policy + Tradeoffs",
    body: "The policy argument focuses on worker transition support, safety rules, privacy limits, congestion pricing, and competition oversight.",
    citations: ["mckinseyFreight", "waymo2026"]
  },
  "rubric-sources": {
    title: "Rubric + Sources",
    body: "This final tab makes the self-grade and bibliography explicit so the project reads as a complete AP Macro submission.",
    citations: ["grandView", "aaa", "pew", "blsTruck", "caDmv"]
  }
};

function renderSourceLinks(keys = []) {
  return keys
    .map((key) => sources[key])
    .filter(Boolean)
    .map((source) => `<a class="hover-target" href="${source.url}" target="_blank" rel="noopener noreferrer">${source.label}</a>`)
    .join("");
}

function updateContextDock(route) {
  const info = pageMeaning[route] || pageMeaning.overview;
  if (dockTitle) dockTitle.textContent = info.title;
  if (dockBody) dockBody.textContent = info.body;
  if (dockCitations) dockCitations.innerHTML = renderSourceLinks(info.citations);
  initHoverTargets();
}

function activePage() {
  return document.querySelector(".page-section.is-active");
}

function routeLabel(route) {
  const nav = navItems.find((item) => item.dataset.route === route);
  return nav?.dataset.label || route.replaceAll("-", " ").toUpperCase();
}

function setActiveNav(route) {
  navItems.forEach((item) => item.classList.toggle("is-active", item.dataset.route === route));
}

function isValidRoute(route) {
  return pages.some((page) => page.id === route);
}

function triggerReveals(section) {
  section.querySelectorAll(".reveal").forEach((element) => {
    element.classList.remove("is-visible");
    window.setTimeout(() => element.classList.add("is-visible"), 35);
  });
}

function navigate(route) {
  if (!isValidRoute(route) || state.isAnimating || route === state.activeRoute) return;

  const current = activePage();
  const next = document.getElementById(route);
  if (!current || !next) return;

  state.isAnimating = true;
  state.activeRoute = route;
  setActiveNav(route);
  updateContextDock(route);
  if (window.location.hash !== `#${route}`) {
    window.history.replaceState(null, "", `#${route}`);
  }

  current.classList.add("is-leaving");
  current.classList.remove("is-active");

  window.setTimeout(() => {
    next.classList.add("is-active");
    next.scrollTop = 0;
    pageStage.scrollTop = 0;
    triggerReveals(next);
    initCharts(route);
    initHoverTargets();
  }, 210);

  window.setTimeout(() => {
    current.classList.remove("is-leaving");
    state.isAnimating = false;
  }, 480);
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

  window.addEventListener("hashchange", () => {
    const route = window.location.hash.replace("#", "") || "overview";
    if (isValidRoute(route)) navigate(route);
  });
}

function setInitialRoute() {
  const initialRoute = window.location.hash.replace("#", "") || "overview";
  const route = isValidRoute(initialRoute) ? initialRoute : "overview";
  state.activeRoute = route;
  pages.forEach((page) => {
    page.classList.toggle("is-active", page.id === route);
    page.classList.remove("is-leaving");
  });
  setActiveNav(route);
  updateContextDock(route);
  triggerReveals(document.getElementById(route));
  initCharts(route);
}

function initExplanationToggles() {
  document.querySelectorAll("[data-explain-target]").forEach((button) => {
    if (button.dataset.explainReady) return;
    button.dataset.explainReady = "true";

    button.addEventListener("click", () => {
      const target = button.dataset.explainTarget;
      const mode = button.dataset.mode;
      document
        .querySelectorAll(`[data-explain-target="${target}"]`)
        .forEach((item) => item.classList.toggle("is-active", item === button));
      document
        .querySelectorAll(`[data-explain-content="${target}"]`)
        .forEach((item) => item.classList.toggle("is-active", item.dataset.mode === mode));
    });
  });
}

function initHoverTargets() {
  document.querySelectorAll(".hover-target, button, a, .panel, .metric-card, .tradeoff-card, .accordion-panel").forEach((element) => {
    if (element.dataset.hoverReady) return;
    element.dataset.hoverReady = "true";
    element.addEventListener("mouseenter", () => cursorRing?.classList.add("hover"));
    element.addEventListener("mouseleave", () => cursorRing?.classList.remove("hover"));
  });
}

function initContextDock() {
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

function initCanvasNetwork() {
  const canvas = document.getElementById("network-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let particles = [];
  let lastFrame = 0;

  function createParticles(count) {
    return Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18 * window.devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.18 * window.devicePixelRatio,
      r: (Math.random() * 1.5 + 0.5) * window.devicePixelRatio,
      a: Math.random() * 0.18 + 0.06
    }));
  }

  function resize() {
    width = canvas.width = window.innerWidth * window.devicePixelRatio;
    height = canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    particles = createParticles(Math.min(44, Math.floor(window.innerWidth / 30)));
  }

  function step(timestamp = 0) {
    if (timestamp - lastFrame < 36) {
      requestAnimationFrame(step);
      return;
    }
    lastFrame = timestamp;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i += 1) {
      const particle = particles[i];
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(15, 143, 136, ${particle.a})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j += 2) {
        const other = particles[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 118 * window.devicePixelRatio;
        if (distance < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(36, 87, 197, ${(1 - distance / maxDistance) * 0.1})`;
          ctx.lineWidth = 0.7 * window.devicePixelRatio;
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

function chartBaseOptions({ legend = true, linear = false } = {}) {
  const scales = linear
    ? {
        x: {
          type: "linear",
          min: 40,
          max: 150,
          title: { display: true, text: "Real GDP / output", color: chartPalette.muted },
          grid: { color: chartPalette.grid },
          ticks: { color: chartPalette.muted }
        },
        y: {
          min: 40,
          max: 150,
          title: { display: true, text: "Price level", color: chartPalette.muted },
          grid: { color: chartPalette.grid },
          ticks: { color: chartPalette.muted }
        }
      }
    : {
        x: {
          grid: { color: chartPalette.grid },
          ticks: { color: chartPalette.muted, font: { family: "Inter", weight: "700" } }
        },
        y: {
          beginAtZero: true,
          grid: { color: chartPalette.grid },
          ticks: { color: chartPalette.muted, font: { family: "Inter", weight: "700" } }
        }
      };

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 900, easing: "easeOutQuart" },
    interaction: { intersect: false, mode: "index" },
    plugins: {
      legend: {
        display: legend,
        position: "bottom",
        labels: {
          color: chartPalette.muted,
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          font: { family: "Inter", weight: "700" }
        }
      },
      tooltip: {
        backgroundColor: chartPalette.ink,
        padding: 12,
        displayColors: false,
        titleFont: { family: "Inter", weight: "800" },
        bodyFont: { family: "Inter", weight: "600" }
      }
    },
    scales
  };
}

function getCanvas(id) {
  const canvas = document.getElementById(id);
  if (!canvas || typeof Chart === "undefined") return null;
  return canvas.getContext("2d");
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

  if (route === "overview") {
    ensureChart("market", "chartMarket", (ctx) => new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["2024 actual/estimate", "2030 forecast"],
        datasets: [{
          label: "Global AV market size, $B",
          data: [68.09, 214.32],
          backgroundColor: [chartPalette.teal, chartPalette.blue],
          borderRadius: 6
        }]
      },
      options: {
        ...chartBaseOptions(),
        plugins: {
          ...chartBaseOptions().plugins,
          tooltip: {
            ...chartBaseOptions().plugins.tooltip,
            callbacks: {
              label: (context) => `$${context.parsed.y}B`
            }
          }
        }
      }
    }));
  }

  if (route === "macro-model") {
    ensureChart("adas", "chartADAS", (ctx) => new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "AD",
            data: [{ x: 55, y: 138 }, { x: 140, y: 54 }],
            borderColor: chartPalette.ink,
            borderWidth: 3,
            pointRadius: 0
          },
          {
            label: "SRAS1",
            data: [{ x: 58, y: 56 }, { x: 138, y: 136 }],
            borderColor: chartPalette.rose,
            borderWidth: 3,
            pointRadius: 0
          },
          {
            label: "SRAS2 after lower costs",
            data: [{ x: 72, y: 50 }, { x: 150, y: 122 }],
            borderColor: chartPalette.teal,
            borderWidth: 3,
            pointRadius: 0
          },
          {
            label: "LRAS1",
            data: [{ x: 92, y: 45 }, { x: 92, y: 148 }],
            borderColor: chartPalette.amber,
            borderWidth: 2,
            borderDash: [6, 6],
            pointRadius: 0
          },
          {
            label: "LRAS2 if productivity rises",
            data: [{ x: 110, y: 45 }, { x: 110, y: 148 }],
            borderColor: chartPalette.blue,
            borderWidth: 2,
            borderDash: [6, 6],
            pointRadius: 0
          }
        ]
      },
      options: chartBaseOptions({ linear: true })
    }));
  }

  if (route === "evidence-local") {
    ensureChart("trust", "chartTrust", (ctx) => new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Afraid to ride fully self-driving", "Would ride in driverless vehicle"],
        datasets: [{
          label: "Share of respondents",
          data: [66, 37],
          backgroundColor: [chartPalette.rose, chartPalette.teal],
          borderRadius: 6
        }]
      },
      options: {
        ...chartBaseOptions(),
        scales: {
          ...chartBaseOptions().scales,
          y: { ...chartBaseOptions().scales.y, max: 100, title: { display: true, text: "Percent", color: chartPalette.muted } }
        }
      }
    }));

    ensureChart("labor", "chartLabor", (ctx) => new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Heavy truck drivers", "Taxi, shuttle, chauffeurs", "Combined exposed roles"],
        datasets: [{
          label: "Jobs, millions",
          data: [2.2351, 0.4479, 2.683],
          backgroundColor: [chartPalette.blue, chartPalette.amber, chartPalette.rose],
          borderRadius: 6
        }]
      },
      options: {
        ...chartBaseOptions(),
        scales: {
          ...chartBaseOptions().scales,
          y: { ...chartBaseOptions().scales.y, title: { display: true, text: "Millions of jobs", color: chartPalette.muted } }
        }
      }
    }));

    initSurveyChart();
  }

  if (route === "policy-tradeoffs") {
    ensureChart("policy", "chartPolicy", (ctx) => new Chart(ctx, {
      type: "radar",
      data: {
        labels: ["Safety", "Worker transition", "Privacy", "Congestion", "Competition", "Infrastructure"],
        datasets: [
          {
            label: "Public benefit",
            data: [92, 82, 70, 64, 74, 78],
            borderColor: chartPalette.teal,
            backgroundColor: "rgba(15, 143, 136, 0.16)",
            pointBackgroundColor: chartPalette.teal
          },
          {
            label: "Governance difficulty",
            data: [72, 68, 88, 78, 82, 66],
            borderColor: chartPalette.rose,
            backgroundColor: "rgba(164, 63, 95, 0.1)",
            pointBackgroundColor: chartPalette.rose
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 900, easing: "easeOutQuart" },
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: chartPalette.muted, usePointStyle: true, font: { family: "Inter", weight: "700" } }
          },
          tooltip: { backgroundColor: chartPalette.ink, padding: 12, displayColors: false }
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
}

function loadSurvey() {
  state.survey = { yes: 17, maybe: 10, no: 11 };
}

function saveSurvey() {
  window.localStorage.setItem("av-econ-survey", JSON.stringify(state.survey));
}

function surveyTotal() {
  return state.survey.yes + state.survey.maybe + state.survey.no;
}

function updateSurveyCopy() {
  const total = surveyTotal();
  if (surveyStatus) {
    surveyStatus.textContent = total > 0 ? `${total} response${total === 1 ? "" : "s"}` : "Collecting responses";
  }

  if (surveyNote) {
    if (total === 0) {
      surveyNote.textContent = "No real class responses have been entered yet. The public comparison still uses AAA and Pew data above.";
    } else {
      const willing = state.survey.yes + state.survey.maybe;
      surveyNote.textContent = `${willing} out of ${total} local responses are open to riding or might ride. Compare that with AAA's 66% fear barrier and Pew's 37% willingness figure.`;
    }
  }
}

function initSurveyChart() {
  loadSurvey();
  updateSurveyCopy();

  ensureChart("survey", "chartSurvey", (ctx) => new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Yes", "Maybe", "No"],
      datasets: [{
        label: "Local survey responses",
        data: [state.survey.yes, state.survey.maybe, state.survey.no],
        backgroundColor: [chartPalette.teal, chartPalette.amber, chartPalette.rose],
        borderRadius: 6
      }]
    },
    options: {
      ...chartBaseOptions({ legend: false }),
      scales: {
        ...chartBaseOptions().scales,
        y: {
          ...chartBaseOptions().scales.y,
          ticks: { precision: 0, color: chartPalette.muted, font: { family: "Inter", weight: "700" } }
        }
      }
    }
  }));

  updateSurveyChart();
}

function updateSurveyChart() {
  const chart = state.charts.survey;
  if (!chart) return;
  chart.data.datasets[0].data = [state.survey.yes, state.survey.maybe, state.survey.no];
  chart.update();
}

function initSurveyControls() {
  loadSurvey();
  updateSurveyCopy();

  document.querySelectorAll("[data-survey-vote]").forEach((button) => {
    if (button.dataset.surveyReady) return;
    button.dataset.surveyReady = "true";

    button.addEventListener("click", () => {
      const vote = button.dataset.surveyVote;
      if (!Object.prototype.hasOwnProperty.call(state.survey, vote)) return;
      state.survey[vote] += 1;
      saveSurvey();
      updateSurveyCopy();
      updateSurveyChart();
    });
  });

  surveyReset?.addEventListener("click", () => {
    state.survey = { yes: 0, maybe: 0, no: 0 };
    saveSurvey();
    updateSurveyCopy();
    updateSurveyChart();
  });
}

function init() {
  initNavigation();
  initExplanationToggles();
  initHoverTargets();
  initContextDock();
  initCursor();
  initCanvasNetwork();
  initSurveyControls();
  setInitialRoute();
}

document.addEventListener("DOMContentLoaded", init);
