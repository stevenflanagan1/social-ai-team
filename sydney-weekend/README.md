# Sydney Weekend

A small, dependency-free web app that plans a Saturday in Sydney. Pick what you want to do (Food, Outdoors, Drinks or Culture), a budget ($, $$, $$$) and a vibe (Chill, Date Night, With Friends), then hit **Build My Saturday** for a Morning, Lunch, Afternoon and Evening itinerary. **Try another plan** reshuffles the line-up without repeating places you've already seen for those settings.

> **Example site.** Every business in `data.js` (cafés, bars, restaurants, tour operators) is fictional, with a generated logo. Public places such as beaches, walks, parks and ferries are real. Booking, app-download and venue-listing flows are front-end only: they show confirmation screens but send nothing anywhere.

### Interactive bits (all work offline)

- **Build My Saturday** shows a short loading state, then renders the plan and a toast
- **Try another plan** reshuffles all four stops
- Per card: **Save** (heart), **Swap** (replaces just that stop), **Book/Details** (opens a booking sheet with time and guest pickers, then a confirmation with a reference code)
- **Copy plan** copies a text version to the clipboard
- **Neighbourhood tiles** preset the planner and build a plan in that suburb's spirit
- **Get the app** and **List your venue** open forms with success screens
- The phone mockup in the app section mirrors the current plan

## Files

| File | What it does |
| --- | --- |
| `index.html` | Page structure, planner form, itinerary section |
| `styles.css` | Design tokens (light + dark), layout, animations, mobile breakpoints |
| `data.js` | Venue list (62 places across four time slots) |
| `app.js` | Matching logic, generated logos, gradient "photo" scenes, booking/app/partner sheets, toasts |

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
- `icon` (optional): `wave`, `leaf`, `ferry`, `sun`, `city` or `sails` for public places. Shows a pictogram instead of a generated brand logo.
- `scene`: which gradient "photo" to show. Options live in `SCENES` in `app.js`: `coast`, `harbour`, `garden`, `market`, `cafe`, `gallery`, `dining`, `bar`, `dusk`, `theatre`, `island`, `brewery`, `neon`.

To swap in real photography later, replace the `photo-bg` background in `cardHTML()` with an image URL per venue.
