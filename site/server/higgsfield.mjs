/**
 * Server-side Higgsfield access.
 *
 * The API key lives ONLY here, on the dev/prod server. The browser never sees it
 * and never talks to api.higgsfield.ai directly — it calls /api/hf/* on its own
 * origin and this module proxies through the official SDK.
 *
 * Two credential routes:
 *   1. API  → HF_API_KEY_ID + HF_API_KEY_SECRET   (this module)
 *   2. MCP  → OAuth via https://mcp.higgsfield.ai/mcp  (see .mcp.json)
 * They are separate products. MCP needs no key; the API does.
 */

import { HiggsfieldClient } from '@higgsfield/client'

const KEY_ID = process.env.HF_API_KEY_ID ?? ''
const KEY_SECRET = process.env.HF_API_KEY_SECRET ?? ''

export const hasCredentials = Boolean(KEY_ID && KEY_SECRET)

let client = null

export function getClient() {
  if (!hasCredentials) return null
  if (!client) {
    client = new HiggsfieldClient({ apiKey: KEY_ID, apiSecret: KEY_SECRET })
  }
  return client
}

export function status() {
  return {
    configured: hasCredentials,
    mode: hasCredentials ? 'api' : 'local',
    mcpEndpoint: 'https://mcp.higgsfield.ai/mcp',
    mcpTransport: 'http (streamable)',
    note: hasCredentials
      ? 'API credentials found — remote motion catalog and generation are live.'
      : 'No HF_API_KEY_ID/HF_API_KEY_SECRET. Presets, scene building and the local MCP bridge all work; generation is dry-run only.',
    billing: 'Every MCP or API generation bills credits at standard rates. Unlimited plans apply on higgsfield.ai only.',
  }
}

const FALLBACK_MOTIONS = [
  { id: 'crash-zoom', name: 'Crash Zoom', description: 'local fallback' },
  { id: 'bullet-time', name: 'Bullet Time', description: 'local fallback' },
  { id: 'fpv-dive', name: 'FPV Dive', description: 'local fallback' },
  { id: 'super-dolly', name: 'Super Dolly', description: 'local fallback' },
  { id: 'whip-pan', name: 'Whip Pan', description: 'local fallback' },
  { id: 'orbit-reveal', name: 'Orbit Reveal', description: 'local fallback' },
  { id: 'static-push', name: 'Static Push', description: 'local fallback' },
  { id: 'glitch-cut', name: 'Glitch Cut', description: 'local fallback' },
]

export async function listMotions() {
  const c = getClient()
  if (!c) return { source: 'local', motions: FALLBACK_MOTIONS }
  try {
    const motions = await c.getMotions()
    return { source: 'higgsfield', motions }
  } catch (err) {
    return {
      source: 'local',
      motions: FALLBACK_MOTIONS,
      warning: `Higgsfield unreachable (${(err && err.message) || String(err)}). Serving local catalog.`,
    }
  }
}

/**
 * @typedef {object} GenerateArgs
 * @property {string} motionId
 * @property {string} [imageUrl]
 * @property {string} [prompt]
 * @property {number} [seconds]
 * @property {number} [strength]
 * @property {boolean} [confirm]
 */

/**
 * Submit an image-to-video job. Requires `confirm: true` AND credentials —
 * otherwise it returns a dry run so nobody burns credits by accident while
 * wiring the UI up.
 */
/**
 * @param {GenerateArgs} args
 */
export async function generate(args) {
  const c = getClient()
  const plan = {
    endpoint: '/v1/image2video/dop',
    body: {
      model: 'dop-standard',
      prompt: args.prompt ?? 'cinematic motion, subtle camera push, filmic grade',
      input_images: args.imageUrl ? [{ type: 'image_url', image_url: args.imageUrl }] : [],
      motions: [{ id: args.motionId, strength: args.strength ?? 0.75 }],
      enhance_prompt: true,
    },
  }

  if (!c) {
    return { dryRun: true, reason: 'no-credentials', plan }
  }
  if (!args.confirm) {
    return { dryRun: true, reason: 'not-confirmed', plan }
  }
  if (!args.imageUrl) {
    return { dryRun: true, reason: 'image-url-required', plan }
  }

  const job = await c.generate(plan.endpoint, plan.body, { withPolling: true })
  return { dryRun: false, job: JSON.parse(JSON.stringify(job)) }
}
