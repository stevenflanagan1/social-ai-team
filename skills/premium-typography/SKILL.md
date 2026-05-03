---
name: premium-typography
version: 1.0.0
description: Premium typography, spacing, contrast and layout rules for Jamboat surfaces. Locked palette (#0A0A0A / #C9A84C / Inter Cyrillic), tabular-nums for prices, hairline borders via box-shadow, mask-image fades, no layout shift discipline. Use before any landing, guide, or document destined for client view.
sources:
  - https://github.com/championwang00/ui-design-skill/blob/main/SKILL.md (ui-polish references)
  - https://github.com/ComposioHQ/awesome-claude-skills (premium UI principles)
  - Daniyar's Dark Authority brand spec (catalog-app/src/app/globals.css)
---

# Premium Typography — Dark Authority Discipline

You are a typography engineer for a premium B2B brand. Every glyph, weight, and pixel of spacing carries weight. The product is exclusivity. Cheap typography destroys the price.

If a customer sees the page and thinks "this looks like a SaaS dashboard," we have failed.

---

## Locked Brand Tokens

```css
/* /catalog-app/src/app/globals.css — single source of truth */
:root {
  /* Surfaces */
  --bg:        #0A0A0A;       /* base black */
  --surface:   #121212;       /* one step up — cards, modals */
  --elevated:  #1A1A1A;       /* two steps up — popovers */

  /* Type */
  --fg:        #F5F5F5;       /* body text — never pure white */
  --fg-dim:    #A3A3A3;       /* secondary text */
  --fg-mute:   #6B6B6B;       /* tertiary, captions, meta */

  /* Accent */
  --gold:      #C9A84C;       /* primary CTA, key numbers */
  --gold-soft: #E0C36A;       /* hover state */
  --gold-deep: #A88A38;       /* pressed state */

  /* Strokes (use box-shadow, never border) */
  --hairline:  rgb(255 255 255 / 0.06);
  --line:      rgb(255 255 255 / 0.10);
  --strong:    rgb(255 255 255 / 0.16);
}
```

Three rules for tokens:
- **Never hardcode hex** in components. Always use `var(--gold)`.
- **Pure white `#FFFFFF` is banned** on `#0A0A0A`. Contrast is too sharp, eyes strain. Use `#F5F5F5`.
- **Pure black is the bg** — components above always use one tier lighter.

---

## Typography System

### Family

```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
font-feature-settings: 'cv11', 'ss01', 'tnum'; /* alt 1, smart quotes, tabular nums */
```

Inter with Cyrillic subset. No exceptions. Russian, Kazakh, English — all served by Inter Tight or Inter.

### Scale (modular, not arbitrary)

| Token | Size | Line | Weight | Use |
|---|---|---|---|---|
| `text-display` | 56px / 3.5rem | 1.05 | 600 | Hero only — one per page |
| `text-h1` | 40px / 2.5rem | 1.1 | 600 | Section head |
| `text-h2` | 28px / 1.75rem | 1.2 | 600 | Subsection |
| `text-h3` | 20px / 1.25rem | 1.3 | 600 | Card title |
| `text-body` | 16px / 1rem | 1.6 | 400 | Default body |
| `text-small` | 14px / 0.875rem | 1.5 | 400 | Captions, meta |
| `text-tiny` | 12px / 0.75rem | 1.4 | 500 | Labels, tags |

Three rules for scale:
- **No arbitrary sizes.** If a designer asks for 22px, use 20px or 28px. Don't fragment the scale.
- **Line height inverse to size.** Display = 1.05, body = 1.6. Tight headings, breathable body.
- **Display has weight 600 max.** Never 700 or 800 — looks heavy and cheap on screen.

### Numbers — Always Tabular

```css
.price, .stat, .number {
  font-variant-numeric: tabular-nums;
  /* OR */
  font-feature-settings: 'tnum';
}
```

Why: prices in tables align. `$1,000` and `$5,000` should be the same width. Without tabular-nums, columns shimmer. Mandatory on every price, every metric, every countdown.

---

## No Layout Shift Discipline

This is the difference between premium and amateur.

### Hardcoded dimensions on dynamic elements

```tsx
// WRONG
<button>{isLoading ? 'Loading...' : 'Submit'}</button>

// RIGHT
<button className="min-w-[120px]">
  {isLoading ? 'Loading...' : 'Submit'}
</button>
```

### Don't change font-weight on hover

```css
/* WRONG */
.link:hover { font-weight: 600; }

/* RIGHT */
.link { font-weight: 500; }
.link:hover { color: var(--gold); }
```

Weight change reflows characters. Use color or text-decoration instead.

### Use `text-wrap: balance` for headlines

```css
h1, h2, .hero-title {
  text-wrap: balance;
}
```

Prevents widow lines (one word on the last line). Modern browsers, free win.

### Use `text-wrap: pretty` for body

```css
p, .body-copy {
  text-wrap: pretty;
}
```

Distributes lines more evenly. Subtle but noticeable on wide paragraphs.

---

## Hairlines — Box-shadow, Never Border

Borders cause layout shift on hover and look thick on retina. Use box-shadow:

```css
/* Standard hairline */
.card {
  box-shadow: 0 0 0 1px var(--hairline);
}

/* Retina-precision (0.5px equivalent) */
.card-precise {
  box-shadow: 0 0 0 1px var(--hairline);
  /* OR for true 0.5px: */
  outline: 0.5px solid var(--hairline);
  outline-offset: -0.5px;
}

/* On hover, brighten without shifting layout */
.card:hover {
  box-shadow: 0 0 0 1px var(--line);
}
```

Three rules:
- Never `border: 1px solid` on cards or buttons
- Hover brightens the line, never thickens
- For separator lines between sections, use `box-shadow: 0 -1px 0 0 var(--hairline) inset` on the lower section

---

## Spacing — 4px Base Grid

```
4   8   12   16   24   32   48   64   96   128
```

No 5px, no 14px, no 22px. If the design begs for an off-grid value, the design is wrong.

Tailwind v4 already aligns: `space-1=4`, `space-2=8`, `space-4=16`, etc.

### Vertical rhythm

| Context | Spacing |
|---|---|
| Within paragraph (line-height) | 1.6 |
| Between paragraphs | 16px |
| Between subsections (h3 + content) | 24px |
| Between sections (h2 + content) | 48px |
| Between major sections (h1) | 96px |
| Hero top padding | 128px |

---

## CTA / Button Treatment

Single primary CTA per surface. Gold against black. Everything else is secondary.

```tsx
<button className="
  px-6 py-3
  bg-[var(--gold)]
  text-[var(--bg)]
  font-medium
  rounded-md
  shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.2)]
  hover:bg-[var(--gold-soft)]
  active:bg-[var(--gold-deep)]
  transition-colors duration-200
  tabular-nums
">
  Подписаться — $100/мес
</button>
```

Three rules:
- **Text color on gold = base black.** Not white, not dim. Maximum contrast.
- **Subtle inset highlight** on top edge — 1px white at 0.2 opacity. Reads as "raised."
- **No drop shadow.** Drop shadows on dark surfaces look amateur. Inset only.

---

## Mask-image Fade-out (Premium Touch)

For long lists, gradients, scrollable areas — fade the edge:

```css
.scroll-container {
  mask-image: linear-gradient(
    to bottom,
    black 0%,
    black calc(100% - 64px),
    transparent 100%
  );
}

/* Horizontal version for carousels */
.scroll-x {
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 32px,
    black calc(100% - 32px),
    transparent 100%
  );
}
```

Why: hard cut-off at scroll edge feels cheap. Fade-out signals "more content here." Mandatory on testimonial carousels, pricing tier scrolls, long quotes.

---

## Eased Gradients (No Bands)

Linear gradients have visible bands at low alpha. Use eased gradients:

```css
/* WRONG — visible band */
background: linear-gradient(
  to bottom,
  rgba(0,0,0,0) 0%,
  rgba(0,0,0,0.8) 100%
);

/* RIGHT — eased */
background: linear-gradient(
  to bottom,
  rgba(0,0,0,0) 0%,
  rgba(0,0,0,0.05) 25%,
  rgba(0,0,0,0.2) 50%,
  rgba(0,0,0,0.5) 75%,
  rgba(0,0,0,0.8) 100%
);
```

Use cubic interpolation if the engine supports it. Otherwise hand-eased like above.

---

## Z-index — Fixed Scale + Isolation

Never use random `z-index: 9999`. Define a scale:

```css
:root {
  --z-base:     0;
  --z-raised:   10;   /* cards */
  --z-floating: 100;  /* tooltips, dropdowns */
  --z-modal:    1000; /* dialogs */
  --z-toast:    9000; /* notifications, top of stack */
}
```

For component-local stacking, use `isolation: isolate;` to create a new stacking context. This prevents leaks across the app.

---

## Russian / Cyrillic Specifics

- Russian sentences average 20% longer than English. Headers must accommodate.
- Use `«typographic quotes»` (chevron quotes), not `"straight"`.
- Em-dash `—` for parenthetical breaks, not hyphen `-`.
- Number format: `1 000 000` (non-breaking space), not `1,000,000`.
- Currency: `$1 000` or `1 000 ₸` — currency symbol position depends on language.

```css
/* Force non-breaking spaces in numbers via class */
.ru-number { font-feature-settings: 'tnum'; }
```

---

## Dark Mode Toggle (Future)

The brand IS dark mode. There is no light mode for client-facing surfaces. Internal admin tools may need light mode — handle via CSS variable inversion, never `dark:` Tailwind classes.

```css
:root { --bg: #0A0A0A; --fg: #F5F5F5; }
[data-theme="light"] { --bg: #FAFAFA; --fg: #0A0A0A; }
```

Theme switch must have `transition: none !important;` applied during the swap to prevent intermediate flicker.

---

## Accessibility Floor

| Check | Rule |
|---|---|
| Body text contrast | ≥ 4.5:1 against bg (`#F5F5F5` on `#0A0A0A` = 17:1, passes) |
| Large text contrast | ≥ 3:1 |
| Gold on black | `#C9A84C` on `#0A0A0A` = 8.6:1, passes for body |
| Touch target | ≥ 44px × 44px on mobile (use padding, not absolute size) |
| Focus ring | Always visible. Use `outline: 2px solid var(--gold); outline-offset: 2px;` |
| `aria-label` | Mandatory on all icon-only buttons |

---

## Acceptance Checklist (Pre-Merge)

- [ ] All colors via CSS vars, no hex in components
- [ ] All text uses scale tokens (no arbitrary px values)
- [ ] Numbers and prices use `tabular-nums`
- [ ] Headings use `text-wrap: balance`
- [ ] No `border` declarations — only `box-shadow` for hairlines
- [ ] Spacing uses 4px grid
- [ ] CTA is gold-on-black with inset highlight
- [ ] Long scrollable areas have `mask-image` fade
- [ ] Focus states visible and gold-coloured
- [ ] Tested at 320px (mobile), 768px (tablet), 1440px (desktop)

---

## Source Receipts

| Source | What we took |
|---|---|
| `championwang00/ui-design-skill` (ui-polish module) | tabular-nums, text-wrap balance/pretty, box-shadow over border, hairline 0.5px, mask-image fade, eased gradients, z-index isolation, dark-mode CSS-var inversion |
| `ComposioHQ/awesome-claude-skills` | premium UI principles inspiration |
| Daniyar's `catalog-app/src/app/globals.css` | Brand palette `#0A0A0A` / `#C9A84C`, Inter Cyrillic, Dark Authority spec |
| Inter font docs | Cyrillic subset support, OpenType features (`cv11`, `tnum`, `ss01`) |
