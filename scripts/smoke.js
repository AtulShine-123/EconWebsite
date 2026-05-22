const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");

const routes = [
  "overview",
  "macro-model",
  "evidence-local",
  "policy-tradeoffs",
  "rubric-sources"
];

const charts = [
  "chartMarket",
  "chartADAS",
  "chartTrust",
  "chartLabor",
  "chartSurvey",
  "chartPolicy"
];

const requiredIndexTokens = [
  "requirement-tracker",
  "Created Element",
  "Rubric + Sources",
  "AD-AS",
  "Plain English",
  "AP Macro Terms",
  "survey-module",
  "bibliography",
  "Self-Created Rubric",
  "California DMV",
  "Grand View Research",
  "transition-wipe"
];

const failures = [];

for (const route of routes) {
  if (!index.includes(`id="${route}"`)) failures.push(`Missing page section: ${route}`);
  if (!index.includes(`data-route="${route}"`)) failures.push(`Missing nav route: ${route}`);
}

for (const chart of charts) {
  if (!index.includes(`id="${chart}"`)) failures.push(`Missing chart canvas: ${chart}`);
}

for (const token of requiredIndexTokens) {
  if (token === "transition-wipe") {
    if (index.includes(token) || styles.includes(token) || app.includes(token)) {
      failures.push("Old transition-wipe token should be removed");
    }
    continue;
  }

  if (!index.includes(token)) failures.push(`Missing required content token: ${token}`);
}

for (const cssToken of [".page-section.is-active", "@keyframes pageFadeIn", ".accordion-panel", ".segmented-control", ".rubric-table", ".survey-panel"]) {
  if (!styles.includes(cssToken)) failures.push(`Missing CSS token: ${cssToken}`);
}

for (const jsToken of ["function navigate", "function initCharts", "new Chart", "initSurveyChart", "initExplanationToggles", "pageMeaning"]) {
  if (!app.includes(jsToken)) failures.push(`Missing JS token: ${jsToken}`);
}

if (failures.length) {
  console.error("Smoke test failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Smoke test passed: ${routes.length} routes, ${charts.length} chart slots, AP Macro requirements verified.`);
