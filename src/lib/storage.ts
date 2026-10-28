import { seedModules } from "@/data/modules"
import type { CoachState } from "@/types"

// Same key name the original standalone coach-mode.html used, kept for
// conceptual continuity. Note: localStorage is origin-scoped, so data saved
// while using the old file:// / http://localhost:8888 page is NOT readable
// here — this Vite app runs on its own dev-server origin. The actual content
// (modules, rounds, reviewed answers, feedback) was migrated by hand into
// src/data/modules.ts instead, so nothing already covered is lost; this
// local-storage key only persists what you do from this app onward.
const LOCAL_KEY = "coach_mode_state_v2"

export function loadState(): CoachState {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as CoachState
      if (parsed && Array.isArray(parsed.modules) && parsed.modules.length > 0) {
        return parsed
      }
    }
  } catch {
    // fall through to seed
  }
  return { modules: seedModules }
}

export function saveState(state: CoachState): void {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state))
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — the server
    // POST (when it succeeds) is still the durable copy.
  }
}

export function exportStateToFile(state: CoachState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `coach-mode-export-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function importStateFromFile(file: File): Promise<CoachState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as CoachState
        if (!parsed || !Array.isArray(parsed.modules)) {
          reject(new Error("File doesn't look like a coach-mode export (missing modules array)."))
          return
        }
        resolve(parsed)
      } catch {
        reject(new Error("That file isn't valid JSON."))
      }
    }
    reader.onerror = () => reject(new Error("Couldn't read that file."))
    reader.readAsText(file)
  })
}
