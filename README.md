# Social AI Team

A set of Claude Code skills that work together as a complete social media team for small and medium businesses. Each skill is a specialist. Together they run the full workflow — from brand setup to content creation to monthly performance review.

Built to run inside [Claude Code](https://claude.ai/code).

---

## How the Skills Work Together

```
/social-media-manager  ← start here (orchestrates everything)
         │
         ├── /brand-onboarding ──────────→ context/brand-style.md
         │       Run once per client.             │
         │       Captures brand identity,          │ (read by all skills below)
         │       voice, and goals.                 │
         │                                         ▼
         ├── /content-calendar ──────────→ context/content-calendar.md
         │       Run monthly.
         │       Builds a structured month
         │       of post ideas.
         │                    │
         │                    ▼
         ├── /caption-writer ────────────→ outputs/captions/
         │       Run monthly, after calendar.
         │       Writes ready-to-post captions
         │       with hooks, CTAs, and hashtags.
         │                    │
         │                    ▼
         ├── /social-creative-designer ──→ outputs/creatives/
         │       Run per post, after captions.
         │       Generates on-brand visuals
         │       (Generate / Composite / Brand / Stop-Motion).
         │
         └── /social-performance-review ─→ outputs/reviews/
                 Run end of month.                  │
                 Analyses what worked,              │
                 what didn't, and why.              ▼
                                         context/best-performers.md
                                         (feeds back into next month)
```

### Skills cross-reference each other:
- `/brand-onboarding` → writes `brand-style.md` → read by all other skills
- `/content-calendar` → writes `content-calendar.md` → read by `/caption-writer`
- `/caption-writer` → writes Visual Direction field → read by `/social-creative-designer`
- `/social-performance-review` → updates `best-performers.md` → read by `/caption-writer` next month

---

## What Each Skill Does

### `/social-media-manager` — Orchestrator
The coordinator. Reads the current state of a client's workflow and routes to the right starting point — new client setup, monthly production, end-of-month review, or a specific task. Pause-and-approve gates at every handoff prevent downstream mistakes.

### `/brand-onboarding` — Brand Strategist
Run once per client before anything else. Uses Playwright to capture evidence from the client's website and Instagram, generates a pre-filled client onboarding doc, then synthesises everything into `context/brand-style.md` — the single source of truth for all creative and content work.

### `/content-calendar` — Social Media Strategist
Builds a structured month of post ideas. Defines content pillar ratios and format mix before building. Each post entry includes topic, angle, format, objective, and visual direction. Saves to `context/content-calendar.md` for `/caption-writer` to read.

### `/caption-writer` — Senior Copywriter
Writes ready-to-post captions from the calendar. Six storytelling frameworks, platform-specific formatting for Instagram / LinkedIn / Facebook / TikTok / X. Every caption includes a Visual Direction field as a handoff note for `/social-creative-designer`.

### `/social-creative-designer` — Creative Designer
Generates on-brand social visuals using the Nano Banana image generation MCP. Four modes:
- **Generate** — AI image from a concept (lifestyle / atmospheric content)
- **Composite** — anchors the client's real product photo in an AI-generated scene
- **Brand** — applies text overlay treatment to a real client photo
- **Stop-Motion** — 6-frame action sequence exported as a looping MP4 Reel

### `/social-performance-review` — Social Media Analyst
Monthly performance review. Accepts CSV exports, screenshots, or manual data input — adapts to whatever the client can provide. Identifies top and bottom performers, content pillar and format patterns, and produces ranked recommendations for next month. Updates `best-performers.md` to feed back into caption quality.

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
    ├── captions/               ← caption files land here
    ├── creatives/              ← generated images land here
    └── reviews/                ← monthly review reports land here
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
| **Nano Banana** | `/social-creative-designer` | AI image generation (required for visuals) |
| **Firecrawl** | `/content-calendar`, `/caption-writer`, `/social-performance-review` | Competitor content research (optional) |
| **SerpApi** | `/content-calendar`, `/caption-writer` | Trend research (optional) |

Playwright and Nano Banana are the two you need for the core workflow. Firecrawl and SerpApi are optional enhancements.

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
/social-performance-review
```

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
