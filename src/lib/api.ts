// Retains the original local notify server's API contract exactly:
//   POST http://127.0.0.1:8765/save/coach
//   POST http://127.0.0.1:8765/save/cheatsheet
// The server binds 127.0.0.1-only (see save_server.py) and is never reached
// over the network. CORS on the server already allows cross-origin POSTs
// (Access-Control-Allow-Origin: *), so calling it from the Vite dev origin
// (a different port than the old file:// / :8888 pages) works unchanged.
const SAVE_BASE = "http://127.0.0.1:8765"
const REQUEST_TIMEOUT_MS = 4000

export type SaveTarget = "coach" | "cheatsheet"

export interface SaveResult {
  ok: boolean
  error?: string
}

/**
 * POSTs to the local save server. Resolves ok:false (never throws) on any
 * network failure, non-2xx response, or timeout — callers must not report a
 * successful server save unless this resolves ok:true.
 */
export async function postSave(target: SaveTarget, data: unknown): Promise<SaveResult> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const res = await fetch(`${SAVE_BASE}/save/${target}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    })
    if (!res.ok) {
      return { ok: false, error: `Server responded ${res.status}` }
    }
    return { ok: true }
  } catch (err) {
    const message =
      err instanceof DOMException && err.name === "AbortError"
        ? "Save server timed out — is save_server.py running?"
        : "Couldn't reach the save server — is save_server.py running?"
    return { ok: false, error: message }
  } finally {
    clearTimeout(timeout)
  }
}
