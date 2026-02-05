# Skill Ideas

Potential skills to develop for the agent-skills collection.

---

## Image Generation Workflow Skill

**Problem:** Agents forget they can generate images, or don't know how to use the available tools effectively. OpenClaw has `nano-banana-pro` (Gemini 3 Pro Image) bundled, but agents need clearer guidance on when and how to use it.

**Note:** `nano-banana-pro` already exists in OpenClaw as a bundled skill. This idea is about creating a **workflow guide** or **quick reference** for agents to remember and use it effectively.

**Scope:**
- Quick reference for image generation commands
- Common use cases with example prompts:
  - App icons (multiple sizes, flat design prompts)
  - Placeholder images for mockups
  - Simple diagrams and illustrations
  - Avatar/profile pictures
- Post-processing tips (resizing with `sips`, format conversion)
- Prompt engineering patterns for better results

**Example workflow:**
```bash
# Generate base icon at high res
uv run {nano-banana-pro}/scripts/generate_image.py \
  --prompt "Simple moon icon, blue on dark background, flat design" \
  --filename icon-128.png --resolution 1K

# Resize for multiple sizes
sips -z 48 48 icon-128.png --out icon-48.png
sips -z 16 16 icon-128.png --out icon-16.png
```

**Why this matters:** I literally forgot I could generate images and tried to give up with "no ImageMagick available." A quick-reference skill would prevent this.

---

*Add more ideas below...*
