# Nexus rebrand -- light shell, keep the best of both

Goal: move the app shell from the dark header/sidebar to a light, airy shell
(Linear/Notion direction) without losing top-level definition or brand presence.
Purely visual. No layout or routing changes.

## Shell
- Header and sidebar: light background (white or slate-50), not black.
- Add definition so the top does not dissolve into the content:
  - Header: bottom hairline border (border-b border-slate-200).
  - Sidebar: right hairline border (border-r border-slate-200).
- Keep the content area on the existing slate-50 tint so cards still read as raised.
- Active nav item: subtle filled state (slate-100/200 background, slate-900 icon),
  not a heavy accent block.

## Logo
- The mark loses presence on a light header. Fix it:
  - Increase the mark slightly and pair it with the "Nexus" wordmark in slate-900,
    medium weight.
  - Keep the mark simple and monochrome so it scales to favicon and mobile.

## Status badges
- Adopt the sober style: status text in slate-700 with a small coloured dot
  (To Do = slate, In Progress = blue, Done = green).
- Remove the filled coloured pill backgrounds.
- Priority: keep the small coloured dot + label (High = red, Medium = amber, Low = green).

## Demo banner
- Drop the yellow background with red text.
- Use a neutral, low-weight bar: slate-100 background, slate-600 text,
  the "Sign up free" link in the brand accent.
- Keep it dismissible if possible.

## Charts
- Keep full colour on the bar and donut charts (data legibility).
- Align the chart palette with the priority/status dot colours so the system feels unified.

## Tokens / consistency
- Centralise colours as Tailwind v4 theme tokens (surface, border, muted-foreground,
  status/priority colours) rather than hard-coded classes, so the shell and badges
  pull from one source.
- Verify AA contrast for muted text on the light surfaces.

## Out of scope
- No new pages, no data model changes, no copy changes beyond the banner.
