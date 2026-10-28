import { AppShell } from "@/components/layout/app-shell"
import { ModuleView } from "@/components/learning/module-view"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useCoachState } from "@/hooks/useCoachState"

export default function App() {
  const {
    modules,
    activeModule,
    activeModuleId,
    setActiveModuleId,
    saveRound,
    exportToFile,
    importFromFile,
    progress,
  } = useCoachState()

  return (
    <TooltipProvider delayDuration={200}>
      <AppShell
        modules={modules}
        activeModuleId={activeModuleId}
        activeModuleTitle={activeModule?.title}
        onSelect={setActiveModuleId}
        progress={progress}
        onExport={exportToFile}
        onImport={importFromFile}
      >
        {activeModule ? (
          <ModuleView
            key={activeModule.id}
            module={activeModule}
            onSaveRound={(roundId, doubts, answer) =>
              saveRound(activeModule.id, roundId, doubts, answer)
            }
          />
        ) : (
          <div className="mx-auto max-w-md py-24 text-center">
            <p className="text-lg font-semibold">No modules loaded</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Import a coach-mode export file from the sidebar to get started.
            </p>
          </div>
        )}
      </AppShell>
      <Toaster position="bottom-right" richColors />
    </TooltipProvider>
  )
}
