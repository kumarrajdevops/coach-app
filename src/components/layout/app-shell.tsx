import type { ReactNode } from "react"
import { PageHeader } from "@/components/layout/page-header"
import { SidebarContent } from "@/components/layout/sidebar-content"
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed"
import { cn } from "@/lib/utils"
import type { Module } from "@/types"

interface AppShellProps {
  modules: Module[]
  activeModuleId: string
  activeModuleTitle: string | undefined
  onSelect: (id: string) => void
  progress: {
    modulesComplete: number
    totalModules: number
    reviewed: number
    totalRounds: number
    pending: number
  }
  onExport: () => void
  onImport: (file: File) => Promise<void>
  children: ReactNode
}

export function AppShell({
  modules,
  activeModuleId,
  activeModuleTitle,
  onSelect,
  progress,
  onExport,
  onImport,
  children,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useSidebarCollapsed()
  const sidebarProps = { modules, activeModuleId, onSelect, progress, onExport, onImport }

  return (
    // h-svh (not min-h-svh) caps this shell to exactly the viewport height,
    // so <main>'s overflow-y-auto is the thing that actually scrolls — if the
    // shell could grow taller than the viewport, the window would scroll
    // instead and position:sticky inside <main> would never engage (sticky
    // anchors to its nearest *actually scrolling* ancestor).
    <div className="flex h-svh overflow-hidden bg-background">
      <aside
        className={cn(
          "hidden shrink-0 border-r bg-sidebar transition-[width] duration-200 md:block",
          collapsed ? "w-16" : "w-72",
        )}
      >
        <SidebarContent
          {...sidebarProps}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((c) => !c)}
        />
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <PageHeader moduleTitle={activeModuleTitle} {...sidebarProps} />
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 md:py-10">{children}</main>
      </div>
    </div>
  )
}
