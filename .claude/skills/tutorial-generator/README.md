[中文](./README.zh-CN.md) | **English**

# tutorial-generator

> The current workflow is defined in [SKILL.md](./SKILL.md). Users sign in directly in their browser without sharing passwords or verification codes in chat. Formats, languages, and permissions depend on the actual agent and system.

An AI skill for creating illustrated website tutorials. Give an agent a URL and a goal, and it can explore accessible pages, capture screenshots, and document verified steps using the tools available in its environment.

## Features

- **Works with different agents** — uses available browser and document capabilities; support depends on the environment
- **Login handling** — the user signs in directly in the browser; the agent verifies access
- **Verified screenshots** — capture the relevant page and result, and check for blank or incorrect images
- **Multiple output formats** — Markdown / HTML / PDF / video, depending on available capabilities
- **Video support** — live recording or screenshot slideshow, with narration and subtitles when available
- **Careful exploration** — sensitive data is protected and consequential actions require appropriate authorization

## Example showcase

Check out the full end-to-end generated tutorial in [`examples/xroute.ai`](./examples/xroute.ai):
- **Target Site**: [XRoute.ai](https://xroute.ai) (an AI model routing platform)
- **Workflows Covered**: Account registration, obtaining an API key, credit recharge, browsing models, and testing chat
- **Deliverables**: [Full Markdown Tutorial](./examples/xroute.ai/XRoute-tutorial.md) (with 20 verified screenshots), [MP4 Video Tutorial](./examples/xroute.ai/xroute-tutorial.mp4), SRT subtitles, and TTS narration audio

## Applicable scenarios & supported sites

This skill is **not restricted to tutorial or educational sites**. Its primary power is turning **any interactive web application or website** into illustrated user guides:

| Scenario | Example Sites | Best Use Cases |
|----------|---------------|----------------|
| **SaaS & Web Applications** (Primary) | GitHub, Notion, Linear, Stripe, Canva | Automatically document product features, setup guides (e.g., "how to create a repository and open a pull request") |
| **Internal Dashboards & Admin Portals** | CRM, ERP, Analytics consoles, DevOps portals | After secure user login, the agent navigates authorized modules to create team onboarding SOPs |
| **E-Commerce & Digital Services** | Shopify stores, online portals | Document signup, catalog search, checkout flows, and account settings |
| **Documentation & Knowledge Bases** | Developer docs, open-source documentation | Navigate complex docs hierarchies and compile a streamlined "Quickstart Guide" |

## Supported tools

Use with an agent that can load or read `SKILL.md`. Browser, session, recording, speech and document export support depends on the agent, tools and system. The agent checks what the requested task needs and explains missing permissions or capabilities. End-to-end support has not been verified for every agent or operating system.

## Installation

### Option 1 — One-line install via skills CLI (Recommended)

Install directly to your agent (Claude Code, Cursor, Antigravity, etc.) using [skills.sh](https://skills.sh):

```bash
# Global install (recommended, available across all projects)
npx skills add dashenbibi/tutorial-generator -g

# Or install to current project only
npx skills add dashenbibi/tutorial-generator
```

---

### Option 2 — Manual installation (No Node.js required)

**Claude Code:**

Download directly into Claude Code's skills directory with a single command (creates directory automatically):

```bash
curl -fsSL https://raw.githubusercontent.com/dashenbibi/tutorial-generator/main/SKILL.md -o ~/.claude/skills/tutorial-generator/SKILL.md --create-dirs
```

Or clone the repository directly:

```bash
git clone https://github.com/dashenbibi/tutorial-generator ~/.claude/skills/tutorial-generator
```

**Universal / Other Agents (Antigravity, Cursor, Codex, Hermes, Gemini CLI, etc.):**

Clone into your skills directory:

```bash
git clone https://github.com/dashenbibi/tutorial-generator ~/.skills/tutorial-generator
```

Then reference it in your prompt or at session start:

```
Please read ~/.skills/tutorial-generator/SKILL.md before starting.
```

## Usage

Send a natural language request to your AI agent. Providing a target **URL** along with the specific **tasks or goals** you want to document yields the best results:

```
# Scenario 1: General site exploration
Generate a tutorial for https://example.com

# Scenario 2: Focused business goals (recommended)
Generate a tutorial for https://xroute.ai: covering registration, getting an API key, and trying the chat interface

# Scenario 3: Specific formats and output language
Generate a tutorial for https://github.com: creating a repository and opening a pull request, format: markdown html, language: 中文

# Scenario 4: Video with subtitles and narration
Generate a tutorial for https://example.com  format: video+sub+audio
```

The agent checks the capabilities needed for the request, explores and verifies the selected features, then produces the requested formats. It asks follow-up questions only when scope, login, or access actually requires them.

### Output language

Specify the output language in your request. Voice and PDF rendering depend on available language support, fonts and speech tools:

```
Generate a tutorial for https://example.com  language: 中文
Generate a tutorial for https://example.com  language: 日本語
Generate a tutorial for https://example.com  language: Español
```

Examples of languages you can request:

| Language | Code |
|----------|------|
| English | `English` |
| 简体中文 | `中文` |
| 日本語 | `日本語` |
| 한국어 | `한국어` |
| Español | `Español` |
| Français | `Français` |
| Deutsch | `Deutsch` |
| Português | `Português` |
| العربية | `العربية` |

The default is the user’s language. Preserve website labels when needed and disclose missing font or voice support.

## Output format examples

```
# Markdown only (default)
Generate a tutorial for https://example.com

# Markdown + HTML
Generate a tutorial for https://example.com  format: markdown html

# Video with subtitles and narration
Generate a tutorial for https://example.com  format: video+sub+audio

# Multiple formats
Generate a tutorial for https://example.com  format: markdown html video+sub+audio
```

### Video and PDF capabilities

Prefer the agent’s available recording, document export and speech tools. When permissions or dependencies are missing, the agent explains what is needed; if recording is unavailable, it can offer a clearly labelled slideshow. PDF and video are not available in every environment.

## Output structure

Example layout; the actual files depend on the formats requested and the tools available:

```
{domain}/
├── {domain}-tutorial.md
├── {domain}-tutorial.html
├── {domain}-tutorial.pdf
├── {domain}-tutorial.mp4      (with subtitles / narration if requested)
├── {domain}-tutorial.srt
└── screenshots/
    ├── shot_00_home.png
    ├── shot_01_module_overview.png
    ├── shot_02_step1_before.png
    ├── shot_02_step1_after.png
    └── ...
```

## Capability mapping

The agent checks which capabilities the task needs and maps them to the tools available in its environment. These labels are examples, not mandatory tool names:

| Identifier | Description |
|-----------|-------------|
| `NAVIGATE` | Open / navigate to a URL |
| `CAPTURE` | Take a screenshot and save to file |
| `READ_PAGE` | Read page structure (compact / full) |
| `CLICK` | Click an element |
| `TYPE` | Type text into a field |
| `PRESS_KEY` | Press keyboard keys (optional) |
| `RUN_JS` | Execute JavaScript (optional) |
| `VISUAL_ANALYZE` | Screenshot + AI visual analysis (optional enhancement) |
| `SCREEN_RECORD` | Start/stop screen recording (video format only) |

> If your tool combines screenshot and visual analysis (e.g. Hermes `browser_vision`),
> map both `CAPTURE` and `VISUAL_ANALYZE` to it.

## FAQ

**Q: Does this only work on tutorial, documentation, or educational websites?**  
**A**: No! It creates tutorials *for* any website or web application. Whether it is a SaaS tool, internal admin console, e-commerce site, or documentation portal, the agent can navigate, capture screenshots, and document verified steps.

**Q: How does it handle private or login-required pages? Are my credentials safe?**  
**A**: Completely safe. The workflow adheres to strict privacy rules: it will **never ask for or process passwords or verification codes in chat**. When authentication is needed, you sign in directly in your browser, and the agent only verifies that the target workspace is accessible.

**Q: Can I use it if my environment lacks screen recording or TTS tools?**  
**A**: Yes. The default format is pure Markdown with verified screenshots. If video is requested but native recording is unsupported, the agent tells you what a slideshow loses, gets your agreement, and labels the result as a slideshow (filename and first frame) — it never presents one as an operation walkthrough.

**Q: Is this a CLI command or an AI Agent Skill?**  
**A**: It is an AI Agent Skill (defined in `SKILL.md`). Once installed, it is loaded into your agent (Claude Code, Cursor, Antigravity, Codex, etc.) and driven autonomously by natural language prompts.

## Changelog

| Version | Changes |
|---------|---------|
| v5.0.0 | Evidence model: a step is an action pair (before/action/after), state-only screens excluded from enforceable steps; form decided up front with recording first and slideshow labelled; coverage matrix; stopping points; falsifiable delivery checklist |
| v4.0.0 | Self-contained, agent-agnostic workflow; verified screenshots, login handoff, multiple formats, and capability checks |
| v3.2.0 | Pure English SKILL.md; separate bilingual README files |
| v3.1.0 | Bilingual SKILL.md (English + Chinese inline) |
| v3.0.0 | Full English rewrite; multi-language output support |
| v2.0.0 | Abstract capability identifiers replace hard-coded tool names |
| v1.9.0 | Decouple CAPTURE from VISUAL_ANALYZE |
| v1.8.0 | Video add-ons: +sub / +audio combinable; TTS 5-tier fallback |
| v1.7.0 | 5-tier screen recording detection |
| v1.6.0 | Video output format with ffmpeg MP4 |
| v1.5.0 | Phase 1 hard stop; browser_vision failure handling |
| v1.4.0 | Markdown / HTML / PDF output formats |
| v1.3.0 | Action type classification; edit/delete specialized handling |
| v1.2.0 | Mandatory screenshot rules; minimum count guarantee |
| v1.1.0 | Login handling by browser mode |
| v1.0.0 | Initial release |

## Contributing

Suggestions, bug reports, and pull requests are welcome! If a tutorial is incomplete, a screenshot is blank, login or video fails, or you have an idea to make the skill better, please [open an issue](https://github.com/dashenbibi/tutorial-generator/issues/new).

When reporting a problem, include your agent and operating system, the output format, what you expected, what happened, and steps to reproduce. Share a website URL or screenshot only when you are comfortable doing so, and remove passwords, tokens, and private information first. Feature ideas and examples of successful use are welcome too.

## License

MIT
