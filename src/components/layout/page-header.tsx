import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { SidebarContent } from "@/components/layout/sidebar-content"
import type { Module } from "@/types"

interface PageHeaderProps {
  moduleTitle: string | undefined
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
}

export function PageHeader({ moduleTitle, ...sidebarProps }: PageHeaderProps) {
  return (
    <header className="flex items-center gap-3 border-b bg-card/60 px-4 py-3 backdrop-blur md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button type="button" variant="ghost" size="icon" aria-label="Open module navigation">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SheetTitle className="sr-only">Module navigation</SheetTitle>
          <SidebarContent {...sidebarProps} />
        </SheetContent>
      </Sheet>
      <nav aria-label="Breadcrumb" className="min-w-0 text-sm">
        <ol className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
          <li>Coach Mode</li>
          {moduleTitle && (
            <>
              <li aria-hidden="true">/</li>
              <li className="truncate font-medium text-foreground">{moduleTitle}</li>
            </>
          )}
        </ol>
      </nav>
    </header>
  )
}
