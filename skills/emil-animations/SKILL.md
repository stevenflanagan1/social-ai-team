---
name: emil-animations
version: 1.0.0
description: Hard rules for Emil Kowalski-style animations and motion design. Asymmetric timing, sub-300ms ceiling, transform+opacity only, spring physics for organic surfaces. Use when building any interactive UI, micro-interaction, or page transition. Mandatory before writing motion code in catalog-app or any landing.
sources:
  - https://github.com/mantrakp04/just-use-convex/blob/master/AGENTS.md
  - https://github.com/championwang00/ui-design-skill/blob/main/SKILL.md
  - https://animations.dev (Emil Kowalski course)
---

# Emil Animations — Motion Discipline

You are a motion engineer. Animation is invisible when correct, distracting when wrong. Every animation answers one question: does this clarify the user's mental model, or does it just feel cute?

If the answer is "feel cute," delete it.

---

## Five Non-Negotiable Rules

1. **Sub-300ms ceiling.** No animation longer than 300ms. If it feels slow, it is slow. Don't argue with perception — re-time it.
2. **Asymmetric timing.** Press is instant, release is leisurely. User input snaps. Output relaxes. Both directions of the same interaction never share duration.
3. **Animate only `transform` and `opacity`.** GPU-rendered. Skips layout and paint. Anything else is a performance bug.
4. **No animation on actions performed 100+ times per day.** Raycast rule. Open palette, switch tab, paste — these never animate. Daniyar's `/start` bot click is in this category.
5. **Every animation respects `prefers-reduced-motion`.** Wrap in `@media (prefers-reduced-motion: no-preference)` or kill the animation entirely. No exceptions.

---

## Duration Buckets

| Interaction | Duration | Notes |
|---|---|---|
| Micro (button press, checkbox tick) | 100–150ms | Sharp. User feels instant feedback. |
| Standard UI (dropdown, tooltip, hover) | 150–250ms | Most common bucket. Default here when in doubt. |
| Modal / Sheet / Dialog | 200–300ms | Larger surfaces need more space to feel intentional. |
| Page / Route transition | 300–400ms | The only case where >300ms is acceptable. Keep at 300ms unless content needs more. |

Anything above 400ms is decoration, not function. Ban it.

---

## Easing Decision Tree

| Scenario | Easing | Why |
|---|---|---|
| Element entering screen | `ease-out` (cubic-bezier(0.16, 1, 0.3, 1)) | Decelerates as it lands. Feels grounded. |
| Element leaving screen | `ease-in` | Accelerates away. User stops paying attention. |
| Element moving within screen | `ease-in-out` | Both ends are slow. Feels controlled. |
| Hover state change | `ease` (default) | Standard browser easing. Don't overthink. |
| Drag, gesture, interruptible | Spring physics | See spring config below. |

Never use `linear` for UI motion. Linear is for loaders and progress bars only.

---

## Spring Physics — When and How

Use spring **only** when motion can be interrupted (drag, swipe, multi-tap). Otherwise use CSS easing.

```ts
// Default Emil Kowalski spring (Framer Motion / motion)
const spring = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
  mass: 1,
};

// Heavier (modal sheet, large surface)
const heavySpring = {
  type: 'spring',
  stiffness: 300,
  damping: 35,
  mass: 1.2,
};

// Snappy (small element, instant feel)
const snapSpring = {
  type: 'spring',
  stiffness: 500,
  damping: 25,
  mass: 0.8,
};
```

Three rules for spring:
- Never expose spring config to a designer's whim — pick one of the three above
- If `damping < stiffness / 20` it overshoots and looks broken
- Spring on regular UI (not gesture) is decoration. Use CSS instead.

---

## Asymmetric Timing — Worked Example

```css
/* WRONG — symmetric */
.button {
  transition: transform 200ms ease;
}
.button:active { transform: scale(0.97); }

/* RIGHT — asymmetric */
.button {
  transition: transform 200ms ease-out;
}
.button:active {
  transform: scale(0.97);
  transition: transform 50ms ease-in;  /* press: snap */
}
/* On release, the longer 200ms ease-out from base kicks in */
```

The press is 50ms (snap). The release is 200ms (relaxed). User feels precision on input, satisfaction on output.

---

## Shadow as Motion Substitute

For raised surfaces (cards, buttons), prefer inset shadow over a hard border:

```css
/* Emil's signature inset shadow */
box-shadow: inset 0 3px 0 0 rgb(0 0 0 / 0.2);

/* On press, remove the inset to flatten */
&:active {
  box-shadow: inset 0 0 0 0 rgb(0 0 0 / 0);
}
```

This gives 3D feel without animating layout. Pure paint property, GPU-friendly.

---

## What to Animate (Whitelist)

| Property | OK? | Notes |
|---|---|---|
| `transform: translate / scale / rotate` | ✅ | Always GPU. |
| `opacity` | ✅ | Always GPU. |
| `filter: blur()` | ⚠️ | OK on small surfaces, not full-screen. |
| `border-radius` | ❌ | Triggers paint. |
| `width / height` | ❌ | Triggers layout. Use `transform: scale` instead. |
| `top / left / right / bottom` | ❌ | Triggers layout. Use `transform: translate`. |
| `box-shadow` | ⚠️ | Paint only. Acceptable for small surfaces. |
| `background-color` | ⚠️ | Paint only. Acceptable for hovers. |

If you must animate width/height, use `clip-path` or `max-height` with a hardcoded ceiling. Never animate `auto` values.

---

## AnimatePresence Pattern (motion/react)

For mount/unmount transitions:

```tsx
import { AnimatePresence, motion } from 'motion/react';

<AnimatePresence mode="wait">
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    />
  )}
</AnimatePresence>
```

Three rules:
- Always specify `exit` — silent removal looks broken
- `scale` from 0.96 (not 0.9) — subtle, not theatrical
- `mode="wait"` for sequential transitions, default for parallel

---

## Page Transitions (Next.js App Router)

Wrap the layout body in a `<motion.div key={pathname}>`. Use 300ms `ease-out` opacity-only fade. Never slide or zoom full pages — it's expensive and disorienting.

---

## What NOT to Animate

- Scroll-triggered animations (parallax, fade-in-on-scroll) — banned. Distracts from content. Use static layout.
- Carousels / sliders — banned. Auto-rotating content is hostile to readers.
- Loading skeletons that pulse — fine, but pulse should be ≤ 1.5s and `opacity` only.
- Theme switch (light → dark) — no transition. Set `transition: none` on `:root` during theme change.
- Long intro animations on landing pages — banned. Use `sessionStorage` to play once, never again.

---

## Acceptance Checklist

Before merging any animation:

- [ ] Duration ≤ 300ms (or ≤ 400ms for full page route)
- [ ] Animates only `transform` and/or `opacity`
- [ ] Asymmetric timing if there's both press and release
- [ ] `prefers-reduced-motion` respected
- [ ] Tested on real device, not just dev tools
- [ ] No `setTimeout` chains for sequencing — use `delay` prop or stagger

---

## Stack Bindings

For `catalog-app/` (Next.js 16 + React 19):
- Library: `motion` (formerly framer-motion) — already part of React 19 ecosystem
- Icons: `lucide-react`
- For pure CSS: write classes in Tailwind v4 with `transition-transform duration-200 ease-out`
- Avoid: `react-spring`, `react-transition-group`, GSAP — overkill for product UI

---

## Source Receipts

| Source | What we took |
|---|---|
| `mantrakp04/just-use-convex/AGENTS.md` | "asymmetric timing", "<300ms ceiling", inset shadow recipe |
| `championwang00/ui-design-skill/SKILL.md` | Duration buckets, easing tree, transform/opacity-only rule, "if it feels slow it is", Raycast 100+ rule |
| Emil Kowalski's animations.dev | Foundational philosophy (motion as clarification, not decoration) |
