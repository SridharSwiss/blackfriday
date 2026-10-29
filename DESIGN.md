# Aktion.ch design direction (v6)

Sources studied as patterns, not copied: Slickdeals / mydealz / Dealabs (one price, one action, savings vs. best known price), Idealo (price comparison clarity), Galaxus (whitespace, bold price), Wirecutter (clear verdict). Could not be compared live from the build sandbox.

## Principles
- One obvious price (yellow Swiss "Aktion" tag), one obvious action (red primary shop button, Amazon first), everything else secondary.
- Show savings versus the best known price (`Low 705.70 −22%`), plus a short verdict pill (Buy now / Wait for BF / Tracking).
- Cards never truncate price, name or buttons: min card width 310px; extra shops live behind `+N` (modal lists all sellers).
- Quick category chips on Top 100; filters on the title row; one-screen paging on desktop, natural scroll on mobile.

## Tokens (src/styles.css, `:root`)
- Colour: `--bg --surface --ink --muted --line`, `--red` (actions), `--tag` (price), `--good/--warn/--info/--track` (verdicts), `--save` (savings). Dark values mirrored for `prefers-color-scheme` and `data-theme`.
- Shape: `--r-sm 8 / --r-md 12 / --r-lg 16`. Depth: `--sh-1` (rest), `--sh-2` (hover/modal).
- Type: Archivo (display, condensed), Public Sans (body), JetBrains Mono (labels/numbers).
- Targets: 34px desktop / 42px mobile buttons.
