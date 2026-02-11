#!/usr/bin/env node
/**
 * Blog Post Analyzer
 * 
 * Samples existing blog posts and extracts style patterns to generate
 * a draft style guide. Part of the blogger skill.
 * 
 * Usage:
 *   # With authentication (recommended - richer analysis)
 *   node analyze-posts.js --site=https://example.com --credentials=path/to/creds.json --output=path/to/.blog-style/
 * 
 *   # Public mode (no auth required - basic analysis)
 *   node analyze-posts.js --site=https://example.com --output=path/to/.blog-style/ --public
 * 
 * Options:
 *   --site          WordPress site URL (required)
 *   --credentials   Path to WordPress credentials JSON (optional with --public)
 *   --output        Output directory for style guide (default: ./.blog-style/)
 *   --count         Number of posts to analyze (default: 20)
 *   --min-words     Minimum word count per post (default: 300)
 *   --public        Use public API only (no auth, rendered HTML)
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach(arg => {
    // Handle --flag=value
    const matchValue = arg.match(/^--([a-z-]+)=(.+)$/i);
    if (matchValue) {
      args[matchValue[1]] = matchValue[2];
      return;
    }
    // Handle --flag (boolean)
    const matchBool = arg.match(/^--([a-z-]+)$/i);
    if (matchBool) {
      args[matchBool[1]] = true;
    }
  });
  return args;
}

// Fetch JSON from URL
function fetchJSON(url, auth) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const options = {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'BlogAnalyzer/1.0'
      }
    };
    
    if (auth) {
      options.headers['Authorization'] = 'Basic ' + Buffer.from(auth).toString('base64');
    }
    
    protocol.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON from ${url}: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

// Extract block types from raw block content
function extractBlockTypes(raw) {
  const blockMatches = raw.match(/<!-- wp:([a-z-]+)/g) || [];
  const blocks = {};
  blockMatches.forEach(match => {
    const type = match.replace('<!-- wp:', '');
    blocks[type] = (blocks[type] || 0) + 1;
  });
  return blocks;
}

// Strip block comments from raw content, leaving clean text
function stripBlockComments(raw) {
  return raw
    .replace(/<!-- \/?wp:[^>]+ -->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

// Strip HTML tags and decode entities (for rendered content)
function stripHTML(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    // Preserve paragraph breaks
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(?:div|h[1-6]|li|blockquote)>/gi, '\n\n')
    // Strip remaining tags
    .replace(/<[^>]+>/g, ' ')
    // Decode entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, '...')
    // Normalize whitespace (but preserve paragraph breaks)
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
}

// Split text into sentences
function getSentences(text) {
  return text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

// Split text into words
function getWords(text) {
  return text
    .toLowerCase()
    .split(/[\s,;:'"()[\]{}]+/)
    .filter(w => w.length > 0 && /^[a-z]/.test(w));
}

// Count syllables in a word (approximation)
function countSyllables(word) {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

// Calculate Flesch Reading Ease
function fleschReadingEase(text) {
  const sentences = getSentences(text);
  const words = getWords(text);
  
  if (sentences.length === 0 || words.length === 0) return 0;
  
  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const avgSentenceLength = words.length / sentences.length;
  const avgSyllablesPerWord = totalSyllables / words.length;
  
  return 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
}

// Flesch-Kincaid Grade Level
function fleschKincaidGrade(text) {
  const sentences = getSentences(text);
  const words = getWords(text);
  
  if (sentences.length === 0 || words.length === 0) return 0;
  
  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const avgSentenceLength = words.length / sentences.length;
  const avgSyllablesPerWord = totalSyllables / words.length;
  
  return (0.39 * avgSentenceLength) + (11.8 * avgSyllablesPerWord) - 15.59;
}

// Analyze a single post
function analyzePost(post, useRaw = false) {
  const title = post.title.raw || stripHTML(post.title.rendered || post.title);
  
  let content;
  let blockTypes = {};
  
  if (useRaw && post.content.raw) {
    content = stripBlockComments(post.content.raw);
    blockTypes = extractBlockTypes(post.content.raw);
  } else {
    content = stripHTML(post.content.rendered || post.content);
  }
  
  const fullText = title + ' ' + content;
  
  const sentences = getSentences(content);
  const words = getWords(content);
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
  
  // Contractions (including curly apostrophes)
  const contractions = (content.match(/\b\w+[''](t|s|re|ve|ll|d|m)\b/gi) || []).length;
  
  // Questions
  const questions = (content.match(/\?/g) || []).length;
  
  // Exclamations
  const exclamations = (content.match(/!/g) || []).length;
  
  // First person (I, me, my, we, us, our)
  const firstPerson = (content.match(/\b(I|me|my|mine|we|us|our|ours)\b/gi) || []).length;
  
  // Second person (you, your)
  const secondPerson = (content.match(/\b(you|your|yours)\b/gi) || []).length;
  
  return {
    title,
    wordCount: words.length,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    avgSentenceLength: sentences.length > 0 ? words.length / sentences.length : 0,
    avgParagraphLength: paragraphs.length > 0 ? sentences.length / paragraphs.length : 0,
    contractionRate: words.length > 0 ? contractions / words.length : 0,
    questionRate: sentences.length > 0 ? questions / sentences.length : 0,
    exclamationRate: sentences.length > 0 ? exclamations / sentences.length : 0,
    firstPersonRate: words.length > 0 ? firstPerson / words.length : 0,
    secondPersonRate: words.length > 0 ? secondPerson / words.length : 0,
    fleschReadingEase: fleschReadingEase(content),
    fleschKincaidGrade: fleschKincaidGrade(content),
    categories: post.categories || [],
    tags: post.tags || [],
    blockTypes
  };
}

// Aggregate analysis across multiple posts
function aggregateAnalysis(analyses) {
  const count = analyses.length;
  if (count === 0) return null;
  
  const avg = (arr, key) => arr.reduce((sum, a) => sum + a[key], 0) / count;
  const min = (arr, key) => Math.min(...arr.map(a => a[key]));
  const max = (arr, key) => Math.max(...arr.map(a => a[key]));
  
  // Combine block types across all posts
  const blockTypes = {};
  analyses.forEach(a => {
    Object.entries(a.blockTypes || {}).forEach(([type, count]) => {
      blockTypes[type] = (blockTypes[type] || 0) + count;
    });
  });
  
  // Sort by frequency
  const sortedBlocks = Object.entries(blockTypes)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({ type, count }));
  
  return {
    postCount: count,
    totalWords: analyses.reduce((sum, a) => sum + a.wordCount, 0),
    avgWordCount: avg(analyses, 'wordCount'),
    avgSentenceLength: avg(analyses, 'avgSentenceLength'),
    avgParagraphLength: avg(analyses, 'avgParagraphLength'),
    contractionRate: avg(analyses, 'contractionRate'),
    questionRate: avg(analyses, 'questionRate'),
    exclamationRate: avg(analyses, 'exclamationRate'),
    firstPersonRate: avg(analyses, 'firstPersonRate'),
    secondPersonRate: avg(analyses, 'secondPersonRate'),
    fleschReadingEase: avg(analyses, 'fleschReadingEase'),
    fleschKincaidGrade: avg(analyses, 'fleschKincaidGrade'),
    ranges: {
      wordCount: { min: min(analyses, 'wordCount'), max: max(analyses, 'wordCount') },
      sentenceLength: { min: min(analyses, 'avgSentenceLength'), max: max(analyses, 'avgSentenceLength') }
    },
    blockTypes: sortedBlocks
  };
}

// Interpret the analysis and generate style observations
function interpretAnalysis(agg) {
  const observations = [];
  
  // Readability
  if (agg.fleschReadingEase >= 80) {
    observations.push('Writing is very easy to read (grade school level)');
  } else if (agg.fleschReadingEase >= 60) {
    observations.push('Writing is fairly easy to read (conversational level)');
  } else if (agg.fleschReadingEase >= 40) {
    observations.push('Writing is moderately difficult (professional level)');
  } else {
    observations.push('Writing is complex and dense (academic level)');
  }
  
  // Sentence length
  if (agg.avgSentenceLength < 15) {
    observations.push('Sentences are short and punchy (avg ' + agg.avgSentenceLength.toFixed(1) + ' words)');
  } else if (agg.avgSentenceLength < 20) {
    observations.push('Sentences are moderate length (avg ' + agg.avgSentenceLength.toFixed(1) + ' words)');
  } else {
    observations.push('Sentences are long and complex (avg ' + agg.avgSentenceLength.toFixed(1) + ' words)');
  }
  
  // Contractions
  if (agg.contractionRate > 0.02) {
    observations.push('Frequently uses contractions (conversational tone)');
  } else if (agg.contractionRate > 0.005) {
    observations.push('Sometimes uses contractions');
  } else {
    observations.push('Rarely uses contractions (more formal tone)');
  }
  
  // Questions
  if (agg.questionRate > 0.1) {
    observations.push('Often uses questions (engaging, conversational)');
  } else if (agg.questionRate > 0.03) {
    observations.push('Occasionally uses questions');
  } else {
    observations.push('Rarely uses questions (more declarative style)');
  }
  
  // Exclamations
  if (agg.exclamationRate > 0.05) {
    observations.push('Frequently uses exclamation marks (enthusiastic tone)');
  } else if (agg.exclamationRate > 0.01) {
    observations.push('Occasionally uses exclamation marks');
  } else {
    observations.push('Rarely uses exclamation marks (measured tone)');
  }
  
  // Person
  if (agg.firstPersonRate > 0.02) {
    observations.push('Heavy first-person usage (personal, intimate)');
  } else if (agg.firstPersonRate > 0.01) {
    observations.push('Moderate first-person usage');
  } else {
    observations.push('Limited first-person usage (more neutral/objective)');
  }
  
  if (agg.secondPersonRate > 0.015) {
    observations.push('Frequently addresses the reader directly (you/your)');
  } else if (agg.secondPersonRate > 0.005) {
    observations.push('Sometimes addresses the reader directly');
  }
  
  return observations;
}

// Derive voice characteristics from analysis data
function deriveVoiceTraits(agg) {
  const traits = [];
  const antiTraits = [];

  // Readability → conversational vs academic
  if (agg.fleschReadingEase >= 70) {
    traits.push('conversational');
    antiTraits.push('academic');
  } else if (agg.fleschReadingEase >= 50) {
    traits.push('clear');
  } else {
    traits.push('dense');
    antiTraits.push('casual');
  }

  // Sentence length → punchy vs elaborate
  if (agg.avgSentenceLength < 13) {
    traits.push('direct');
    antiTraits.push('verbose');
  } else if (agg.avgSentenceLength < 18) {
    traits.push('moderate-paced');
  } else {
    traits.push('elaborate');
    antiTraits.push('terse');
  }

  // First person → personal vs detached
  if (agg.firstPersonRate > 0.02) {
    traits.push('personal');
    antiTraits.push('detached');
  } else if (agg.firstPersonRate > 0.01) {
    traits.push('somewhat personal');
  } else {
    traits.push('neutral');
    antiTraits.push('confessional');
  }

  // Exclamations → measured vs enthusiastic
  if (agg.exclamationRate < 0.02) {
    traits.push('understated');
    antiTraits.push('breathless');
  } else if (agg.exclamationRate > 0.05) {
    traits.push('enthusiastic');
    antiTraits.push('restrained');
  }

  // Questions → declarative vs inquisitive
  if (agg.questionRate < 0.04) {
    traits.push('declarative');
  } else if (agg.questionRate > 0.1) {
    traits.push('inquisitive');
  }

  // Contractions → casual vs formal
  if (agg.contractionRate > 0.015) {
    traits.push('casual');
    antiTraits.push('formal');
  } else if (agg.contractionRate < 0.005) {
    traits.push('formal');
    antiTraits.push('slangy');
  }

  return { traits, antiTraits };
}

// Describe contraction usage
function describeContractions(rate) {
  if (rate > 0.02) return 'Always. Contractions are the default — the writing would sound stiff without them.';
  if (rate > 0.01) return 'Frequently. Conversational tone relies on natural contractions.';
  if (rate > 0.005) return 'Sometimes. Mixed usage — contractions appear but aren\'t dominant.';
  return 'Rarely. The writing leans formal and avoids contractions.';
}

// Describe question usage
function describeQuestions(rate) {
  if (rate > 0.1) return 'Frequently — questions are a core part of the conversational style, used to engage the reader.';
  if (rate > 0.05) return 'Moderately — questions appear naturally but don\'t drive the structure.';
  if (rate > 0.02) return 'Sparingly — mostly rhetorical. The style is declarative.';
  return 'Rarely — the writing is almost entirely declarative. Statements, not questions.';
}

// Describe exclamation usage
function describeExclamations(rate) {
  if (rate > 0.05) return 'Frequently — enthusiasm comes through in punctuation.';
  if (rate > 0.02) return 'Occasionally — used for genuine emphasis, not as a habit.';
  if (rate > 0.005) return 'Rarely — restraint is the default. The words carry the weight.';
  return 'Almost never — measured, understated tone throughout.';
}

// Describe paragraph style
function describeParagraphs(avgLen) {
  if (avgLen <= 2.0) return 'Very short — 1–2 sentences per paragraph. Single-sentence paragraphs are common and intentional. Ideas land one at a time.';
  if (avgLen <= 3.0) return 'Short — 2–3 sentences per paragraph. Tight, focused blocks. Paragraph breaks create rhythm, not just topic separation.';
  if (avgLen <= 4.5) return 'Moderate — 3–4 sentences per paragraph. Standard editorial length with room for development.';
  return 'Long — paragraphs run 5+ sentences. Ideas are developed within paragraphs rather than across them.';
}

// Describe reading level
function describeReadingLevel(ease, grade) {
  if (ease >= 80) return `Very accessible (grade ${grade}). This is "explain it to a friend" territory — no jargon, no showing off.`;
  if (ease >= 65) return `Conversational (grade ${grade}). Easy to read without being simplistic. Smart-casual.`;
  if (ease >= 50) return `Clear but substantive (grade ${grade}). Expects an engaged reader but doesn't make them work for it.`;
  if (ease >= 30) return `Dense and technical (grade ${grade}). Written for a knowledgeable audience.`;
  return `Academic (grade ${grade}). Complex sentence structure and vocabulary.`;
}

// Generate the style guide markdown
function generateStyleGuide(agg, observations, siteUrl, mode) {
  const grade = agg.fleschKincaidGrade.toFixed(1);
  const ease = agg.fleschReadingEase.toFixed(0);
  const { traits, antiTraits } = deriveVoiceTraits(agg);

  // Block usage section (only if we have block data)
  let blockSection = '';
  if (agg.blockTypes && agg.blockTypes.length > 0) {
    const topBlocks = agg.blockTypes.slice(0, 8);
    const blockRows = topBlocks.map(b => `| ${b.type} | ${b.count} |`).join('\n');
    blockSection = `
## WordPress Blocks Used

| Block Type | Frequency |
|------------|-----------|
${blockRows}

`;
  }

  // Person description
  let personDesc = '';
  if (agg.firstPersonRate > 0.02) {
    personDesc = 'Heavy first-person usage — this is personal writing. "I" is the default perspective.';
  } else if (agg.firstPersonRate > 0.01) {
    personDesc = 'Moderate first-person usage — personal but not confessional.';
  } else {
    personDesc = 'Limited first-person — more neutral, observational tone.';
  }
  if (agg.secondPersonRate > 0.01) {
    personDesc += ' Reader is addressed directly (you/your) — creates a conversational feel.';
  } else if (agg.secondPersonRate > 0.005) {
    personDesc += ' Occasionally addresses the reader directly.';
  }

  return `# Blog Style Guide

*Auto-generated from analysis of ${agg.postCount} posts on ${siteUrl}*
*Generated: ${new Date().toISOString().split('T')[0]}*

---

## Voice

${traits.length > 0 ? `**This writing is:** ${traits.join(', ')}.` : ''}
${antiTraits.length > 0 ? `**This writing is not:** ${antiTraits.join(', ')}.` : ''}

### Observations

${observations.map(o => '- ' + o).join('\n')}

---

## Readability

${describeReadingLevel(parseFloat(ease), grade)}

| Metric | Value |
|--------|-------|
| Flesch Reading Ease | ${ease}/100 |
| Flesch-Kincaid Grade | ${grade} |
| Avg sentence length | ${agg.avgSentenceLength.toFixed(1)} words |
| Avg paragraph length | ${agg.avgParagraphLength.toFixed(1)} sentences |

---

## Sentence & Paragraph Style

**Sentences:** Average ${agg.avgSentenceLength.toFixed(1)} words (range: ${agg.ranges.sentenceLength.min.toFixed(0)}–${agg.ranges.sentenceLength.max.toFixed(0)} across posts). ${agg.avgSentenceLength < 15 ? 'Short and punchy — the writing moves fast.' : agg.avgSentenceLength < 20 ? 'Moderate length — balanced pacing.' : 'Long sentences — ideas develop within sentences.'}

**Paragraphs:** ${describeParagraphs(agg.avgParagraphLength)}

---

## Grammar & Mechanics

**Contractions:** ${describeContractions(agg.contractionRate)}

**Questions:** ${describeQuestions(agg.questionRate)}

**Exclamations:** ${describeExclamations(agg.exclamationRate)}

**Person:** ${personDesc}

---

## Post Length

| Metric | Value |
|--------|-------|
| Posts analyzed | ${agg.postCount} |
| Total words | ${agg.totalWords.toLocaleString()} |
| Avg post length | ${agg.avgWordCount.toFixed(0)} words |
| Shortest post | ${agg.ranges.wordCount.min} words |
| Longest post | ${agg.ranges.wordCount.max} words |

${blockSection}---

## Exemplar Posts

*Add 3–5 links to posts that best represent the voice:*

- [ ] _Post title and URL_
- [ ] _Post title and URL_
- [ ] _Post title and URL_

---

## Notes

*Add any additional observations, terminology preferences, or dos/don'ts here.*

---

*This style guide is a starting point. Review it, add exemplar posts, and refine the voice description to make it actionable for writing.*
`;
}

// Main function
async function main() {
  const args = parseArgs();
  
  // Validate required arguments
  if (!args.site) {
    console.error('Error: --site is required');
    process.exit(1);
  }
  
  const publicMode = args.public !== undefined;
  
  if (!publicMode && !args.credentials) {
    console.error('Error: --credentials is required (or use --public for unauthenticated mode)');
    process.exit(1);
  }
  
  const site = args.site.replace(/\/$/, '');
  const outputDir = args.output || './.blog-style';
  const count = parseInt(args.count) || 100;
  const minWords = parseInt(args['min-words']) || 1;
  
  // Load credentials if not public mode
  let auth = null;
  let useRaw = false;
  
  if (!publicMode && args.credentials) {
    let creds;
    try {
      creds = JSON.parse(fs.readFileSync(args.credentials, 'utf8'));
    } catch (e) {
      console.error(`Error loading credentials: ${e.message}`);
      process.exit(1);
    }
    
    if (creds.rest_api) {
      auth = `${creds.rest_api.username}:${creds.rest_api.app_password}`;
      useRaw = true; // Use raw content when authenticated
    }
  }
  
  const mode = useRaw ? 'authenticated (raw blocks)' : 'public (rendered HTML)';
  console.log(`Analyzing posts from ${site}...`);
  console.log(`Mode: ${mode}`);
  
  // Fetch posts - use context=edit if authenticated for raw content
  const contextParam = useRaw ? '&context=edit' : '';
  const postsUrl = `${site}/wp-json/wp/v2/posts?per_page=${count}&status=publish&orderby=date&order=desc${contextParam}`;
  
  let posts;
  try {
    posts = await fetchJSON(postsUrl, auth);
  } catch (e) {
    console.error(`Error fetching posts: ${e.message}`);
    process.exit(1);
  }
  
  if (!Array.isArray(posts) || posts.length === 0) {
    console.error('No posts found');
    process.exit(1);
  }
  
  console.log(`Fetched ${posts.length} posts`);
  
  // Analyze each post
  const analyses = [];
  for (const post of posts) {
    const analysis = analyzePost(post, useRaw);
    if (analysis.wordCount >= minWords) {
      analyses.push(analysis);
      console.log(`  ✓ "${analysis.title.substring(0, 50)}..." (${analysis.wordCount} words)`);
    } else {
      console.log(`  ✗ "${analysis.title.substring(0, 50)}..." (${analysis.wordCount} words - too short)`);
    }
  }
  
  if (analyses.length === 0) {
    console.error(`No posts met the minimum word count (${minWords})`);
    process.exit(1);
  }
  
  // Aggregate and interpret
  const agg = aggregateAnalysis(analyses);
  const observations = interpretAnalysis(agg);
  
  console.log('\nAnalysis complete:');
  console.log(`  Posts analyzed: ${agg.postCount}`);
  console.log(`  Avg word count: ${agg.avgWordCount.toFixed(0)}`);
  console.log(`  Reading level: Grade ${agg.fleschKincaidGrade.toFixed(1)}`);
  console.log(`  Flesch score: ${agg.fleschReadingEase.toFixed(0)}/100`);
  
  if (agg.blockTypes && agg.blockTypes.length > 0) {
    console.log(`  Top blocks: ${agg.blockTypes.slice(0, 5).map(b => b.type).join(', ')}`);
  }
  
  // Generate style guide
  const styleGuide = generateStyleGuide(agg, observations, site, mode);
  
  // Write output
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, 'voice.md');
  fs.writeFileSync(outputPath, styleGuide);
  
  console.log(`\nStyle guide written to: ${outputPath}`);
  console.log('\nNext steps:');
  console.log('1. Review and complete the generated style guide');
  console.log('2. Add exemplar posts');
  console.log('3. Fill in terminology preferences');
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
