import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import type { Plugin, Connect } from 'vite'

/**
 * Higgsfield API bridge.
 *
 * The browser must never call api.higgsfield.ai directly: that would leak the
 * API key and fail CORS. Instead the page calls same-origin /api/hf/*, and this
 * middleware proxies to the SDK running in Node with the key from env.
 *
 * With no key set, every endpoint still answers — in local/dry-run mode — so the
 * whole site works without an account and without spending credits.
 */
function higgsfieldBridge(): Plugin {
  let mod: typeof import('./server/higgsfield.mjs') | null = null
  const load = async () => {
    if (!mod) mod = await import('./server/higgsfield.mjs')
    return mod
  }

  const routes: Record<string, (body: any) => Promise<unknown>> = {
    'status': async () => (await load()).status(),
    'motions': async () => (await load()).listMotions(),
    'generate': async (body) => (await load()).generate(body ?? {}),
  }

  const handler: Connect.NextHandleFunction = (req, res, next) => {
    const url = req.url ?? ''
    if (!url.startsWith('/api/hf/')) return next()

    const name = url.replace('/api/hf/', '').split('?')[0]
    const route = routes[name]
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 'no-store')

    if (!route) {
      res.statusCode = 404
      res.end(JSON.stringify({ error: `unknown endpoint /api/hf/${name}` }))
      return
    }

    let raw = ''
    req.on('data', (c) => (raw += c))
    req.on('end', async () => {
      try {
        const body = raw ? JSON.parse(raw) : {}
        const out = await route(body)
        res.statusCode = 200
        res.end(JSON.stringify(out))
      } catch (err: any) {
        res.statusCode = 500
        res.end(JSON.stringify({ error: err?.message ?? String(err) }))
      }
    })
  }

  return {
    name: 'higgsfield-bridge',
    configureServer(server) {
      server.middlewares.use(handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler)
    },
  }
}

export default defineConfig(({ mode }) => {
  // Load .env into the Node process so server/higgsfield.mjs can read the keys.
  // Empty prefix => no VITE_ requirement, and nothing is exposed to the client:
  // only variables we explicitly pass to the browser bundle would ship.
  const env = loadEnv(mode, process.cwd(), '')
  if (env.HF_API_KEY_ID) process.env.HF_API_KEY_ID = env.HF_API_KEY_ID
  if (env.HF_API_KEY_SECRET) process.env.HF_API_KEY_SECRET = env.HF_API_KEY_SECRET

  return {
  plugins: [react(), higgsfieldBridge()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        lore: 'lore.html',
      },
    },
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    port: 5173,
    strictPort: true,
  },
  preview: { host: '0.0.0.0', allowedHosts: true },
  }
})
