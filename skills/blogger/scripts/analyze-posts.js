#!/usr/bin/env node
/**
 * Blog Post Analyzer
 * 
 * Samples existing blog posts and extracts style patterns to generate
 * a draft style guide. Part of the blogger skill.
 * 
 * Usage:
 *   node analyze-posts.js --site=https://example.com --credentials=path/to/creds.json --output=path/to/.blog-style/
 * 
 * Options:
 *   --site          WordPress site URL (required)
 *   --credentials   Path to WordPress credentials JSON (required)
 *   --output        Output directory for style guide (default: ./.blog-style/)
 *   --count         Number of posts to analyze (default: 20)
 *   --min-words     Minimum word count per post (default: 300)
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach(arg => {
    const match = arg.match(/^--(\w+)=(.+)$/);
    if (match) {
      args[match[1]] = match[2];
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

// Strip HTML tags and decode entities
function stripHTML(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
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
function analyzePost(post) {
  const title = stripHTML(post.title.rendered || post.title);
  const content = stripHTML(post.content.rendered || post.content);
  const fullText = title + ' ' + content;
  
  const sentences = getSentences(content);
  const words = getWords(content);
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
  
  // Contractions
  const contractions = (content.match(/\b\w+'(t|s|re|ve|ll|d|m)\b/gi) || []).length;
  
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
    tags: post.tags || []
  };
}

// Aggregate analysis across multiple posts
function aggregateAnalysis(analyses) {
  const count = analyses.length;
  if (count === 0) return null;
  
  const avg = (arr, key) => arr.reduce((sum, a) => sum + a[key], 0) / count;
  const min = (arr, key) => Math.min(...arr.map(a => a[key]));
  const max = (arr, key) => Math.max(...arr.map(a => a[key]));
  
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
    }
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

// Generate the style guide markdown
function generateStyleGuide(agg, observations, siteUrl) {
  const grade = agg.fleschKincaidGrade.toFixed(1);
  const ease = agg.fleschReadingEase.toFixed(0);
  
  return `# Blog Style Guide

*Auto-generated from analysis of ${agg.postCount} posts*
*Site: ${siteUrl}*

---

## Voice Analysis

Based on analysis of existing content:

${observations.map(o => '- ' + o).join('\n')}

---

## Metrics

| Metric | Value |
|--------|-------|
| Posts analyzed | ${agg.postCount} |
| Total words | ${agg.totalWords.toLocaleString()} |
| Avg post length | ${agg.avgWordCount.toFixed(0)} words |
| Avg sentence length | ${agg.avgSentenceLength.toFixed(1)} words |
| Avg paragraph length | ${agg.avgParagraphLength.toFixed(1)} sentences |
| Flesch Reading Ease | ${ease}/100 |
| Flesch-Kincaid Grade | ${grade} |

---

## Voice Characteristics

*Based on the analysis, select the adjectives that fit:*

- [ ] Friendly / Warm / Approachable
- [ ] Professional / Authoritative / Expert  
- [ ] Casual / Conversational / Relaxed
- [ ] Witty / Humorous / Playful
- [ ] Direct / No-nonsense / Efficient
- [ ] Personal / Intimate / Confessional
- [ ] Inspiring / Motivational / Encouraging

**Your voice:** _________________________________

---

## Grammar Preferences

### Contractions
${agg.contractionRate > 0.015 ? '- [x] Always use' : agg.contractionRate > 0.005 ? '- [x] Sometimes use' : '- [x] Rarely use'}

### Questions
${agg.questionRate > 0.05 ? 'Questions appear frequently — part of the conversational style.' : 'Questions used sparingly.'}

### Exclamations
${agg.exclamationRate > 0.03 ? 'Exclamation marks used liberally.' : agg.exclamationRate > 0.01 ? 'Exclamation marks used occasionally.' : 'Exclamation marks used rarely.'}

### Person
${agg.firstPersonRate > 0.015 ? 'First person (I/we) is common — personal voice.' : 'First person used moderately.'}
${agg.secondPersonRate > 0.01 ? 'Second person (you/your) used frequently — addresses reader directly.' : ''}

---

## Formatting

- Average paragraph: ${agg.avgParagraphLength.toFixed(1)} sentences
- Target sentence length: ${agg.avgSentenceLength.toFixed(0)} words
- Target reading level: Grade ${grade}

---

## To Complete

This style guide was auto-generated. Complete it by:

1. Reading 3-5 of your best posts to get the vibe
2. Filling in voice characteristics above
3. Adding specific terminology preferences
4. Adding signature phrases or patterns
5. Including links to exemplar posts
6. Adding dos and don'ts with examples

---

*Generated: ${new Date().toISOString().split('T')[0]}*
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
  if (!args.credentials) {
    console.error('Error: --credentials is required');
    process.exit(1);
  }
  
  const site = args.site.replace(/\/$/, '');
  const outputDir = args.output || './.blog-style';
  const count = parseInt(args.count) || 20;
  const minWords = parseInt(args['min-words']) || 300;
  
  // Load credentials
  let creds;
  try {
    creds = JSON.parse(fs.readFileSync(args.credentials, 'utf8'));
  } catch (e) {
    console.error(`Error loading credentials: ${e.message}`);
    process.exit(1);
  }
  
  const auth = creds.rest_api 
    ? `${creds.rest_api.username}:${creds.rest_api.app_password}`
    : null;
  
  console.log(`Analyzing posts from ${site}...`);
  
  // Fetch posts
  const postsUrl = `${site}/wp-json/wp/v2/posts?per_page=${count}&status=publish&orderby=date&order=desc`;
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
    const analysis = analyzePost(post);
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
  
  // Generate style guide
  const styleGuide = generateStyleGuide(agg, observations, site);
  
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
