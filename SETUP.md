# Setup Guide — Social AI Team

This guide walks you through everything you need to get the Social AI Team running from scratch. No technical experience required.

**What you're setting up:** A set of AI "skills" that run inside Claude Code — Anthropic's coding tool — and work together as a complete social media team. Once installed, you run a skill by typing `/skill-name` in Claude Code and the AI does the work.

---

## What You Need Before Starting

| Requirement | Cost | Notes |
|---|---|---|
| **Claude Code** | Included with Claude Pro ($20/mo) | You need Claude Pro at minimum. Claude Max ($100/mo) is better for heavy use — higher usage limits. |
| **This repo** | Free | Either downloaded or cloned from GitHub |
| **A client folder** | Free | Just a folder on your computer for each client you manage |

That's the minimum. The optional extras (MCP servers) are covered in Part 4.

---

## Part 1 — Get Claude Code

Claude Code is the tool the skills run inside. It's a chat interface that can also read files, run code, and connect to external tools.

### Step 1: Sign up for Claude Pro

Go to [claude.ai](https://claude.ai) and sign up for **Claude Pro** ($20/month). This gives you access to Claude Code.

> If you're going to use this for multiple clients or use it heavily, **Claude Max** ($100/month) gives you much higher usage limits. For professional social media work, it's worth it.

### Step 2: Download Claude Code

Go to [claude.ai/code](https://claude.ai/code) and download the desktop app for your system (Mac or Windows).

Install it like any other app. Sign in with the same account you just created.

---

## Part 2 — Download This Repo

You have two options. Option B is easier if you've never used git.

### Option A: Clone with git (if you have git installed)

Open a terminal and run:
```bash
git clone https://github.com/stevenflanagan1/social-ai-team.git
```

### Option B: Download as a ZIP (easier)

1. Go to [github.com/stevenflanagan1/social-ai-team](https://github.com/stevenflanagan1/social-ai-team)
2. Click the green **Code** button
3. Click **Download ZIP**
4. Unzip the file somewhere on your computer (e.g. your Desktop or Documents)

---

## Part 3 — Install the Skills

This copies the skills into the right place so Claude Code can find them.

### Mac or Linux

1. Open **Terminal** (search "Terminal" in Spotlight on Mac)
2. Navigate to the folder you downloaded:
   ```bash
   cd ~/Desktop/social-ai-team
   ```
   (Replace `~/Desktop/social-ai-team` with wherever you saved the folder)
3. Run the installer:
   ```bash
   bash install.sh
   ```
4. You should see 10 skills listed with checkmarks. Done.

### Windows

1. Open the `social-ai-team` folder
2. Double-click `install.bat`
3. A command window will open, install the skills, and close. Done.

**What this does:** Copies all 10 skill folders into `~/.claude/skills/` — the location Claude Code checks for available skills.

---

## Part 4 — Set Up MCP Servers (the power-ups)

MCPs are connections that give Claude Code access to external tools — a web browser, an image generator, a scheduling platform. Think of them like plugins.

**The skills work without MCPs** (in what's called "baseline mode"), but MCPs are what make this system genuinely powerful. Here's what each one does and how to get it.

---

### MCP 1: Playwright — Web Browser Control

**Used by:** `/brand-onboarding`

**What it does:** Lets Claude Code control a real web browser — visits your client's website and Instagram, takes screenshots, and pulls real data for the brand setup. Without it, you enter brand details manually.

**How to install:**

Open a terminal and run:
```bash
claude mcp add @playwright/mcp --scope user
```

That's it. Playwright is maintained by Microsoft and installs automatically.

---

### MCP 2: Nano Banana — AI Image Generation

**Used by:** `/social-creative-designer`

**What it does:** Powers the entire visual creation system — lifestyle photos, product composites, brand text overlays, and stop-motion Reels. This is the MCP that generates the actual images. Without it, `/social-creative-designer` cannot run.

**How to install:**

Nano Banana is a custom MCP. Find the installation instructions at the link shared alongside this repo. You'll need an API key from the Nano Banana service.

---

### MCP 3: Blotato — Scheduling + Infographics

**Used by:** `/publisher`

**What it does:** Lets Claude Code schedule posts directly to your social platforms and generate infographic-style images (stat cards, framework diagrams, quote graphics). This is the only MCP needed for publishing.

**How to install:**

1. Create an account at [blotato.com](https://blotato.com)
2. Connect your social accounts inside Blotato (LinkedIn, Instagram, X, Threads, etc.)
3. Find the **MCP server setup** instructions inside your Blotato account settings and follow them

> **Blotato is optional.** All the content creation skills (calendar, captions, platform writers, visuals) work without it. You only need Blotato if you want to schedule posts directly from Claude Code. If you'd rather export the content and schedule it yourself in Later, Buffer, or the native platform — that works fine.

---

### MCP 4: Firecrawl — Web Scraping for Research (Optional)

**Used by:** `/content-calendar`, `/caption-writer`, `/linkedin-writer`, `/x-writer`, `/social-performance-review`

**What it does:** Lets Claude Code scrape competitor social profiles and websites for research — hooks, caption styles, content gaps. Makes the calendar and captions much more targeted.

**How to install:**

1. Get an API key from [firecrawl.dev](https://firecrawl.dev)
2. Open a terminal and run:
   ```bash
   claude mcp add firecrawl-mcp --scope user
   ```
3. Add your API key when prompted

---

### Summary: What to install first

| Priority | MCP | Why |
|---|---|---|
| Install first | **Playwright** | Makes brand onboarding work properly |
| Install first | **Nano Banana** | Required for any visual creation |
| Install if publishing | **Blotato** | Only needed for direct scheduling |
| Install later | **Firecrawl** | Makes research better — not essential on day one |

---

## Part 5 — Set Up Your First Client

Every client gets their own folder. Claude Code reads and writes files relative to whichever folder it's open in — so keeping clients separate means their brand guides, calendars, and content never mix.

### Step 1: Create a client folder

```
Documents/
  social-ai-clients/
    cafe-rio/           ← one folder per client
    bloom-salon/
    your-brand/
```

Name the folder something simple and lowercase (no spaces — use hyphens instead).

### Step 2: Open that folder in Claude Code

**In the Claude Code desktop app:**
1. Open Claude Code
2. Click **Open Folder** (or File → Open Folder)
3. Select your client folder

> This is important. Claude Code works in the folder you have open. If you're in the wrong folder, context files from one client will bleed into another.

### Step 3: Run your first skill

Type this in the chat:
```
/social-media-manager
```

Press Enter. The orchestrator will check what context exists and tell you exactly what to do next. For a new client, it will offer to run `/brand-onboarding` first.

---

## Part 6 — Your First Session (What to Expect)

Here's what a first session looks like for a new client:

**1. Run `/social-media-manager`**
The AI checks what context files exist in your folder. For a new client, nothing exists yet — it will offer Route A (New Client Setup).

**2. Run `/brand-onboarding`**
This is the most important step. The AI will:
- Ask for the client's website and Instagram handle
- Visit both (using Playwright) and take screenshots
- Ask you a series of questions about the brand
- Produce a pre-filled brand doc for you to review
- Save everything to `context/brand-style.md`

This file is what every other skill reads. Get it right and the whole system improves.

**3. Run `/content-calendar`**
Once brand setup is done, build the first content calendar. The AI will ask about the month, posting frequency, platforms, and any upcoming events or campaigns. Output: `context/content-calendar.md`.

**4. Run `/caption-writer` or platform specialist skills**
Write captions from the calendar. Use `/caption-writer` for Instagram/Facebook. Use `/linkedin-writer`, `/threads-writer`, or `/x-writer` for those platforms specifically.

**5. Run `/social-creative-designer`** (needs Nano Banana)
Generate visuals for posts that need them. Works per-post — you review and approve each one before moving on.

**6. Run `/publisher`** (needs Blotato — optional)
Schedule everything. Or skip this and export the content files to schedule yourself.

---

## Common Questions

**Do I need to be technical to use this?**
No. You type a skill name, the AI asks you questions, and you answer them. The skills are designed to be conversational.

**Can I use this for multiple clients?**
Yes — just create a separate folder for each client and open that folder in Claude Code before running any skills.

**What if a skill fails or stops mid-way?**
Run `/social-media-manager` again. It reads `context/workflow-status.md` and picks up exactly where you left off.

**What's the difference between `/caption-writer` and `/linkedin-writer`?**
`/caption-writer` writes Instagram and Facebook captions. `/linkedin-writer`, `/threads-writer`, and `/x-writer` write natively for those platforms — different voice, different format, different rules. Don't use `/caption-writer` for LinkedIn; the output won't perform as well.

**Do I need all the MCPs?**
No. Start with Playwright and Nano Banana. Add Blotato when you want to schedule directly from Claude Code. Firecrawl is an optional upgrade.

**Why is my usage running out?**
The skills are thorough — each session uses a lot of context. Claude Max ($100/mo) gives significantly higher limits and is recommended if you're using this for real client work.

---

## Quick Reference

```
For a new client:
  /social-media-manager   → detects new client, runs brand onboarding

Monthly workflow:
  /social-media-manager   → picks up from workflow-status.md

Run skills directly:
  /brand-onboarding       → one-time brand setup
  /content-calendar       → monthly post plan
  /caption-writer         → Instagram + Facebook captions
  /linkedin-writer        → LinkedIn-native posts
  /threads-writer         → Threads posts
  /x-writer               → X/Twitter posts
  /social-creative-designer  → AI visuals (Nano Banana)
  /publisher              → schedule via Blotato (optional)
  /social-performance-review → end-of-month analysis
```

---

## Still Stuck?

- **Claude Code help:** [claude.ai/code](https://claude.ai/code) has full documentation
- **MCP setup issues:** Each MCP has its own support — check the service's own docs
- **Skill not working:** Make sure you're in the right client folder and have run `/brand-onboarding` first — most issues trace back to a missing `context/brand-style.md`
