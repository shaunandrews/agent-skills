const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = 3006; // Update with your assigned port from portman
const PROMPTS_DIR = path.join(__dirname, 'prompts');

app.use('/prompts', express.static(PROMPTS_DIR));

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address;
    }
  }
  return 'localhost';
}

function discoverMockups() {
  const prompts = [];
  if (!fs.existsSync(PROMPTS_DIR)) return prompts;

  for (const dir of fs.readdirSync(PROMPTS_DIR).sort()) {
    const mockupsDir = path.join(PROMPTS_DIR, dir, 'mockups');
    if (!fs.existsSync(mockupsDir)) continue;

    // Configurable page order per prompt — add entries here as needed
    const pageOrder = ['home', 'collection', 'services', 'portfolio', 'about',
                       'shop', 'subscriptions', 'pricing', 'schedule', 'classes',
                       'workshops', 'practitioners', 'teachers', 'booking',
                       'faq', 'contact', 'blog'];

    const files = fs.readdirSync(mockupsDir).filter(f => f.endsWith('.html'))
      .sort((a, b) => {
        const aSlug = a.replace('.html', '');
        const bSlug = b.replace('.html', '');
        const aIdx = pageOrder.indexOf(aSlug);
        const bIdx = pageOrder.indexOf(bSlug);
        return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
      });

    // Check for research references
    const researchFile = path.join(PROMPTS_DIR, dir, 'research', 'references.html');
    const hasResearch = fs.existsSync(researchFile);

    if (files.length === 0 && !hasResearch) continue;

    prompts.push({
      slug: dir,
      name: dir.replace(/^\d+-/, '').replace(/-/g, ' '),
      research: hasResearch ? `/prompts/${dir}/research/references.html` : null,
      mockups: files.map(f => ({
        name: f.replace('.html', '').replace(/-/g, ' '),
        file: f,
        path: `/prompts/${dir}/mockups/${f}`
      }))
    });
  }
  return prompts;
}

app.get('/', (req, res) => {
  const prompts = discoverMockups();

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Design Atelier</title>
  <style>
    :root { --bg: #ffffff; --card: #f8f6f2; --text: #1a1a1a; --muted: #888880; --accent: #b8963e; --border: #d4d0c8; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, 'Times New Roman', serif; background: var(--bg); color: var(--text); padding: 3rem 2rem; }
    .container { max-width: 960px; margin: 0 auto; }
    h1 { font-size: 1.5rem; font-weight: 400; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text); margin-bottom: 0.5rem; }
    .subtitle { font-size: 0.85rem; color: var(--muted); margin-bottom: 3rem; letter-spacing: 0.05em; }
    .prompt-group { margin-bottom: 3rem; }
    .prompt-title { font-size: 1.1rem; text-transform: capitalize; letter-spacing: 0.1em; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border); color: var(--text); }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
    .card { background: var(--card); border: 2px solid var(--border); padding: 1.25rem; text-decoration: none; color: inherit; transition: border-color 0.2s; }
    .card:hover { border-color: var(--text); }
    .card-name { font-weight: 600; text-transform: capitalize; margin-bottom: 0.25rem; }
    .card-file { font-size: 0.75rem; color: var(--muted); font-family: monospace; }
    .card.research { border-color: var(--accent); }
    .card.research .card-name { color: var(--accent); }
    .meta { margin-top: 3rem; font-size: 0.75rem; color: var(--muted); font-family: monospace; }
    .empty { color: var(--muted); font-style: italic; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Design Atelier</h1>
    <p class="subtitle">Coded Prototypes</p>
    ${prompts.map(p => `
        <div class="prompt-group">
          <h2 class="prompt-title">${p.name}</h2>
          <div class="grid">
            ${p.research ? `<a href="${p.research}" class="card research"><div class="card-name">\u{1F4CB} Research & References</div><div class="card-file">references.html</div></a>` : ''}
            ${p.mockups.map(m => `<a href="${m.path}" class="card"><div class="card-name">${m.name}</div><div class="card-file">${m.file}</div></a>`).join('')}
            ${p.mockups.length === 0 && !p.research ? '<div class="card" style="opacity:0.4"><div class="card-name">No mockups yet</div></div>' : ''}
          </div>
        </div>
      `).join('')}
    <div class="meta">Local: http://localhost:${PORT} &middot; Network: http://${getLocalIP()}:${PORT}</div>
  </div>
</body>
</html>`);
});

app.listen(PORT, '0.0.0.0', () => console.log(`Atelier server: http://localhost:${PORT} | http://${getLocalIP()}:${PORT}`));
