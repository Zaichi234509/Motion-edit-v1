# Motion-edit-v1

Teardown + working rebuild of a 95-second vertical "code-based motion graphics" reel.

- **[docs/EFFECT-BREAKDOWN.md](docs/EFFECT-BREAKDOWN.md)** — frame-level analysis: what the
  video actually does, the six effects it repeats, the timing map, and how to apply the same
  system to your own content.
- **`site/`** — a live website that rebuilds the look in DOM + CSS + SVG, with an editable
  scene engine so your own copy renders in the same style.

## Installed integrations

- **[docs/HIGGSFIELD-MCP.md](docs/HIGGSFIELD-MCP.md)** — the Higgsfield + Katana stack:
  hosted MCP connector, developer API proxy, the local `katana-mcp` server, and the
  credit guards.
- `.mcp.json` — wires `higgsfield` (hosted, OAuth) and `katana` (local stdio) MCP servers.
- `.claude/skills/higgsfield-katana/SKILL.md` — the skill that drives the workflow.

```bash
cd site
npm run dev            # site + /api/hf/* proxy
npm run mcp            # local katana-mcp server
npm run sync:presets   # regenerate server/katana-presets.mjs from presets.ts
```

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
5. **Katana** — the installed preset catalog, live status badge, and brief → preset matching.
6. **Stack** — the build order, palette and record-to-MP4 recipe.

## Pages

| Route | What |
| --- | --- |
| `/` | Glowkit — the system, the teardown, the effect library, the playground |
| `/lore.html` | **Sky Above Teyvat** — a nine-beat Genshin lore cut built with the same scene engine |

The lore sample is the "apply it to other content" proof: same primitives, same stage,
recoloured to the seven element accents, with its own scene data in
`site/src/lore/scenes.ts`. It is an unofficial fan sample — original copy, no game
art, every visual CSS/SVG.

Content lives in `site/src/scenes.ts` (and `site/src/lore/scenes.ts` for the sample).
Everything else is renderer.
