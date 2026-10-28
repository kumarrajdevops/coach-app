import { useEffect, useState } from "react"

const KEY = "coach_sidebar_collapsed"

export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(KEY) === "1"
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, collapsed ? "1" : "0")
    } catch {
      // ignore — purely a UI preference, fine to not persist
    }
  }, [collapsed])

  return [collapsed, setCollapsed] as const
}
