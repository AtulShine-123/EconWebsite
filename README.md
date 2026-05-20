# AV Economics Intelligence Platform

A static, premium economics research interface for **The Economics of Autonomous Vehicles: From Consumer Good to Market Disruptor**.

The site is built as a single-page HTML/CSS/JS experience with:

- 11 animated research sections
- Multimedia-inspired page transitions, cursor motion, HUD labels, and canvas network background
- Chart.js visual placeholders using concise research-backed data points
- Bloomberg-lite Data Lab and equilibrium-model sections
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
