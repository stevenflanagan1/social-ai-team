# Social AI Team

A set of Claude Code skills that work together as a complete social media team for small and medium businesses. Each skill is a specialist. Together they run the full workflow — from brand setup to platform-native content creation to scheduling and monthly performance review.

Built to run inside [Claude Code](https://claude.ai/code).

---

## How the Skills Work Together

```
/social-media-manager  ← start here (orchestrates everything)
         │
         │  LAYER 1 — FOUNDATION
         ├── /brand-onboarding ──────────→ context/brand-style.md
         │       Run once per client.             │
         │       Captures brand identity,          │ (read by all skills below)
         │       voice, and goals.                 │
         │                                         ▼
         ├── /content-calendar ──────────→ context/content-calendar.md
         │       Run monthly.                      │
         │       Builds a structured month         │ (read by all content skills)
         │       of post ideas.                    │
         │                                         │
         │  LAYER 2 — CONTENT CREATION             │
         ├── /caption-writer ────────────→ outputs/captions/
         │       Instagram, Facebook,
         │       and multi-platform captions.
         │
         ├── /social-creative-designer ──→ outputs/creatives/
         │       Branded visuals via Nano Banana
         │       (Generate / Composite / Brand / Stop-Motion).
         │
         ├── /linkedin-writer ───────────→ outputs/linkedin/
         │       LinkedIn-native posts.
         │       First-person, insight-led,
         │       built for LinkedIn's format.
         │
         ├── /threads-writer ────────────→ outputs/threads/
         │       Threads posts.
         │       Short, direct, opinion-led,
         │       500 char limit enforced.
         │
         ├── /x-writer ─────────────────→ outputs/x/
         │       X/Twitter posts and threads.
         │       Punchy, standalone hooks,
         │       280 char limit enforced.
         │
         │  LAYER 3 — DISTRIBUTION & REVIEW
         ├── /publisher ─────────────────→ Blotato (scheduled posts)
         │       Optional. Schedules content
         │       via Blotato and generates
         │       infographic visuals.
         │
         └── /social-performance-review ─→ outputs/reviews/
                 Run end of month.                  │
                 Analyses what worked,              │
                 what didn't, and why.              ▼
                                         context/best-performers.md
                                         (feeds back into next month)
```

### Skills cross-reference each other:
- `/brand-onboarding` → writes `brand-style.md` → read by all content skills
- `/content-calendar` → writes `content-calendar.md` → read by all Layer 2 content skills
- `/caption-writer` → writes Visual Direction field → read by `/social-creative-designer`
- `/linkedin-writer`, `/threads-writer`, `/x-writer` → write BLOTATO FLAG field → read by `/publisher`
- `/social-performance-review` → updates `best-performers.md` → read by all content skills next month

---

## What Each Skill Does

### `/social-media-manager` — Orchestrator
The coordinator. Reads the current state of a client's workflow and routes to the right starting point — new client setup, monthly production, platform-specific content, end-of-month review, or a specific task. Pause-and-approve gates at every handoff prevent downstream mistakes.

### `/brand-onboarding` — Brand Strategist
Run once per client before anything else. Uses Playwright to capture evidence from the client's website and Instagram, generates a pre-filled client onboarding doc, then synthesises everything into `context/brand-style.md` — the single source of truth for all creative and content work.

### `/content-calendar` — Social Media Strategist
Builds a structured month of post ideas. Defines content pillar ratios and format mix before building. Each post entry includes topic, angle, format, objective, and visual direction. Saves to `context/content-calendar.md` for all content skills to read.

### `/caption-writer` — Senior Copywriter
Writes ready-to-post captions from the calendar. Six storytelling frameworks, platform-specific formatting for Instagram / LinkedIn / Facebook / TikTok / X. Every caption includes a Visual Direction field as a handoff note for `/social-creative-designer`.

### `/social-creative-designer` — Creative Designer
Generates on-brand social visuals using the Nano Banana image generation MCP. Four modes:
- **Generate** — AI image from a concept (lifestyle / atmospheric content)
- **Composite** — anchors the client's real product photo in an AI-generated scene
- **Brand** — applies text overlay treatment to a real client photo
- **Stop-Motion** — 6-frame action sequence exported as a looping MP4 Reel

### `/linkedin-writer` — LinkedIn Content Specialist
Writes LinkedIn-native posts — not adapted captions. First-person, professional-but-human voice, structured for LinkedIn's format: hook line → short paragraphs → insight → CTA → 3-5 hashtags. Flags posts that would benefit from a Blotato infographic (stats, frameworks, numbered lists).

### `/threads-writer` — Threads Content Specialist
Writes Threads posts: short, direct, opinion-led, made for conversation. Strictly enforces the 500 character limit with a count on every post. Supports standalone posts and connected threads. Takes outperform tips on Threads — this skill writes for how the platform actually works.

### `/x-writer` — X/Twitter Content Specialist
Writes X-native posts and threads. Strictly enforces the 280 character limit with a count on every post. Every post works without context — no warm-ups, no preamble. X thread format (1/, 2/...). Optional X trend research via Tasty Content MCP.

### `/publisher` — Social Media Publisher
Takes approved content from any content skill and schedules it via Blotato MCP. Checks the Blotato connection first — shows a clear setup message if not connected. Generates infographic visuals (stat cards, framework diagrams, 3-step process graphics, quote graphics) for posts flagged by platform specialists. Full schedule confirmation before submitting anything. Blotato is optional — all other skills work without it.

### `/social-performance-review` — Social Media Analyst
Monthly performance review. Accepts CSV exports, screenshots, or manual data input — adapts to whatever the client can provide. Identifies top and bottom performers, content pillar and format patterns, and produces ranked recommendations for next month. Updates `best-performers.md` to feed back into content quality.

---

## Folder Structure (Per Client)

When you run these skills for a client, they create and read from this structure automatically:

```
your-client-folder/
├── context/
│   ├── brand-style.md          ← created by /brand-onboarding
│   ├── content-calendar.md     ← created by /content-calendar
│   ├── best-performers.md      ← created/updated by /social-performance-review
│   ├── upcoming-events.md      ← you create this (optional)
│   └── workflow-status.md      ← updated by /social-media-manager
├── assets/
│   ├── products/               ← client product photos go here
│   └── lifestyle/              ← lifestyle shots go here
└── outputs/
    ├── captions/               ← /caption-writer (Instagram, Facebook)
    ├── linkedin/               ← /linkedin-writer
    ├── threads/                ← /threads-writer
    ├── x/                      ← /x-writer
    ├── creatives/              ← /social-creative-designer (Nano Banana visuals)
    └── reviews/                ← /social-performance-review
```

---

## Installation

### Mac / Linux

```bash
bash install.sh
```

### Windows

Double-click `install.bat` or run it from the command line.

This copies all skills into `~/.claude/skills/` where Claude Code can find them.

---

## MCP Requirements

Some skills use MCP tools for enhanced functionality. Skills work in **baseline mode** without them, but these unlock additional capabilities:

| MCP | Used by | What it enables |
|---|---|---|
| **Playwright** | `/brand-onboarding` | Evidence capture from website + Instagram |
| **Nano Banana** | `/social-creative-designer` | AI image generation (required for branded visuals) |
| **Blotato** | `/publisher` | Post scheduling + infographic generation (optional — only needed for publishing) |
| **Firecrawl** | `/content-calendar`, `/caption-writer`, `/social-performance-review`, `/linkedin-writer`, `/x-writer` | Competitor content research (optional) |
| **SerpApi** | `/content-calendar`, `/caption-writer` | Trend research (optional) |
| **Tasty Content** | `/x-writer` | X/Twitter trend research (optional) |

Playwright and Nano Banana are the two you need for the core workflow. Blotato is optional — all content creation skills work without it. You only need Blotato if you want to schedule posts directly from Claude Code. Firecrawl, SerpApi, and Tasty Content are optional enhancements.

### Stop-Motion Reels (optional)
The `/social-creative-designer` Stop-Motion mode exports frames as an MP4 via Python. Requires:
```bash
pip install imageio[ffmpeg]
```

---

## How to Use

### New client
```
/social-media-manager
```
The orchestrator will detect that no brand file exists and walk you through `/brand-onboarding` first.

### Running a specific skill directly
```
/brand-onboarding
/content-calendar
/caption-writer
/social-creative-designer
/linkedin-writer
/threads-writer
/x-writer
/publisher
/social-performance-review
```

### Publishing content (Blotato)

After writing LinkedIn, Threads, or X content with the platform specialists:
```
/publisher
```
The publisher checks your Blotato connection, reviews flagged infographic opportunities, confirms the schedule, and submits. Requires Blotato to be configured first — see the MCP Requirements section above.

### Monthly workflow (existing client)
```
/social-media-manager
```
The orchestrator reads `context/workflow-status.md` and picks up exactly where you left off.

---

## Recommended Setup per Client

1. Create a dedicated folder for the client
2. `cd` into that folder before running any skill — context files are scoped to the working directory
3. Run `/social-media-manager` to start

```bash
mkdir my-client && cd my-client
# open Claude Code in this folder
# then run /social-media-manager
```

---

## Reference Files

Three reference documents are bundled with the relevant skills:

| File | Used by | Contents |
|---|---|---|
| `content-calendar/references/content-mix-guide.md` | `/content-calendar` | Recommended pillar ratios by business type |
| `caption-writer/references/hook-library.md` | `/caption-writer` | 40+ hook formulas by type |
| `social-performance-review/references/benchmarks.md` | `/social-performance-review` | Engagement benchmarks by platform and account size |

---

## License

MIT — use it, adapt it, build on it.
