# Higgsfield + Katana — what was installed and how to use it

The reel advertises a stack: **Claude → Higgsfield MCP connector → Katana preset
catalog**. This doc is the working version of that for this repo.

Two *separate* ways to reach Higgsfield exist, and confusing them is the most common
mistake:

| | Hosted MCP | Developer API |
| --- | --- | --- |
| Endpoint | `https://mcp.higgsfield.ai/mcp` | `https://api.higgsfield.ai/<endpoint-id>` |
| Auth | OAuth, **no key** | `HF_API_KEY_ID` + `HF_API_KEY_SECRET` |
| Transport | streamable HTTP | REST / official SDK |
| Used here for | agent tools, inside a chat client | the site's server-side proxy |

Both bill credits. **Unlimited and free generations on higgsfield.ai do not apply
through MCP or the API** — they are metered at standard rates. Any workflow here is
built so you can see the cost before spending it.

---

## What is wired up

```
.mcp.json                                  ← both servers, project scope
.claude/skills/higgsfield-katana/SKILL.md   ← the skill the agent loads
site/
├─ .env.example                            ← the two API keys (empty)
├─ server/
│  ├─ katana-presets.mjs                   ← generated from src (npm run sync:presets)
│  ├─ higgsfield.mjs                       ← official SDK wrapper, key stays server-side
│  └─ mcp-bridge.mjs                       ← katana-mcp, a real stdio MCP server
├─ src/higgsfield/
│  ├─ presets.ts                           ← canonical Katana catalog
│  ├─ client.ts                            ← browser → /api/hf/* (never the API directly)
│  └─ KatanaSection.tsx                    ← UI: pick a preset, stage re-renders
└─ vite.config.ts                          ← /api/hf/* middleware proxy + /api/hf/status
```

### katana-mcp tools

| Tool | Network | Credits | Purpose |
| --- | --- | --- | --- |
| `katana_list_presets` | – | 0 | 8 camera presets with credit estimates |
| `katana_suggest` | – | 0 | brief → best preset, deterministic |
| `katana_build_scene` | – | 0 | preset + copy → Glowkit scene JSON |
| `katana_estimate` | – | 0 | budget a shot list before generating |
| `hf_status` | – | 0 | is a key configured? api vs local mode |
| `hf_list_motions` | ✓ | 0 | live motion catalog, falls back to local |
| `hf_generate` | ✓ | **billed** | image→video, dry-run unless `confirm:true` |

The first five work with **zero credentials**, which is why the site remains fully
usable with no Higgsfield account.

---

## Setup

### Route A — hosted MCP (agent tools, no key)

```bash
# Claude Code
claude mcp add --transport http higgsfield https://mcp.higgsfield.ai/mcp
# then inside Claude Code:
/mcp          # finish the browser sign-in
```

Or use the checked-in `.mcp.json` — it already declares both servers at project scope.
In Claude web/desktop the equivalent is **Customize → Connectors → Add custom connector**
with the same URL. There is no API key to paste; the OAuth window does the work.

Requires an active **paid** Higgsfield plan. On managed Claude plans an admin may need
to allowlist the URL first.

### Route B — developer API (this site's proxy)

```bash
cd site
cp .env.example .env      # fill in HF_API_KEY_ID and HF_API_KEY_SECRET
npm run dev
curl localhost:5173/api/hf/status
# {"configured":true,"mode":"api", ...}
```

The keys are read by `vite.config.ts` via `loadEnv` and set on `process.env`, so they
are only visible to the Node process. Nothing is prefixed `VITE_`, so nothing is
inlined into the browser bundle. Verify:

```bash
npx vite build && grep -r "HF_API_KEY" dist/ ; echo "exit=$?"   # expect: no matches
```

### Local MCP server

```bash
cd site
npm run mcp        # prints "katana-mcp ready on stdio"
```

Smoke test without a client:

```bash
printf '%s\n' \
 '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"t","version":"1"}}}' \
 '{"jsonrpc":"2.0","method":"notifications/initialized"}' \
 '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' \
 '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"katana_suggest","arguments":{"brief":"hook that stops the scroll"}}}' \
 | node server/mcp-bridge.mjs
```

---

## The Katana catalog

Eight presets, each a camera move plus a mapping onto the site's scene engine:

| Preset | Camera | Strength | Clip | Est. credits |
| --- | --- | --- | --- | --- |
| Crash Zoom | zoom 1.0 → 1.9 over 8 frames | 0.85 | 4 s | 8 |
| Bullet Time | 120° orbit, 0.25× time | 0.70 | 6 s | 18 |
| FPV Dive | pitch −70°, FOV 95 → 60 | 0.90 | 8 s | 32 |
| Super Dolly | linear dolly Z+, no ease | 0.60 | 5 s | 15 |
| Whip Pan | yaw 90° in 6 frames | 0.80 | 3 s | 6 |
| Orbit Reveal | 180° ease-out, subject locked | 0.50 | 7 s | 21 |
| Static Push | scale 1.06 → 1.00, no rotation | 0.30 | 5 s | 5 |
| Glitch Cut | 3-frame RGB split, hard cut | 0.75 | 3 s | 6 |

Each preset also sets `motion`, `size`, `ms`, `sparks` and `tone` on the Glowkit
scene, so **picking a preset visibly changes the stage** — that is the "apply it"
half of the install.

---

## Guards against burning credits

1. `hf_generate` returns `{dryRun:true}` unless credentials **and** `imageUrl`
   **and** `confirm:true` are all present.
2. `katana_estimate` must be called before generating; the skill instructs the agent
   to report the total to you first.
3. The site's UI never calls `hf.generate` automatically — there is no generate button
   that fires on load.
4. The API proxy answers in local mode with no key, so a missing `.env` degrades
   instead of failing.

---

## Notes and gotchas found during install

- **The Higgsfield CLI does not install in this sandbox.** `npm i -g @higgsfield/cli`
  downloads a Go binary from GitHub releases and fails with
  `unable to verify the first certificate`. Use the MCP/SDK routes above instead. The
  CLI is only worth having if you want its bundled skills in a terminal agent.
- **`api.higgsfield.ai` is not reachable from this sandbox** (TLS blocked). The code
  path is correct — `hf_list_motions` returns
  `Higgsfield unreachable (…). Serving local catalog.` — but live generation must be
  run somewhere with egress to Higgsfield, and with your own key.
- **URL form matters.** Higgsfield's pages show both `…/mcp` and the bare host. Use
  `https://mcp.higgsfield.ai/mcp`; the short form is rejected by some clients.
- **`katana-presets.mjs` is generated.** Edit `presets.ts`, then `npm run sync:presets`,
  or the MCP server will serve a stale catalog.
- **Free plan limit:** Anthropic caps free accounts at one custom connector, so if you
  already use another remote MCP server, the Higgsfield one competes for that slot.
