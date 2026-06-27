# Rebrand Plan

This document outlines a focused rebrand for the project. The goal is to make the product feel more memorable and intentional without losing the calm, practical dashboard experience that already works.

## Current Brand Read

The product is currently positioned as **Nexus**, a clean project and task management dashboard.

What works:
- The app feels stable, simple, and useful.
- The interface is easy to scan.
- The dark mode already gives the product a stronger first impression.
- The feature set is clear: projects, tasks, dashboard metrics, Kanban, filters, settings, and demo access.

What feels generic:
- The `Nexus` name is clear, but common.
- The black-and-white `N` logo is polished, but does not say much about the product.
- The mostly zinc/neutral palette makes the app feel like a default admin template.
- The About page explains the product, but the brand voice is still very broad.
- Status and chart colors rely on expected red/yellow/green/blue patterns, which are useful but not distinctive.

## Brand Direction

Recommended direction: **calm command center**.

The product should feel like a focused workspace for planning, tracking, and keeping momentum. It can be a little sharper and more expressive, but it should still feel like a serious productivity tool.

Personality:
- Clear
- Focused
- Precise
- Modern
- Slightly bold
- Not loud

Avoid:
- Gamer neon
- Crypto/Web3 visual language
- Overly playful SaaS illustrations
- Heavy gradients everywhere
- A one-color interface
- Marketing language that overpromises

## Naming Options

### Option A: Keep Nexus

Best if the goal is a portfolio-ready polish pass without renaming the repository, docs, metadata, and product references.

Pros:
- Less implementation work.
- Keeps current continuity.
- Still works with the "central hub" concept.

Cons:
- Common name.
- Harder to make memorable.
- The logo needs to do more identity work.

### Option B: Rename to Gridline

Recommended if this becomes a more serious product concept.

Why it fits:
- It suggests structure, movement, and alignment.
- It maps well to dashboards, boards, tasks, and project systems.
- It can become a visual language: grid, active point, route, progress line.
- It feels distinct without being too dramatic.

Possible tagline:
> Plan work. Track movement. Keep momentum.

### Option C: Rename to Nexa

Best if we want to keep a connection to Nexus but make it shorter and more brandable.

Pros:
- Easier transition from Nexus.
- Shorter and cleaner.
- Works with a sharper visual identity.

Cons:
- More abstract.
- Still needs strong visual support.

## Recommended Choice

Use **Gridline** if we are comfortable with a full product rename.

Use **Nexus** if the priority is a safer rebrand pass for the portfolio.

My recommendation: start the design system work with the **Gridline visual direction**, even if the name stays Nexus temporarily. That lets us improve the look first and decide on the name once the interface has a stronger point of view.

## Visual System

### Palette

Use a dark-first, graphite-based palette with controlled accents.

Core:
- Background: `#0B0D10`
- Chrome: `#101318`
- Surface: `#15181D`
- Surface raised: `#1C2027`
- Border: `#2A2F36`
- Text primary: `#F4F1EA`
- Text muted: `#9AA3AF`

Accents:
- Primary accent: `#20D6B5`
- Secondary accent: `#FFB020`
- Info: `#4C7DFF`
- Critical: `#FF4D5E`
- Success: `#36C275`

Light mode should not become plain white. Use a warm off-white base with graphite text and the same accent system.

### Logo Direction

Replace the current letter-only mark with a simple system mark.

Concept:
- A small grid.
- One active point.
- One connecting line or route.
- Square or slightly rounded container.

The mark should work at:
- Favicon size.
- Sidebar/header size.
- README preview.
- Social preview.

Avoid:
- A literal checklist icon.
- A generic letter inside a square.
- Complex SVG details that disappear at small sizes.

### Typography

Keep the current type stack for now unless we do a larger visual pass.

Optional future direction:
- Use Inter for UI.
- Add a sharper display face only for marketing/About headings if the app gets a dedicated landing page.

Do not introduce decorative typography inside the dashboard UI.

## Product Copy

Current copy is clear but generic.

Recommended voice:
- Short
- Direct
- Useful
- Confident without hype

Possible hero/About copy:
> A focused command center for projects, tasks, and progress.

Possible tagline:
> Plan work. Track movement. Keep momentum.

Possible demo CTA:
> Explore a live workspace

Possible empty-state tone:
> Start with one project. The dashboard will fill in as work moves.

Avoid:
- "Revolutionize your workflow"
- "All-in-one productivity solution"
- "Supercharge your team"
- Anything that feels bigger than the current product.

## Implementation Phases

### Phase 1: Brand Foundation

- [ ] Decide final product name: Nexus, Gridline, or Nexa.
- [ ] Define final tagline.
- [x] Replace `public/logo.svg`.
- [ ] Update favicon and app icons.
- [x] Update `site.webmanifest`.
- [x] Update metadata in `src/app/layout.tsx`.
- [ ] Update README title, description, and preview language.

### Phase 2: Theme Tokens

- [x] Update CSS variables in `src/app/globals.css`.
- [x] Create a stronger dark mode palette.
- [x] Refine light mode so it still feels branded.
- [x] Update chart variables.
- [x] Update status and priority colors.
- [ ] Check contrast for text, badges, buttons, and charts.

### Phase 3: App Chrome

- [x] Update auth layout brand mark.
- [x] Update dashboard header brand mark.
- [x] Update sidebar active states.
- [x] Update demo banner styling so it feels integrated with the new brand.
- [ ] Refine card shadows and borders.
- [ ] Adjust hover/focus states to use the new accent system.

### Phase 4: Key Screens

- [ ] Rework About page with stronger positioning.
- [ ] Polish login/register screens.
- [ ] Update dashboard overview visual hierarchy.
- [ ] Refine project cards.
- [ ] Refine task cards.
- [ ] Refine Kanban columns.
- [ ] Update empty states.

### Phase 5: Brand Assets

- [ ] Generate new `public/preview.png`.
- [ ] Add Open Graph image if needed.
- [ ] Update README screenshot.
- [ ] Check favicon in browser.
- [ ] Check mobile home-screen icon.

### Phase 6: QA

- [ ] Verify light and dark themes.
- [ ] Verify desktop dashboard.
- [ ] Verify mobile navigation.
- [ ] Verify login, register, forgot password, and reset password.
- [ ] Verify demo login flow.
- [ ] Verify demo banner stays visible while scrolling.
- [ ] Run unit tests.
- [ ] Run production build.

## Suggested First PRs

### PR 1: Brand Plan and Naming Decision

Scope:
- Add this rebrand plan.
- Decide final product name.
- Add a short brand direction note to README or docs.

### PR 2: Logo and Metadata

Scope:
- Replace logo.
- Update favicon/site manifest.
- Update app metadata.
- Update header/auth brand references.

### PR 3: Theme Tokens

Scope:
- Update `globals.css` palette.
- Update chart/status/priority colors.
- Verify contrast.

### PR 4: Auth and About Polish

Scope:
- Rework About page copy and layout.
- Polish login/register surfaces.
- Make the demo entry feel intentional.

### PR 5: Dashboard Visual Pass

Scope:
- Refine cards, tables, charts, task cards, project cards, and sidebar states.
- Update preview screenshot.

## Success Criteria

The rebrand is successful if:
- A screenshot feels recognizable as this product, not a default dashboard.
- The UI still feels efficient and calm.
- The brand is visible in the header, logo, colors, copy, and preview image.
- The product does not become visually noisy.
- Both light and dark modes feel intentional.
- The demo flow feels polished enough for portfolio review.

## Initial Recommendation

Start with a conservative visual rebrand:

1. Keep the current app structure.
2. Choose either `Gridline` or keep `Nexus`.
3. Replace the mark.
4. Update the theme tokens.
5. Polish About and Auth.
6. Refresh the dashboard preview.

This gives the product a stronger identity without turning the rebrand into a full rebuild.
