# Sydney Weekend

A small, dependency-free web app that plans a Saturday in Sydney. Pick what you want to do (Food, Outdoors, Drinks or Culture), a budget ($, $$, $$$) and a vibe (Chill, Date Night, With Friends), then hit **Build My Saturday** for a Morning, Lunch, Afternoon and Evening itinerary. **Try another plan** reshuffles the line-up without repeating places you've already seen for those settings.

> **Demo content.** The venues are real Sydney places, but descriptions, prices and tips are illustrative examples, not live data or endorsements. Costs are rough AUD estimates per person.

## Files

| File | What it does |
| --- | --- |
| `index.html` | Page structure, planner form, itinerary section |
| `styles.css` | Design tokens (light + dark), layout, animations, mobile breakpoints |
| `data.js` | The demo venue list (~50 places across four time slots) |
| `app.js` | Matching logic, gradient "photo" scenes, rendering |

No build step, no framework, no npm install. Fonts load from Google Fonts.

## Run locally

```bash
cd sydney-weekend
npx serve .            # or: python3 -m http.server 8080
```

Then open the URL it prints. (Opening `index.html` directly from disk also works.)

## Deploy

It's a static site, so any static host works:

- **Netlify:** drag the `sydney-weekend` folder onto app.netlify.com/drop, or connect the repo and set the base directory to `sydney-weekend` (no build command, publish directory `.`). `netlify.toml` is included.
- **Vercel:** import the repo, set **Root Directory** to `sydney-weekend`, framework preset "Other", no build command. `vercel.json` is included.
- **GitHub Pages:** Settings → Pages → deploy from branch, then point it at this folder (or copy the four files into a `docs/` folder).
- **Cloudflare Pages:** root directory `sydney-weekend`, no build command, output directory `.`.

## Editing the content

Add or change places in `data.js`. Each entry looks like this:

```js
{ id: "l-chatthai", slot: "lunch", name: "Chat Thai", area: "Haymarket",
  desc: "Thai street food institution...", cost: 28, budget: 1,
  types: ["food"], vibes: ["friends", "chill"], scene: "neon",
  tip: "No bookings. The queue moves fast." }
```

- `slot`: `morning` | `lunch` | `afternoon` | `evening`
- `budget`: `1` ($), `2` ($$), `3` ($$$). A plan only uses places at or below the chosen budget.
- `types` / `vibes`: used to score matches against the user's picks.
- `scene`: which gradient "photo" to show. Options live in `SCENES` in `app.js`: `coast`, `harbour`, `garden`, `market`, `cafe`, `gallery`, `dining`, `bar`, `dusk`, `theatre`, `island`, `brewery`, `neon`.

To swap in real photography later, replace the `photo-bg` background in `cardHTML()` with an image URL per venue.
