/**
 * Browser-side Higgsfield access.
 *
 * Everything goes to same-origin /api/hf/* and is proxied to the real API by the
 * dev/preview server. No key, no token, no cross-origin call ever reaches the
 * page — so this file is safe to ship to a browser.
 */

export interface HfStatus {
  configured: boolean
  mode: 'api' | 'local'
  mcpEndpoint: string
  mcpTransport: string
  note: string
  billing: string
}

export interface HfMotion {
  id: string
  name: string
  description?: string
  preview_url?: string
}

export interface HfMotions {
  source: 'higgsfield' | 'local'
  motions: HfMotion[]
  warning?: string
}

export interface HfGenerateResult {
  dryRun: boolean
  reason?: string
  plan?: unknown
  job?: unknown
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(path, { headers: { accept: 'application/json' } })
  if (!res.ok) throw new Error(`${path} → ${res.status}`)
  return (await res.json()) as T
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`${path} → ${res.status}`)
  return (await res.json()) as T
}

export const hf = {
  status: () => get<HfStatus>('/api/hf/status'),
  motions: () => get<HfMotions>('/api/hf/motions'),
  generate: (args: {
    motionId: string
    imageUrl?: string
    prompt?: string
    seconds?: number
    strength?: number
    confirm?: boolean
  }) => post<HfGenerateResult>('/api/hf/generate', args),
}
