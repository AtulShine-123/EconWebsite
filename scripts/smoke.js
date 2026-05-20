const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");

const routes = [
  "home",
  "research-question",
  "market-structure",
  "consumer-adoption",
  "labor-macro",
  "investment",
  "policy",
  "equilibrium",
  "data-lab",
  "sources",
  "conclusion"
];

const charts = [
  "chartHomeAdoption",
  "chartConcentration",
  "chartTrust",
  "chartLabor",
  "chartGDP",
  "chartInvestment",
  "chartPolicy",
  "chartEquilibrium",
  "chartDataLab",
  "chartSources"
];

const failures = [];

for (const route of routes) {
  if (!index.includes(`id="${route}"`)) failures.push(`Missing page section: ${route}`);
  if (!index.includes(`data-route="${route}"`)) failures.push(`Missing nav route: ${route}`);
}

for (const chart of charts) {
  if (!index.includes(`id="${chart}"`)) failures.push(`Missing chart canvas: ${chart}`);
}

for (const token of ["transition-wipe", "network-canvas", "terminal-dashboard", "model-stage", "context-dock", "detail-drawer", "source-link"]) {
  if (!index.includes(token)) failures.push(`Missing UI shell token: ${token}`);
}

for (const cssToken of ["--blue", ".page-section.is-active", ".terminal-dashboard", ".model-stage", ".liquid-glass", ".detail-drawer"]) {
  if (!styles.includes(cssToken)) failures.push(`Missing CSS token: ${cssToken}`);
}

for (const jsToken of ["function navigate", "function initCharts", "new Chart", "initCanvasNetwork", "chartDetails", "pageMeaning"]) {
  if (!app.includes(jsToken)) failures.push(`Missing JS token: ${jsToken}`);
}

if (failures.length) {
  console.error("Smoke test failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Smoke test passed: ${routes.length} routes and ${charts.length} chart slots verified.`);
