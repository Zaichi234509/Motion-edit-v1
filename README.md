# Motion-edit-v1

Teardown + working rebuild of a 95-second vertical "code-based motion graphics" reel.

- **[docs/EFFECT-BREAKDOWN.md](docs/EFFECT-BREAKDOWN.md)** — frame-level analysis: what the
  video actually does, the six effects it repeats, the timing map, and how to apply the same
  system to your own content.
- **`site/`** — a live website that rebuilds the look in DOM + CSS + SVG, with an editable
  scene engine so your own copy renders in the same style.

## Run it

```bash
cd site
npm install
npm run dev      # http://localhost:5173
```

## Sections of the site

1. **Player** — a 9:16 stage that plays the rebuilt reel (hook bar, neon canvas, device chrome,
   dock, keyboard) through six scenes.
2. **Breakdown** — the shot-by-shot beat map of the reference video.
3. **Effects** — nine live primitives with copy-paste CSS.
4. **Playground** — type your own hook / headline / subline, toggle layers, copy the scene JSON.
5. **Stack** — the build order, palette and record-to-MP4 recipe.

Content lives in `site/src/scenes.ts`. Everything else is renderer.
