# Design Inspiration Sources — Headless Browser Compatibility Report

**Tested:** 2026-02-11  
**Method:** Browserless/Chromium headless screenshots via `browse.sh screenshot`  
**Viewport:** Default (1280×720 equivalent)

---

## 1. Design Gallery / Showcase Sites

| Source | Screenshot | File Size | Content Quality | Design Density | Browsability | Rating |
|--------|-----------|-----------|-----------------|---------------|-------------|--------|
| **awwwards.com/websites/** | ✅ Yes | 51K | Gallery with website thumbnails, filter panel, no login wall. Small cookie banner but doesn't block. | 2 thumbnails visible above fold | `/websites/e-commerce/`, `/websites/portfolio/` — category URLs work | **A** |
| **siteinspire.com** | ⚠️ Partial | 12K | Broken images — hero image failed to load. Mostly empty gray space. | 0 (images broken) | Has categories but images don't render headless | **F** |
| **httpster.net** | ✅ Yes | 52K | Clean gallery with site screenshots, vintage aesthetic. Good content. | 2-3 sites visible | `/2024/jan/` — date-based archives work | **A** |
| **godly.website** | ⚠️ Partial | 35K | Newsletter subscribe overlay covers the grid. Background thumbnails partially visible but obscured. | 1-2 (behind overlay) | Has index but overlay is a barrier | **C** |
| **minimal.gallery** | ✅ Yes | 51K | Design gallery content visible | 2-3 thumbnails | Browsable | **B** |
| **brutalistwebsites.com** | ✅ Yes | 13K | Intentionally minimal text-only page. Just description + submit link. No thumbnails on homepage. | 0 on homepage | Need to scroll/paginate for actual sites | **C** |
| **cssdesignawards.com** | ✅ Yes | 41K | Gallery visible with thumbnails | 2-3 | Category browsing available | **B** |
| **csswinner.com** | ✅ Yes | 34K | Gallery content visible | 2-3 | Browsable | **B** |
| **thebestdesigns.com** | ❌ No | — | Timed out / no screenshot produced | — | — | **F** |
| **admiretheweb.com** | ✅ Yes | 46K | Gallery with thumbnails | 2-3 | Browsable | **B** |
| **onepagelove.com** | ✅ Yes | 54K | Excellent gallery — 8,889 one-pagers curated. Two featured designs visible with thumbnails. Since 2005. | 2 featured designs | `/gallery/portfolio`, `/gallery/landing-page` — category URLs work great | **A** |
| **landbook.com** | ❌ No | — | Timed out | — | — | **F** |
| **lapa.ninja** | ✅ Yes | 73K | Rich content — 7,300+ landing pages, thumbnails visible, Squarespace ad banner at top. | 2 thumbnails + ad | `/category/saas/`, `/category/portfolio/` — excellent category system | **A** |
| **saaspages.xyz** | ✅ Yes | 32K | Content visible but lower density | 1-2 | Browsable | **B** |
| **screenlane.com** | ✅ Yes | 61K | UI/UX inspiration, hero section with CTAs. Design content visible. | Landing page only above fold | Has exploration features | **B** |
| **collectui.com** | ✅ Yes | 71K | Excellent — grid of UI design thumbnails (14,426 designs). Sorted by newest. Daily challenge designs. | 6+ thumbnails visible | `/designs/login-page`, `/designs/landing-page` — component-based URLs | **A** |
| **lookup.design** | ✅ Yes | 43K | Design tool/directory | Low | Browsable | **B** |
| **nicelydone.club** | ✅ Yes | 56K | Design screenshots visible | 2-3 | Browsable | **B** |
| **pageflows.com** | ✅ Yes | 61K | User flow inspiration, hero section. Brand logos visible. | Landing page content | Has platform filters (iOS, Android, Web) | **B** |
| **darkmodedesign.com** | ❌ No | 3.5K | Completely black screenshot — likely JS-rendered and didn't load | 0 | — | **F** |

## 2. Template / Portfolio Platforms

| Source | Screenshot | File Size | Content Quality | Design Density | Browsability | Rating |
|--------|-----------|-----------|-----------------|---------------|-------------|--------|
| **cargo.site/Templates** | ❌ No | — | Timed out | — | — | **F** |
| **readymag.com/explore** | ❌ No | — | Timed out | — | — | **F** |
| **squarespace.com/templates** | ✅ Yes | 46K | Landing page section visible but no template grid above fold | 0 above fold | Category browsing available | **C** |
| **wix.com/website/templates** | ✅ Yes | 34K | Template page loaded but low content density | 1-2 | Category URLs exist | **C** |
| **themes.shopify.com** | ✅ Yes | 63K | "Top themes" section visible with 3 theme cards partially shown | 3 (partial) | Good category system | **B** |
| **framer.com/templates** | ✅ Yes | 43K | Template marketplace with search, categories, and multiple previews | 3-4 templates | Search + categories | **A** |
| **webflow.com/templates** | ✅ Yes | 58K | Header/search visible but template grid below fold | 0 above fold (just hero) | Search + categories available | **C** |

## 3. Design Movement / Art Reference

| Source | Screenshot | File Size | Content Quality | Design Density | Browsability | Rating |
|--------|-----------|-----------|-----------------|---------------|-------------|--------|
| **moma.org/collection/** | ✅ Yes | 62K | Collection intro page — 200K works, 106K online. No artwork thumbnails above fold, cookie notice. | 0 above fold | Search available | **C** |
| **metmuseum.org/art/collection** | ✅ Yes | 72K | Hero image of gallery + search bar. 490K works. Visually rich hero. | 1 (hero photo) | `/search?q=painting` search works | **B** |
| **artsandculture.google.com** | ✅ Yes | 44K | Content loaded but moderate density | Low | Browsable themes | **B** |
| **behance.net** (search) | ✅ Yes | 60K | **Excellent** — project thumbnails freely visible, no login wall. Graphic design projects with likes/views. | 4-6 project thumbnails | `/search/projects?field=web+design` — search URLs work perfectly | **A** |
| **dribbble.com/shots/popular** | ✅ Yes | 76K | **Good** — design shots visible, no login wall blocking browse. Sign-up banner but non-blocking. | 4-6 shots visible | `/search/landing-page` — search works | **A** |
| **pinterest.com** (search) | ⚠️ Partial | 40K | **LOGIN WALL** — modal overlay blocks all content. Pins visible but blurred behind auth gate. | 0 (blocked) | Blocked by auth | **F** |
| **flickr.com/search** | — | — | Not tested (low priority) | — | — | — |
| **archive.org** | ✅ Yes | 48K | Homepage loaded with various collections visible | Low design density | `/search?query=` works | **C** |
| **eyeondesign.aiga.org** | ✅ Yes | 4.1K | Very small file — likely mostly text/empty | Very low | — | **F** |
| **itsnicethat.com** | ✅ Yes | 55K | Design blog/magazine content. Articles with images. | 2-3 article cards | Browsable categories | **B** |
| **designobserver.com** | ✅ Yes | 41K | Design criticism/writing blog. Less visual, more text. | 1-2 article previews | Categories available | **C** |

## 4. Typography Resources

| Source | Screenshot | File Size | Content Quality | Design Density | Browsability | Rating |
|--------|-----------|-----------|-----------------|---------------|-------------|--------|
| **typewolf.com** | ✅ Yes | 45K | Typography showcase content | Moderate | Browsable | **B** |
| **fontsinuse.com** | ✅ Yes | 79K | **Excellent** — rich visual content showing fonts in real-world use. High image density. | 4-6 examples | `/in/2/formats/1/web` — format/use-case filtering | **A** |
| **typographicposters.com** | ✅ Yes | 209K | **Outstanding** — massive grid of hundreds of poster thumbnails. Highest file size of all tests = richest visual content. | 50+ poster thumbnails | Collections, browsable | **A** |
| **fonts.google.com** (specimen) | ❌ No | — | Timed out (colourlovers/pattern sites ran instead) | — | `/specimen/Roboto` URLs | **F** |
| **typography.com** | ✅ Yes | 59K | Professional type foundry content. Specimen visible. | 2-3 typeface previews | Browsable | **B** |

## 5. Color / Pattern Resources

| Source | Screenshot | File Size | Content Quality | Design Density | Browsability | Rating |
|--------|-----------|-----------|-----------------|---------------|-------------|--------|
| **colourlovers.com** | ❌ No | — | Timed out | — | — | **F** |
| **coolors.co** | ✅ Yes | 70K | Color palette tool loaded. Rich visual content. | Multiple palettes | Palette generator URL params | **B** |
| **colorhunt.co** | ✅ Yes | 54K | **Excellent** — grid of color palettes with likes. Category sidebar (Pastel, Vintage, Retro, Neon, etc.) | 3+ palettes visible | `/palettes/pastel`, `/palettes/vintage` — category URLs | **A** |
| **patternico.com** | ❌ No | — | Not tested | — | — | — |
| **pattern.monster** | ❌ No | — | Timed out | — | — | **F** |
| **heropatterns.com** | ✅ Yes | 47K | SVG pattern library loaded | Pattern preview visible | Direct URL | **B** |

## 6. Image Search Engines

| Source | Screenshot | File Size | Content Quality | Design Density | Browsability | Rating |
|--------|-----------|-----------|-----------------|---------------|-------------|--------|
| **Google Images** | ✅ Yes | 91K | **Excellent** — full image grid loaded for "brutalist web design." Filter chips (Layout, Modern, Examples). Rich results. | 8-12 thumbnails | `?q=QUERY&tbm=isch` — fully parameterized | **A** |
| **Bing Images** | ✅ Yes | 91K | **Excellent** — full image grid for "minimalist web design." Filter chips (Examples, Templates, Blog). | 8-12 thumbnails | `?q=QUERY` — fully parameterized | **A** |
| **Pinterest search** | ❌ No | 40K | Login wall blocks everything | 0 | Blocked | **F** |
| **Are.na search** | ✅ Yes | 28K | Search results loaded (1.2K results for "brutalist design") but thumbnails barely visible. Mostly filters/UI. | 1-2 partial thumbnails | `/search/QUERY` — works | **C** |

---

## Recommended Sources

### Best for Style / Website References
1. **Awwwards** (`/websites/`, `/websites/{category}/`) — A-rated, category filtering, rich thumbnails
2. **Lapa Ninja** (`/category/{type}/`) — A-rated, 7,300+ landing pages, excellent categories
3. **One Page Love** (`/gallery/{type}`) — A-rated, 8,889 curated one-pagers
4. **Collect UI** (`/designs/{component}`) — A-rated, 14,400+ UI designs, component-based browsing
5. **Httpster** (`/{year}/{month}/`) — A-rated, clean archive, date-based browsing
6. **Dribbble** (`/shots/popular`, `/search/{query}`) — A-rated, large community, search works
7. **Behance** (`/search/projects?field={query}`) — A-rated, open access, search URLs work

### Best for Art / Movement References
1. **Behance** (`/search/projects?field=graphic+design`) — A-rated, free access to project galleries
2. **Dribbble** (`/search/{query}`) — A-rated, good for visual movements
3. **It's Nice That** (browsable categories) — B-rated, design journalism
4. **Met Museum** (`/art/collection/search?q={query}`) — B-rated, 490K works

### Best for Typography Research
1. **Typographic Posters** — A-rated, **highest visual density of any source tested** (209K file, 50+ posters per screenshot)
2. **Fonts in Use** (`/in/2/formats/1/web`) — A-rated, real-world font usage examples
3. **Typewolf** — B-rated, curated typography showcase
4. **Typography.com** — B-rated, professional specimens

### Best for Color / Pattern Research
1. **Color Hunt** (`/palettes/{style}`) — A-rated, excellent palette grid with style categories
2. **Coolors** — B-rated, palette generator
3. **Hero Patterns** — B-rated, SVG pattern library

### Best for Image Search Moodboards
1. **Google Images** (`/search?q={query}&tbm=isch`) — A-rated, highest density, filter chips for refinement
2. **Bing Images** (`/images/search?q={query}`) — A-rated, equally good results, good filters

> **Note:** For image searches, use `BROWSE_SKIP_VALIDATE=1` flag.

### Best for Specific Industries
- **Shopify Themes** — B-rated, e-commerce focused templates
- **Framer Templates** — A-rated, SaaS/startup focused
- **Lapa Ninja** — Has categories like `/category/saas/`, `/category/agency/`, `/category/portfolio/`
- **Awwwards** — Has categories like `/websites/e-commerce/`, `/websites/portfolio/`

---

## Key URL Patterns

```
# Website Galleries (category browsing)
https://www.awwwards.com/websites/{category}/
https://lapa.ninja/category/{category}/
https://onepagelove.com/gallery/{type}
https://collectui.com/designs/{component-type}
https://httpster.net/{year}/{month}/

# Design Communities (search)
https://www.behance.net/search/projects?field={query}
https://dribbble.com/search/{query}

# Image Search (moodboards)
https://www.google.com/search?q={query}&tbm=isch
https://www.bing.com/images/search?q={query}

# Typography
https://fontsinuse.com/in/2/formats/1/web
https://www.typographicposters.com/

# Color Palettes
https://colorhunt.co/palettes/{style}
  # styles: pastel, vintage, retro, neon, gold, light, dark, warm, cold, summer, fall, winter, spring

# Templates
https://www.framer.com/templates/
https://themes.shopify.com/
```

## Sources to AVOID (F-rated)

- **siteinspire.com** — Images break in headless browser
- **thebestdesigns.com** — Times out
- **darkmodedesign.com** — Renders as black screen (JS-dependent)
- **pinterest.com** — Login wall blocks everything
- **godly.website** — Newsletter overlay blocks content
- **cargo.site** — Times out
- **readymag.com** — Times out
- **landbook.com** — Times out
- **eyeondesign.aiga.org** — Barely any content renders
- **colourlovers.com** — Times out
- **pattern.monster** — Times out
- **fonts.google.com** — Times out (heavy JS app)
