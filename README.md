# AV Economics Intelligence Platform

A static AP Macroeconomics multimedia project for **The Economics of Autonomous Vehicles: From Consumer Good to Market Disruptor**.

The site is built as a single-page HTML/CSS/JS experience with:

- 5 focused tabs: Overview, Macro Model, Evidence + Local, Policy + Tradeoffs, and Rubric + Sources
- Clean crossfade route transitions, compact accordions, and a collapsible reader guide
- Chart.js visuals for the market forecast, AD-AS model, trust data, labor exposure, survey module, and policy matrix
- AP Macro requirement tracker, bibliography, self-created rubric, and self-grade
- Responsive layouts for desktop, tablet, and mobile

## Run Locally

```bash
npm run dev
```

Open `http://localhost:5173`.

## Verify

```bash
npm run smoke
node --check app.js
```

The project has no build step and no bundled JavaScript dependencies. Chart.js and fonts load from CDNs in `index.html`.
