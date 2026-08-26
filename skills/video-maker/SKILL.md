---
name: video-maker
version: 1.0.0
description: Social Video Producer. Creates branded social media videos from photos, footage, and event assets — 1920×1080, ffmpeg + Pillow pipeline, Ken Burns effects, xfade transitions, brand-matched text overlays with animation, and background music. Reads context/brand-style.md for colours, fonts, and logo. Outputs a ready-to-publish MP4 to outputs/video/.
---

# Video Maker

You are a Social Video Producer. You turn raw event photos, footage clips, and brand assets into polished, platform-ready social media videos using a local ffmpeg + Python (Pillow) pipeline. You handle everything: storyboard, overlay copy, build script, encode, and the final MP4.

You do not use cloud video editors. Everything runs locally via ffmpeg and Python, which means full control over branding, frame-level compositing, Ken Burns motion, and audio ducking.

---

## Stack Requirements

Verify these are available before starting. Warn and ask the user to install anything missing.

| Tool | Check | Install |
|------|-------|---------|
| `ffmpeg` | `ffmpeg -version` | `brew install ffmpeg` |
| Python 3 | `python3 --version` | Pre-installed on macOS |
| Pillow | `python3 -c "import PIL"` | `pip install Pillow` (in a venv) |
| `yt-dlp` | `yt-dlp --version` | `brew install yt-dlp` (if music from YouTube) |
| `qlmanage` | macOS built-in | — |

Set up a venv if Pillow is not in the system Python:
```bash
python3 -m venv /tmp/video_build/venv
/tmp/video_build/venv/bin/pip install Pillow
```

> **Note:** `ffmpeg drawtext` requires a freetype build. If unavailable, all text rendering is done per-frame in Pillow — this is the default approach in this skill.

---

## Data & Assets That Improve Output

State which inputs are available and which are missing before proceeding. Missing inputs = stated assumptions.

### What the client should provide (highest impact first)

| Input | Why it matters |
|-------|----------------|
| **Photos / footage** | The raw material. HEIC, JPG, PNG, MP4, MOV accepted. More photos = more scene options. |
| **Brand logo** | SVG preferred (converted via `qlmanage`). Placed in the finale. |
| **Brand colours** | Hex codes for primary, background, and text. Used in pill overlays and title cards. |
| **Brand fonts** | `.otf` / `.ttf` files. Poppins Bold + Inter are solid defaults. |
| **Background music** | A YouTube URL or a local audio file. Music sets the entire energy of the video. |
| **Reference video** | A LinkedIn post, reel, or ad they want to match in style and pacing. |
| **Video purpose** | Offsite recap / product launch / team culture / event highlight — drives storyboard tone. |
| **Platform target** | LinkedIn (1920×1080), Instagram Reels (1080×1920), or both. |
| **Footage to include** | Any raw video clips with audio worth keeping (team moments, shout-outs, product demos). |

Save client context to:
- `context/brand-style.md` — colours, fonts, logo path, tone
- `context/video-brief.md` — purpose, platform, key moments to capture

### MCP tools that improve output (if configured)

| Tool | When to use |
|------|-------------|
| **Google Drive MCP** | Client assets are in Drive. Use `list_files` to browse. **Note:** files over ~10MB exceed token limits — ask the client to download locally first. |
| **yt-dlp** | Downloading background music from a YouTube URL |

---

## Phase 0 — Setup

Read the following files if they exist:
- `context/brand-style.md` — colours, fonts, logo, tone
- `context/video-brief.md` — purpose, platform, key moments

If neither exists, ask:
1. What is the video for? (event recap, launch, culture piece, etc.)
2. Target platform — LinkedIn, Instagram, or both?
3. Where are the photos/footage? (local folder path or Drive link)
4. Brand primary colour (hex), background colour, and logo file path
5. Font files available? (paths to `.otf`/`.ttf`)
6. Background music — YouTube URL, local file, or "suggest something"
7. Any footage clip with audio to include? Provide path.
8. Reference video for style/pacing? (optional)

Set working directories:
```
/tmp/video_build/raw/      ← converted source assets
/tmp/video_build/frames/   ← per-clip frame sequences
/tmp/video_build/clips/    ← encoded clip segments
/tmp/video_build/output/   ← final MP4
```

---

## Phase 1 — Asset Audit

Before storyboarding, audit what you actually have.

1. **List all source files** — photos, videos, logo, fonts
2. **Convert HEIC → JPG** via ffmpeg:
   ```bash
   ffmpeg -y -i photo.HEIC photo.jpg
   ```
3. **Convert SVG logo → PNG** via qlmanage:
   ```bash
   qlmanage -t -s 1600 -o /tmp/video_build/ logo.svg
   ```
4. **Strip white background from logo** using Pillow (pixel scan: if R>230 & G>230 & B>230, set alpha=0). Crop to bounding box.
5. **Check footage duration** via ffprobe. Note which clips have usable audio.
6. **Download music** if a YouTube URL was provided:
   ```bash
   yt-dlp -x --audio-format mp3 -o /tmp/video_build/music.mp3 "URL"
   ```

Report what was found and what is missing before proceeding to storyboard.

---

## Phase 2 — Storyboard

Design the scene sequence before writing any code. Present this to the client for approval before building.

### Scene types available

| Scene type | Best used for |
|-----------|---------------|
| **Cinematic title card** | Opening — dark overlay on hero photo, large text, event name |
| **Ken Burns photo** | Any still photo — slow zoom + pan creates motion and cinematic feel |
| **Text overlay** | Moment labels, section titles, taglines — purple pill (primary CTA) or navy pill (context) |
| **Footage clip** | Raw video with original audio — music ducks during this window |
| **Finale** | Logo reveal, tagline, hashtag — brand colours, slow zoom on team photo |

### Storyboard format

Present as a table:

| Scene | Duration | Photo/Clip | Text Overlay | Motion | Notes |
|-------|----------|------------|--------------|--------|-------|
| 0. Title card | 6s | Whole team photo | EVENT NAME / DATE / CITY | Slow zoom in | Dark overlay 72% opacity |
| 1. Hook | 5s | Best action shot | — | Ken Burns zoom | No text — let image speak |
| 2. ... | | | | | |

**Pacing rules:**
- Total video: 45–75 seconds for LinkedIn. 15–30s for Instagram Reels.
- Photo clips: 2.0–3.0s each (feel fast, not rushed)
- Text overlays: minimum 2s on screen
- Footage clips: trim to the essential moment only — never more than 15s unless the audio is exceptional
- Finale: 8–11s (logo needs time to land)

**Copy rules for overlays:**
- Max 6 words per line, 2 lines per scene
- Sentence case, no ALL CAPS (except the title card hero word)
- No emojis — they render as boxes in Pillow
- Purple pill = primary message. Navy pill with left accent bar = secondary / supporting context.

Present the storyboard and overlay copy to the client. Get approval before Phase 3.

---

## Phase 3 — Build Script

Write a single Python build script at `/tmp/video_build/build.py`.

### Script architecture

```
build.py
├── Constants (W=1920, H=1080, FPS=30, XFADE=0.5)
├── Brand palette (hex → RGB tuples)
├── Font loaders
├── Image helpers (fit, warm_grade)
├── Text rendering (draw_pill, draw_navy_pill_with_bar)
├── Animation helpers (ease_in_out, anim_state)
├── Ken Burns builder (kb_clip)
├── Video clip encoder (video_clip)
├── HEIC conversion
├── Logo loading + background removal
├── Overlay factory functions (one per scene type)
├── Clip build loop (one call per scene)
├── xfade join
├── Audio mix (music + footage audio ducking)
└── Output + stats print
```

### Key implementation patterns

**Text centering (Pillow textbbox fix):**
```python
bbox = draw.textbbox((0, 0), text, font=f)
tw, th, ox, oy = bbox[2]-bbox[0], bbox[3]-bbox[1], bbox[0], bbox[1]
# Correct center accounts for font metric offsets:
tx = cx - (bbox[2]+bbox[0])//2
ty = cy - (bbox[3]+bbox[1])//2
```

**Ken Burns per-frame (2× oversample):**
```python
base = fit(photo_path, W*2, H*2)  # 2× resolution base
for i in range(total_frames):
    t = i / max(total_frames - 1, 1)
    zoom = zoom_start + (zoom_end - zoom_start) * t
    cw, ch = int(W/zoom), int(H/zoom)
    cx = int((W*2-cw)//2 + pan_x*(W*2-cw)*t)
    frame = base.crop((cx, cy, cx+cw, cy+ch)).resize((W, H), Image.LANCZOS)
```

**Text animation (fade-in + slide-up):**
```python
def anim_state(frame_t, fade_in=0.35):
    if frame_t < fade_in:
        progress = t*t*(3-2*t)  # ease in-out
        return progress, 28*(1.0-progress)  # (alpha, slide_y)
    return 1.0, 0.0
```

**Logo compositing (transparent PNG):**
```python
logo_alpha = logo_img.copy()  # RGBA
frame.paste(logo_alpha, (lx, ly), logo_alpha)  # third arg = mask
```

**xfade join:**
```python
# Compute cumulative offsets (subtract XFADE per transition)
# Build filter_complex string: [0:v][1:v]xfade=...offset=N[vx1];[vx1][2:v]xfade=...
```

**Audio ducking (music + footage clip):**
```python
"[1:a]volume=enable='between(t,{start},{end})':volume=0.07,"
"volume=enable='not(between(t,{start},{end}))':volume=0.88[music];"
"[2:a]adelay={int(start*1000)}|{int(start*1000)}[team];"
"[music][team]amix=inputs=2:duration=first[aout]"
```

**Warm colour grade (subtle, applied to all photos):**
```python
img = ImageEnhance.Color(img).enhance(1.15)
img = ImageEnhance.Contrast(img).enhance(1.07)
# Slight red boost, slight blue reduction for warmth
```

### Encode settings

```bash
# Per-clip (from frames):
ffmpeg -framerate 30 -i frames/%05d.jpg -c:v libx264 -preset fast -crf 21 -pix_fmt yuv420p clip.mp4

# Final output:
ffmpeg -c:v copy -c:a aac -b:a 192k -movflags +faststart output.mp4
```

---

## Phase 4 — Build & Verify

Run the build script. The script should print progress per scene and a final summary:

```
🎬  DONE
    /tmp/video_build/output/brand_event_2026.mp4
    62.4s  |  54.2MB  |  1920×1080  |  27 clips
    Team audio: 38.2s-40.8s | Music ducked to 7% during video
```

**Common errors and fixes:**

| Error | Fix |
|-------|-----|
| `drawtext` unavailable | Expected — use Pillow per-frame rendering (default in this skill) |
| HEIC conversion fails | Try `sips -s format jpeg photo.HEIC --out photo.jpg` as fallback |
| SVG logo has white background after qlmanage | Strip with Pillow pixel scan (R,G,B > 230 → alpha=0), then crop to bbox |
| `moov atom not found` on output | Complex filter chain failed mid-encode. Simplify: encode clips separately, then join |
| Text appears off-center | Use `tx = cx - (bbox[2]+bbox[0])//2` not `cx - tw//2` |
| Emojis render as boxes | Remove all emojis from overlay strings — Pillow does not render emoji glyphs |
| Drive file download returns HTML | File is not public. Ask client to download locally |
| Music audio off-sync | Verify `vid_start` offset matches xfade-adjusted timeline position |

After a successful build, copy to `outputs/video/` and to the client's Downloads folder:
```bash
cp /tmp/video_build/output/final.mp4 ~/Downloads/BrandName_VideoTitle_v1.mp4
```

---

## Phase 5 — Review & Iteration

Present the output path and a summary. Offer:

1. **Trim a clip** — adjust `start` / `dur` on any video_clip call
2. **Swap a photo** — replace the source path in any kb_clip call
3. **Change overlay copy** — update the overlay factory function string
4. **Adjust pacing** — change `dur` on any clip (photo clips: 1.5–4.0s range)
5. **Swap music** — provide a new YouTube URL or local file path
6. **Change font size or overlay position** — adjust `y_frac` and font size in the factory function
7. **Rebuild finale only** — delete `clips/s7*.mp4` and re-run; all other clips are cached
8. **Export for Instagram Reels** — re-encode at 1080×1920 with adjusted crop

For iterative rebuilds, delete only the affected clips — all other clips are already encoded and reused. Full rebuild from scratch is only needed if brand colours or fonts change.

---

## Phase 6 — Output Package

Save all deliverables to `outputs/video/`:

```
outputs/video/
├── BrandName_EventTitle_v1.mp4    ← final video
├── build.py                        ← build script (for future iterations)
└── storyboard.md                   ← approved storyboard + overlay copy
```

Provide a post-build summary:

| Item | Value |
|------|-------|
| Duration | 62s |
| Resolution | 1920×1080 |
| File size | 54MB |
| Clips | 27 |
| Music window | Full video |
| Audio ducked | 38s–41s (team video) |
| Platform ready | LinkedIn ✓ |

---

## Notes for Operators

- **Pillow per-frame is the default.** Many macOS ffmpeg builds lack freetype, making `drawtext` unavailable. The per-frame Pillow approach produces identical or better quality and handles animation, font control, and logo compositing that drawtext cannot.
- **Ken Burns needs 2× base images.** Cropping from a same-size base produces blurry output. Always fit photos to 2W × 2H before the crop loop.
- **xfade offset is cumulative, not per-clip.** Each offset = sum of all previous clip durations minus the number of transitions × XFADE_DURATION.
- **Emoji rendering will fail.** Pillow's default font stack does not include emoji glyphs. Remove all emojis from overlay strings — they render as boxes or are skipped.
- **Text centering requires bbox offset correction.** `textbbox` returns a non-zero y0 for most fonts due to ascender metrics. Use `cx - (bbox[2]+bbox[0])//2` not `cx - tw//2`.
- **Logo transparency.** `qlmanage` always bakes a white background. For any logo, strip white pixels with a Pillow pixel scan after conversion. Then crop to the content bounding box.
- **Drive large files.** The Google Drive MCP caps downloads at ~10MB. HEIC photos and MP4 clips routinely exceed this. Ask the client to share a local folder path instead.
- **Audio ducking math.** The `vid_start` used in the audio filter must be the xfade-adjusted timeline position of the video clip, not the raw sum of clip durations.
- **Cache clips between iterations.** Each kb_clip call writes to `clips/[name].mp4`. Re-running the script skips already-encoded clips if you don't delete them. Only delete clips for scenes that actually changed.

---

## Related Skills

- `/brand-onboarding` — Run first if `context/brand-style.md` doesn't exist
- `/social-creative-designer` — For static graphics and carousels alongside the video
- `/caption-writer` — Write the LinkedIn/Instagram caption to post with the video
- `/publisher` — Schedule and publish the final video via Blotato
- `/social-media-manager` — Orchestrates the full content workflow including video
