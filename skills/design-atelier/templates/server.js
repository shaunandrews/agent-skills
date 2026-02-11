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
    :root {
      --bg: #ffffff;
      --bg-card: #fafafa;
      --text: #111111;
      --text-secondary: #666666;
      --text-muted: #999999;
      --border: #e0e0e0;
      --border-hover: #111111;
      --preview-bg: #f5f5f5;
      --shadow: 0 1px 3px rgba(0,0,0,0.06);
      --shadow-hover: 0 4px 12px rgba(0,0,0,0.1);
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #111111;
        --bg-card: #1a1a1a;
        --text: #e8e8e8;
        --text-secondary: #999999;
        --text-muted: #666666;
        --border: #2a2a2a;
        --border-hover: #e8e8e8;
        --preview-bg: #0d0d0d;
        --shadow: 0 1px 3px rgba(0,0,0,0.2);
        --shadow-hover: 0 4px 12px rgba(0,0,0,0.4);
      }
    }

    [data-theme="dark"] {
      --bg: #111111;
      --bg-card: #1a1a1a;
      --text: #e8e8e8;
      --text-secondary: #999999;
      --text-muted: #666666;
      --border: #2a2a2a;
      --border-hover: #e8e8e8;
      --preview-bg: #0d0d0d;
      --shadow: 0 1px 3px rgba(0,0,0,0.2);
      --shadow-hover: 0 4px 12px rgba(0,0,0,0.4);
    }

    [data-theme="light"] {
      --bg: #ffffff;
      --bg-card: #fafafa;
      --text: #111111;
      --text-secondary: #666666;
      --text-muted: #999999;
      --border: #e0e0e0;
      --border-hover: #111111;
      --preview-bg: #f5f5f5;
      --shadow: 0 1px 3px rgba(0,0,0,0.06);
      --shadow-hover: 0 4px 12px rgba(0,0,0,0.1);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    .header {
      padding: 2rem 2rem 0;
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }

    .header-left h1 {
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text);
    }

    .header-left .subtitle {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.15rem;
    }

    .theme-toggle {
      background: none;
      border: 1px solid var(--border);
      border-radius: 4px;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.7rem;
      padding: 0.3rem 0.6rem;
      font-family: inherit;
      transition: color 0.2s, border-color 0.2s;
    }

    .theme-toggle:hover {
      color: var(--text);
      border-color: var(--text-secondary);
    }

    .content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .prompt-group { margin-bottom: 3rem; }

    .prompt-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    .prompt-title {
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: capitalize;
      color: var(--text);
    }

    .prompt-divider {
      flex: 1;
      height: 1px;
      background: var(--border);
    }

    .prompt-count {
      font-size: 0.7rem;
      color: var(--text-muted);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.25rem;
    }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 6px;
      text-decoration: none;
      color: inherit;
      overflow: hidden;
      transition: border-color 0.2s, box-shadow 0.2s;
      display: block;
    }

    .card:hover {
      border-color: var(--border-hover);
      box-shadow: var(--shadow-hover);
    }

    .card-preview {
      width: 100%;
      aspect-ratio: 16 / 10;
      background: var(--preview-bg);
      overflow: hidden;
      position: relative;
      border-bottom: 1px solid var(--border);
    }

    .card-preview iframe {
      width: 1280px;
      height: 800px;
      border: none;
      transform-origin: top left;
      pointer-events: none;
      position: absolute;
      top: 0;
      left: 0;
    }

    .card-info {
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .card-name {
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .card-file {
      font-size: 0.65rem;
      color: var(--text-muted);
      font-family: ui-monospace, 'SF Mono', 'Cascadia Code', monospace;
    }

    .meta {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      font-size: 0.65rem;
      color: var(--text-muted);
      font-family: ui-monospace, 'SF Mono', 'Cascadia Code', monospace;
      border-top: 1px solid var(--border);
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <h1>Design Atelier</h1>
      <p class="subtitle">\${prompts.length} prompt\${prompts.length !== 1 ? 's' : ''} &middot; \${prompts.reduce((n, p) => n + p.mockups.length, 0)} pages</p>
    </div>
    <button class="theme-toggle" onclick="toggleTheme()" id="themeBtn">Dark</button>
  </div>

  <div class="content">
    \${prompts.map(p => \`
      <div class="prompt-group">
        <div class="prompt-header">
          <h2 class="prompt-title">\${p.name}</h2>
          <div class="prompt-divider"></div>
          <span class="prompt-count">\${p.mockups.length + (p.research ? 1 : 0)} page\${(p.mockups.length + (p.research ? 1 : 0)) !== 1 ? 's' : ''}</span>
        </div>
        <div class="grid">
          \${p.research ? \`
            <a href="\${p.research}" class="card">
              <div class="card-preview">
                <iframe src="\${p.research}" loading="lazy" tabindex="-1" sandbox="allow-same-origin"></iframe>
              </div>
              <div class="card-info">
                <span class="card-name">Research & References</span>
                <span class="card-file">references.html</span>
              </div>
            </a>
          \` : ''}
          \${p.mockups.map(m => \`
            <a href="\${m.path}" class="card">
              <div class="card-preview">
                <iframe src="\${m.path}" loading="lazy" tabindex="-1" sandbox="allow-same-origin"></iframe>
              </div>
              <div class="card-info">
                <span class="card-name">\${m.name}</span>
                <span class="card-file">\${m.file}</span>
              </div>
            </a>
          \`).join('')}
        </div>
      </div>
    \`).join('')}
  </div>

  <div class="meta">localhost:\${PORT} &middot; \${getLocalIP()}:\${PORT}</div>

  <script>
    function scaleIframes() {
      document.querySelectorAll('.card-preview').forEach(container => {
        const iframe = container.querySelector('iframe');
        if (!iframe) return;
        const scale = container.offsetWidth / 1280;
        iframe.style.transform = 'scale(' + scale + ')';
      });
    }
    scaleIframes();
    window.addEventListener('resize', scaleIframes);

    function toggleTheme() {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      document.getElementById('themeBtn').textContent = next === 'dark' ? 'Light' : 'Dark';
      localStorage.setItem('theme', next);
    }

    const saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
      document.getElementById('themeBtn').textContent = saved === 'dark' ? 'Light' : 'Dark';
    }
  </script>
</body>
</html>\`);
});

app.listen(PORT, '0.0.0.0', () => console.log(\`Atelier server: http://localhost:\${PORT} | http://\${getLocalIP()}:\${PORT}\`));
