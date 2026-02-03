# Blogger Skill

A writing companion for maintaining a blog with consistent voice and quality.

## Features

- **Style Guide System** — Build and maintain a voice/tone guide for your blog
- **Post Analyzer** — Automatically analyze existing posts to bootstrap a style guide
- **Writing Workflow** — Structured process for drafting, outlining, and headlines
- **Multi-Pass Editing** — Structure → Clarity → Voice → Technical → SEO
- **Fact-Checking** — Verify claims before publishing
- **SEO Optimization** — Keywords, meta, internal/external links
- **WordPress Integration** — REST API for drafts and publishing

## Quick Start

### First-Time Setup

1. Copy credentials template:
   ```bash
   mkdir -p .credentials
   # Add your WordPress credentials to .credentials/wordpress.json
   ```

2. Run the post analyzer to bootstrap your style guide:
   ```bash
   # With auth (your own blog - includes block analysis)
   node skills/blogger/scripts/analyze-posts.js \
     --site=https://yourblog.com \
     --credentials=.credentials/wordpress.json \
     --output=.blog-style/

   # Or public mode (any WordPress site)
   node skills/blogger/scripts/analyze-posts.js \
     --site=https://any-wordpress-site.com \
     --output=.blog-style/ \
     --public
   ```

3. Review and complete the generated `.blog-style/voice.md`

### Writing a Post

Tell the agent:
```
Write a post about [topic]
```

It will:
1. Check the style guide exists
2. Create an outline
3. Generate headline options
4. Draft the post
5. Run editing passes

### Editing a Draft

```
Edit this draft: [paste content or file path]
```

### Publishing

```
Publish this post: [final draft]
```

Always creates as draft first. Never auto-publishes.

## File Structure

```
skills/blogger/
├── SKILL.md                    # Main skill file
├── README.md                   # This file
├── references/
│   ├── writing-guide.md        # Writing best practices
│   ├── editing-checklist.md    # Multi-pass editing workflow
│   ├── seo-checklist.md        # SEO optimization
│   ├── headline-formulas.md    # Proven headline patterns
│   └── fact-checking.md        # Verification workflow
├── templates/
│   ├── style-guide.md.template # Empty style guide
│   └── post-outline.md.template # Post outline structure
└── scripts/
    └── analyze-posts.js        # Post analyzer script
```

## Project Configuration

Style guides and credentials live in your project:

```
your-blog-project/
├── .blog-style/
│   ├── voice.md           # Voice & tone (generated/edited)
│   ├── examples.md        # Links to exemplar posts
│   └── terminology.md     # Brand terms
├── .credentials/
│   └── wordpress.json     # API credentials (gitignore this!)
└── ...
```

## Credentials Format

```json
{
  "site": "https://yourblog.com",
  "rest_api": {
    "username": "your-username",
    "app_password": "xxxx xxxx xxxx xxxx xxxx xxxx"
  }
}
```

Generate an application password in WordPress: **Users → Profile → Application Passwords**

## License

MIT
