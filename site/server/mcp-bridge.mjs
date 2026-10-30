#!/usr/bin/env node
/**
 * katana-mcp — a local MCP server for this repo.
 *
 * Exposes the Katana preset catalog and the Glowkit scene builder as MCP tools,
 * so any MCP-compatible agent (Claude Code, Cursor, this workspace) can:
 *
 *   katana_list_presets   list camera presets + credit estimates (no network)
 *   katana_suggest        brief → best preset (deterministic, no model call)
 *   katana_build_scene    preset + copy → a Glowkit Scene object (no network)
 *   katana_estimate       credit budget for a preset / shot list
 *   hf_status             is a Higgsfield API key configured?
 *   hf_list_motions       live motion catalog (falls back to local)
 *   hf_generate           submit an image→video job (dry-run unless confirm:true)
 *
 * The last three delegate to Higgsfield through the official SDK. The first four
 * are pure local logic, so the server is useful with zero credentials and never
 * spends credits unless you explicitly ask it to.
 *
 * Wire it up: see .mcp.json in the repo root.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

import {
  KATANA_PRESETS,
  PRESET_BY_ID,
  presetToScene,
  estimateCredits,
  suggestPreset,
} from './katana-presets.mjs'
import { status, listMotions, generate } from './higgsfield.mjs'

const server = new McpServer({
  name: 'katana-mcp',
  version: '1.0.0',
})

const json = (value) => ({
  content: [{ type: 'text', text: JSON.stringify(value, null, 2) }],
})

/* ------------------------------------------------------------------ */
/* local tools — no network, no credits                                */
/* ------------------------------------------------------------------ */

server.tool(
  'katana_list_presets',
  'List the Katana camera presets: name, camera move, strength, clip length and credit estimate. Use this before proposing a shot.',
  {},
  async () =>
    json({
      count: KATANA_PRESETS.length,
      presets: KATANA_PRESETS.map((p) => ({
        id: p.id,
        name: p.name,
        tagline: p.tagline,
        camera: p.camera,
        strength: p.strength,
        seconds: p.seconds,
        estimatedCredits: estimateCredits(p),
        keywords: p.keywords,
      })),
    }),
)

server.tool(
  'katana_suggest',
  'Given a plain-language brief, pick the best-fitting Katana preset. Deterministic keyword match — no model call, no credits.',
  { brief: z.string().describe('What the shot needs to communicate, in plain words') },
  async ({ brief }) => {
    const p = suggestPreset(brief)
    return json({
      brief,
      preset: { id: p.id, name: p.name, camera: p.camera, strength: p.strength },
      why: `matched on: ${p.keywords.join(', ')}`,
      estimatedCredits: estimateCredits(p),
    })
  },
)

server.tool(
  'katana_build_scene',
  'Turn a Katana preset plus headline copy into a Glowkit scene object that the site can render directly. Returns the exact JSON shape of site/src/scenes.ts.',
  {
    presetId: z.string().describe('id from katana_list_presets'),
    head: z.string().describe('Headline. Keep it to 1–3 words for this style.'),
    sub: z.string().optional().describe('Subline, types on word by word. Keep under ~60 chars.'),
    kicker: z.string().optional().describe('Tiny mono micro-label above the headline'),
  },
  async ({ presetId, head, sub, kicker }) => {
    const preset = PRESET_BY_ID[presetId]
    if (!preset) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Unknown preset "${presetId}". Valid ids: ${KATANA_PRESETS.map((p) => p.id).join(', ')}`,
          },
        ],
      }
    }
    const words = head.trim().split(/\s+/).length
    return json({
      scene: presetToScene(preset, { head, sub, kicker }),
      warnings:
        head.length > 22 || words > 3
          ? ['Headline is long for this style — it holds 1–3 words per beat.']
          : [],
    })
  },
)

server.tool(
  'katana_estimate',
  'Estimate credit cost for a shot list, so a plan can be budgeted before generating anything.',
  {
    shots: z
      .array(
        z.object({
          presetId: z.string(),
          seconds: z.number().optional().describe('Override clip length'),
        }),
      )
      .describe('One entry per clip'),
  },
  async ({ shots }) => {
    const lines = shots.map((s) => {
      const p = PRESET_BY_ID[s.presetId]
      if (!p) return { presetId: s.presetId, error: 'unknown preset' }
      const seconds = s.seconds ?? p.seconds
      return {
        presetId: p.id,
        name: p.name,
        seconds,
        credits: Math.round(seconds * p.creditsPerSec),
      }
    })
    const total = lines.reduce((a, l) => a + (l.credits ?? 0), 0)
    return json({ lines, totalCredits: total, totalSeconds: lines.reduce((a, l) => a + (l.seconds ?? 0), 0) })
  },
)

/* ------------------------------------------------------------------ */
/* Higgsfield-backed tools — guarded                                   */
/* ------------------------------------------------------------------ */

server.tool(
  'hf_status',
  'Report whether a Higgsfield API key is configured, and which credential route is active (API key vs MCP OAuth).',
  {},
  async () => json(status()),
)

server.tool(
  'hf_list_motions',
  'Fetch the live Higgsfield motion/preset catalog. Falls back to the local catalog when no credentials are set or the API is unreachable.',
  {},
  async () => json(await listMotions()),
)

server.tool(
  'hf_generate',
  'Submit an image-to-video job to Higgsfield. BILLS CREDITS. Returns a dry run unless confirm is true, credentials are configured, and an imageUrl is supplied.',
  {
    motionId: z.string().describe('Motion id from hf_list_motions'),
    imageUrl: z.string().optional().describe('Public URL of the source image'),
    prompt: z.string().optional(),
    seconds: z.number().optional(),
    strength: z.number().min(0).max(1).optional(),
    confirm: z
      .boolean()
      .optional()
      .describe('Must be true to actually spend credits. Leave false to preview the request.'),
  },
  async (args) => json(await generate(args)),
)

/* ------------------------------------------------------------------ */

const transport = new StdioServerTransport()
await server.connect(transport)
console.error('katana-mcp ready on stdio')
