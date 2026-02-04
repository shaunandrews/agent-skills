#!/usr/bin/env node

const cheerio = require('cheerio');

// Rate limiting - track last request time
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second

/**
 * Parse command line arguments
 */
function parseArgs(args) {
  const options = {
    query: null,
    count: 10,
    region: null,
    safe: 'moderate',
    text: false,
    help: false
  };

  const positional = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--text' || arg === '-t') {
      options.text = true;
    } else if (arg === '--count' || arg === '-n') {
      options.count = parseInt(args[++i], 10) || 10;
    } else if (arg === '--region' || arg === '-r') {
      options.region = args[++i];
    } else if (arg === '--safe' || arg === '-s') {
      options.safe = args[++i] || 'moderate';
    } else if (!arg.startsWith('-')) {
      positional.push(arg);
    }
  }

  options.query = positional.join(' ');
  return options;
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
ddg-search - Search the web using DuckDuckGo

Usage:
  ddg-search "your query" [options]

Options:
  -n, --count <num>     Number of results (default: 10)
  -r, --region <code>   Region code (e.g., us-en, uk-en, de-de)
  -s, --safe <level>    Safe search: off, moderate, strict (default: moderate)
  -t, --text            Output plain text instead of JSON
  -h, --help            Show this help message

Examples:
  ddg-search "wordpress hooks"
  ddg-search "coffee shops" -n 5 -r us-en
  ddg-search "node.js tutorials" --text
`);
}

/**
 * Build DuckDuckGo search URL
 */
function buildUrl(query, options) {
  const params = new URLSearchParams();
  params.set('q', query);

  if (options.region) {
    params.set('kl', options.region);
  }

  // Safe search: -2 = off, -1 = moderate, 1 = strict
  const safeMap = { off: '-2', moderate: '-1', strict: '1' };
  params.set('kp', safeMap[options.safe] || '-1');

  return `https://html.duckduckgo.com/html/?${params.toString()}`;
}

/**
 * Enforce rate limiting
 */
async function rateLimit() {
  const now = Date.now();
  const elapsed = now - lastRequestTime;

  if (elapsed < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - elapsed));
  }

  lastRequestTime = Date.now();
}

/**
 * Fetch search results from DuckDuckGo
 */
async function fetchResults(url) {
  await rateLimit();

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'ddg-search/1.0 (https://github.com/shaunandrews/agent-skills)',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.text();
}

/**
 * Parse HTML and extract search results
 */
function parseResults(html, count) {
  const $ = cheerio.load(html);
  const results = [];

  $('.result').each((i, el) => {
    if (results.length >= count) return false;

    const $el = $(el);
    
    // Skip ads
    if ($el.hasClass('result--ad')) return;

    const titleEl = $el.find('.result__title a, .result__a');
    const snippetEl = $el.find('.result__snippet');
    const urlEl = $el.find('.result__url');

    const title = titleEl.text().trim();
    let url = titleEl.attr('href') || '';
    const snippet = snippetEl.text().trim();

    // DuckDuckGo wraps URLs in a redirect - extract the real URL
    if (url.includes('uddg=')) {
      try {
        const uddg = new URL(url, 'https://duckduckgo.com').searchParams.get('uddg');
        if (uddg) url = uddg;
      } catch {
        // Keep original URL if parsing fails
      }
    }

    // Skip if missing essential data
    if (!title || !url) return;

    results.push({ title, url, snippet });
  });

  return results;
}

/**
 * Format results as plain text
 */
function formatText(query, results) {
  let output = `Query: ${query}\n\n`;

  if (results.length === 0) {
    output += 'No results found.\n';
    return output;
  }

  results.forEach((result, i) => {
    output += `${i + 1}. ${result.title}\n`;
    output += `   ${result.url}\n`;
    if (result.snippet) {
      output += `   ${result.snippet}\n`;
    }
    output += '\n';
  });

  return output.trim();
}

/**
 * Format results as JSON
 */
function formatJson(query, results) {
  return JSON.stringify({
    query,
    results,
    count: results.length
  }, null, 2);
}

/**
 * Main entry point
 */
async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  if (options.help || !options.query) {
    showHelp();
    process.exit(options.help ? 0 : 1);
  }

  try {
    const url = buildUrl(options.query, options);
    const html = await fetchResults(url);
    const results = parseResults(html, options.count);

    if (options.text) {
      console.log(formatText(options.query, results));
    } else {
      console.log(formatJson(options.query, results));
    }
  } catch (error) {
    console.error(JSON.stringify({ error: error.message }));
    process.exit(1);
  }
}

main();
