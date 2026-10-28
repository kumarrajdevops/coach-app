import { AnimatePresence, motion, MotionConfig } from "motion/react"
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
    // reducedMotion="user" makes every animation below respect the OS/browser
    // prefers-reduced-motion setting automatically — no per-component checks.
    <MotionConfig reducedMotion="user">
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
          <AnimatePresence mode="wait">
            {activeModule ? (
              <motion.div
                key={activeModule.id}
                // Opacity-only: animating y/transform here would leave a
                // persistent `transform` on this ancestor, which breaks
                // `position: sticky` on the Notes & doubts panel inside
                // RoundWorkspace (a well-known CSS containing-block quirk).
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
              >
                <ModuleView
                  module={activeModule}
                  onSaveRound={(roundId, doubts, answer) =>
                    saveRound(activeModule.id, roundId, doubts, answer)
                  }
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mx-auto max-w-md py-24 text-center"
              >
                <p className="text-lg font-semibold">No modules loaded</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Import a coach-mode export file from the sidebar to get started.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </AppShell>
        <Toaster position="bottom-right" richColors />
      </TooltipProvider>
    </MotionConfig>
  )
}
