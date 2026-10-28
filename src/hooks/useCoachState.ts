import { useCallback, useMemo, useState } from "react"
import { postSave, type SaveResult } from "@/lib/api"
import { exportStateToFile, importStateFromFile, loadState, saveState } from "@/lib/storage"
import type { CoachState, Module } from "@/types"

export function useCoachState() {
  const [state, setState] = useState<CoachState>(() => loadState())
  const [activeModuleId, setActiveModuleId] = useState<string>(() => state.modules[0]?.id ?? "")

  const activeModule = useMemo<Module | undefined>(
    () => state.modules.find((m) => m.id === activeModuleId),
    [state.modules, activeModuleId],
  )

  const saveRound = useCallback(
    async (moduleId: string, roundId: string, doubts: string, answer: string): Promise<SaveResult> => {
      let nextState: CoachState | null = null
      setState((prev) => {
        nextState = {
          modules: prev.modules.map((m) =>
            m.id !== moduleId
              ? m
              : {
                  ...m,
                  timeline: m.timeline.map((entry) =>
                    entry.kind !== "round" || entry.round.id !== roundId
                      ? entry
                      : {
                          ...entry,
                          round: {
                            ...entry.round,
                            doubts,
                            answer,
                            savedAt: new Date().toISOString(),
                            reviewed: false,
                          },
                        },
                  ),
                },
          ),
        }
        return nextState
      })
      // state updates are async; nextState is already computed synchronously above
      if (nextState) saveState(nextState)
      const result = await postSave("coach", nextState)
      return result
    },
    [],
  )

  const exportToFile = useCallback(() => {
    exportStateToFile(state)
  }, [state])

  const importFromFile = useCallback(async (file: File) => {
    const imported = await importStateFromFile(file)
    setState(imported)
    saveState(imported)
    if (imported.modules.length > 0) {
      setActiveModuleId(imported.modules[0].id)
    }
  }, [])

  const progress = useMemo(() => {
    const allRounds = state.modules.flatMap((m) =>
      m.timeline.filter((entry) => entry.kind === "round").map((entry) => entry.round),
    )
    const reviewed = allRounds.filter((r) => r.reviewed).length
    const pending = allRounds.filter((r) => !r.reviewed && r.answer.trim().length > 0).length
    const modulesComplete = state.modules.filter((m) => m.complete).length
    return {
      totalModules: state.modules.length,
      modulesComplete,
      totalRounds: allRounds.length,
      reviewed,
      pending,
    }
  }, [state.modules])

  return {
    modules: state.modules,
    activeModule,
    activeModuleId,
    setActiveModuleId,
    saveRound,
    exportToFile,
    importFromFile,
    progress,
  }
}
