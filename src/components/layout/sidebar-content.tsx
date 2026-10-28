import { useMemo, useState } from "react"
import { PanelLeftClose, PanelLeftOpen, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ImportExportControls } from "@/components/common/import-export-controls"
import { ProgressOverview } from "@/components/progress/progress-overview"
import { cn } from "@/lib/utils"
import type { Module } from "@/types"

interface SidebarContentProps {
  modules: Module[]
  activeModuleId: string
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
  /** Compact icon-rail mode — desktop only; the mobile Sheet always renders expanded. */
  collapsed?: boolean
  onToggleCollapsed?: () => void
}

export function SidebarContent({
  modules,
  activeModuleId,
  onSelect,
  progress,
  onExport,
  onImport,
  collapsed = false,
  onToggleCollapsed,
}: SidebarContentProps) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return modules
    return modules.filter((m) => m.title.toLowerCase().includes(q))
  }, [modules, query])

  if (collapsed) {
    return (
      <div className="flex h-full flex-col items-center gap-3 py-4">
        {onToggleCollapsed && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onToggleCollapsed}
                aria-label="Expand sidebar"
              >
                <PanelLeftOpen className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Expand sidebar</TooltipContent>
          </Tooltip>
        )}

        <Separator className="w-8" />

        <nav className="flex min-h-0 flex-1 flex-col items-center gap-2 overflow-y-auto" aria-label="Modules">
          {filtered.map((mod) => {
            const active = mod.id === activeModuleId
            return (
              <Tooltip key={mod.id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => onSelect(mod.id)}
                    aria-current={active ? "page" : undefined}
                    aria-label={mod.title}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg border-l-[3px] border-transparent text-xs font-bold transition-colors",
                      active
                        ? "border-l-primary bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <span
                      className={cn("size-2 rounded-full", mod.complete ? "bg-success" : "bg-warning")}
                      aria-hidden="true"
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {mod.title} — {mod.complete ? "Complete" : "In progress"}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-5 p-4">
      <div className="flex items-start justify-between gap-2 px-1">
        <div>
          <p className="font-mono text-[0.68rem] font-semibold tracking-widest text-primary uppercase">
            Senior DevOps / Cloud Architect
          </p>
          <h1 className="mt-1 text-lg font-bold tracking-tight">Coach Mode</h1>
        </div>
        {onToggleCollapsed && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={onToggleCollapsed}
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Collapse sidebar</TooltipContent>
          </Tooltip>
        )}
      </div>

      <ProgressOverview {...progress} />

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter modules…"
          className="h-8 pl-8 text-sm"
          aria-label="Filter modules"
        />
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto" aria-label="Modules">
        {filtered.map((mod) => {
          const active = mod.id === activeModuleId
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => onSelect(mod.id)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center justify-between gap-2 rounded-lg border-l-[3px] border-transparent px-3 py-2.5 text-left text-sm transition-colors",
                active
                  ? "border-l-primary bg-accent font-semibold text-accent-foreground"
                  : "text-foreground hover:bg-muted",
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    mod.complete ? "bg-success" : "bg-warning",
                  )}
                  aria-hidden="true"
                />
                <span className="truncate">{mod.title}</span>
              </span>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 font-mono text-[0.62rem] font-bold tracking-wide uppercase",
                  mod.complete ? "bg-success/15 text-success" : "bg-warning/15 text-warning",
                )}
              >
                {mod.complete ? "Complete" : "In progress"}
              </span>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">No modules match "{query}".</p>
        )}
      </nav>

      <Separator />
      <ImportExportControls onExport={onExport} onImport={onImport} />
    </div>
  )
}

