---
name: higgsfield-katana
description: Use when planning, generating or handing off Higgsfield "Katana" motion clips for this project. Covers the local katana-mcp preset catalog, mapping a preset onto a Glowkit scene, estimating credits before generating, and the two credential routes (hosted MCP over OAuth vs the API key + server proxy).
---

# Higgsfield Katana workflow

Katana is a set of **named camera recipes**. You pick a preset instead of writing a
camera prompt. This skill tells you how to use the catalog in this repo without
spending credits by accident.

## Ground truth in this repo

| Thing | Where |
| --- | --- |
| Preset catalog (canonical) | `site/src/higgsfield/presets.ts` |
| Same catalog as ESM for Node | `site/server/katana-presets.mjs` (generated — run `npm run sync:presets`) |
| Local MCP server | `site/server/mcp-bridge.mjs` (`npm run mcp`) |
| Higgsfield SDK wrapper | `site/server/higgsfield.mjs` |
| Server-side proxy | `/api/hf/{status,motions,generate}` via `site/vite.config.ts` |
| Browser client | `site/src/higgsfield/client.ts` |
| MCP wiring | `.mcp.json` (repo root) |

## Tools available through katana-mcp

- `katana_list_presets` — ids, camera moves, credit estimates. **Call this first.**
- `katana_suggest` — brief → best preset (deterministic keyword match, no network).
- `katana_build_scene` — preset + copy → a Glowkit scene object for the site.
- `katana_estimate` — credit budget for a shot list. **Call before any generation.**
- `hf_status` — is an API key configured? local vs api mode.
- `hf_list_motions` — live catalog; falls back to local.
- `hf_generate` — image→video. Bills credits. Dry-run unless `confirm: true`.

## Procedure

1. **Clarify the beat.** One rhetorical job per clip: hook, mechanism, proof, or CTA.
2. **Suggest, then confirm.** `katana_suggest` with the brief, then show the user the
   preset name, camera move and estimated credits before doing anything else.
3. **Budget.** `katana_estimate` across the whole shot list. Report the total.
4. **Build the scene.** `katana_build_scene` — keep headlines to 1–3 words. If the tool
   returns warnings about headline length, shorten it; this style has no room for
   paragraphs.
5. **Only then generate.** `hf_generate` requires all three of: credentials configured,
   a public `imageUrl`, and `confirm: true`. Never set `confirm: true` without explicit
   user approval of the credit cost.

## Rules

- **Never** put an API key in browser code or in `src/`. It lives only in the server
  process env as `HF_API_KEY_ID` / `HF_API_KEY_SECRET`.
- **Never** call `api.higgsfield.ai` from the page. Same-origin `/api/hf/*` only.
- Local presets and scene building cost nothing — prefer them for iteration.
- `katana-presets.mjs` is generated. Edit `presets.ts`, then `npm run sync:presets`.
- Credit note to repeat to the user: MCP and API generations bill at standard rates;
  unlimited plans apply on higgsfield.ai only.

## Verification

```bash
cd site
npm run mcp                      # stdio server, prints "katana-mcp ready"
curl localhost:5173/api/hf/status # {"configured":false,"mode":"local",...}
```
