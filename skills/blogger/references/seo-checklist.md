# SEO Checklist

Optimize blog posts for search engines without sacrificing readability.

---

## The Golden Rule

**Write for humans first, then optimize for search.**

Google's algorithm rewards content that satisfies user intent. Gaming the system with keyword stuffing or thin content backfires.

---

## Keyword Strategy

### One Primary Keyword Per Post

Each post targets ONE main keyword phrase. This focuses your optimization.

**Good:** "how to start a blog"
**Too broad:** "blogging"
**Too narrow:** "how to start a wordpress blog about cooking in 2024 for beginners"

### Keyword Placement

Priority locations (most to least important):

1. **Title (H1)** — Include primary keyword, ideally near the beginning
2. **URL slug** — Keep it short, include keyword: `/how-to-start-blog/`
3. **First 100 words** — Natural mention in opening paragraph
4. **At least one H2** — Section header with keyword or variant
5. **Meta description** — Include keyword naturally
6. **Image alt text** — If relevant to the image

### Keyword Density

**Target:** 1-2% (1-2 mentions per 100 words)

**Too low:** Keyword appears once in 2000 words (search engines miss the topic)
**Too high:** Keyword every sentence (looks like spam, hurts rankings)

**Better approach:** Use variations and related terms throughout:
- Primary: "start a blog"
- Variations: "starting a blog", "begin blogging", "launch a blog"
- Related: "WordPress", "domain name", "hosting", "first post"

---

## On-Page SEO Elements

### Title Tag

The title that appears in search results.

**Best practices:**
- 50-60 characters (longer gets truncated)
- Primary keyword near the front
- Include a hook or benefit
- Match user intent

**Formula:** `[Primary Keyword]: [Benefit/Hook]`

**Examples:**
- "How to Start a Blog: A Step-by-Step Guide for Beginners"
- "Blog Writing Tips: 15 Ways to Write Posts That Rank"

### Meta Description

The snippet below the title in search results.

**Best practices:**
- 150-155 characters
- Include primary keyword
- Summarize the value proposition
- Include a call to action when appropriate
- Don't duplicate title

**Example:**
"Learn how to start a blog from scratch. This guide covers hosting, WordPress setup, and writing your first post. No technical experience needed."

### URL Slug

The part of the URL after your domain.

**Best practices:**
- Keep it short (3-5 words)
- Include primary keyword
- Use hyphens, not underscores
- Avoid dates (unless time-sensitive)
- Remove stop words (a, the, and, or)

**Good:** `/start-blog-guide/`
**Bad:** `/how-to-start-a-blog-in-2024-complete-guide-for-beginners/`

### Header Tags (H2, H3, H4)

Headers structure content for readers AND search engines.

**Best practices:**
- One H1 per page (the title)
- H2 for main sections
- H3 for subsections within H2s
- Include keywords/variations in some headers
- Make headers descriptive (scannable)

**Good:**
```
H1: How to Start a Blog
  H2: Choose Your Blogging Platform
  H2: Pick a Domain Name
    H3: Domain Name Tips
  H2: Set Up Hosting
  H2: Write Your First Post
```

---

## Content Optimization

### Content Length

Longer content tends to rank better, but only if it's substantive.

**General guidelines:**
- Blog posts: 1,000-2,500 words
- Pillar/cornerstone content: 2,500-5,000+ words
- News/updates: 300-800 words

**Check competitors:** Search your keyword, see what's ranking. Match or exceed their depth.

### Internal Links

Links to other pages on your site.

**Benefits:**
- Helps readers find related content
- Distributes page authority
- Improves crawlability

**Best practices:**
- 2-5 internal links per post minimum
- Use descriptive anchor text (not "click here")
- Link to relevant, high-value pages
- Update old posts to link to new ones

### External Links

Links to other websites.

**Benefits:**
- Supports claims with evidence
- Signals trustworthiness
- Provides value to readers

**Best practices:**
- Link to authoritative sources
- 1-3 external links per post
- Open in new tab (optional, user preference)
- Don't link to competitors for commercial keywords

### Images

**Best practices:**
- Compress images (TinyPNG, ImageOptim)
- Use descriptive filenames: `how-to-start-blog-wordpress.jpg`
- Write alt text that describes the image
- Include keyword in alt text if natural
- Use modern formats (WebP with fallbacks)

**Alt text example:**
"WordPress dashboard showing the new post editor interface"

---

## Technical SEO

### Page Speed

Slow pages hurt rankings and user experience.

**Quick wins:**
- Compress images
- Enable browser caching
- Minimize plugins
- Use a CDN
- Choose fast hosting

**Test with:** Google PageSpeed Insights, GTmetrix

### Mobile Responsiveness

Google uses mobile-first indexing. Your site must work on phones.

**Check:**
- Text readable without zooming
- Buttons/links have adequate tap targets
- No horizontal scrolling
- Images scale properly

### Schema Markup

Structured data helps search engines understand content.

**For blog posts:**
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "How to Start a Blog",
  "author": { "@type": "Person", "name": "Your Name" },
  "datePublished": "2024-01-15",
  "dateModified": "2024-02-01"
}
```

Many SEO plugins (Yoast, RankMath) add this automatically.

---

## E-E-A-T Signals

Google evaluates **Experience, Expertise, Authoritativeness, Trustworthiness**.

### Demonstrate Experience
- Share personal stories and results
- Include original screenshots, data, examples
- Write from first-hand knowledge

### Show Expertise
- Deep, comprehensive coverage
- Technical accuracy
- Current information (update old posts)

### Build Authority
- Author bylines with bios
- Link to credentials/about page
- Earn backlinks from reputable sites

### Establish Trust
- Cite sources
- Disclose affiliations
- Keep information accurate
- Secure site (HTTPS)

---

## SEO Audit Workflow

Before publishing, verify:

```
[ ] Title: ≤60 chars, keyword near front
[ ] URL: Short, includes keyword
[ ] Meta: ≤155 chars, keyword included
[ ] First 100 words: Keyword mentioned naturally
[ ] Headers: At least one H2 with keyword/variant
[ ] Content: Appropriate length for topic
[ ] Internal links: 2+ to relevant pages
[ ] External links: 1+ to authoritative sources
[ ] Images: Compressed, descriptive alt text
[ ] Mobile: Renders correctly
[ ] Speed: Loads in <3 seconds
```

---

## Tools

- **Google Search Console** — Performance data, indexing issues
- **Google Analytics** — Traffic and behavior
- **Yoast SEO / RankMath** — WordPress optimization plugins
- **Ahrefs / SEMrush** — Keyword research, competitor analysis
- **PageSpeed Insights** — Performance testing
- **Mobile-Friendly Test** — Google's mobile checker
