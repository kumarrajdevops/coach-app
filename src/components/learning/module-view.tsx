import { CheckCircle2 } from "lucide-react"
import { useLayoutEffect } from "react"
import { SectionCard } from "@/components/learning/section-card"
import { RoundWorkspace } from "@/components/learning/round-workspace"
import { HistoryRound } from "@/components/knowledge-check/history-round"
import type { Module } from "@/types"

interface ModuleViewProps {
  module: Module
  onSaveRound: (
    roundId: string,
    doubts: string,
    answer: string,
  ) => Promise<{ ok: boolean; error?: string }>
}

export function ModuleView({ module, onSaveRound }: ModuleViewProps) {
  // Walk the timeline in order; stop right after the first unreviewed round —
  // everything past that point (e.g. a later fault-injection stage) stays
  // hidden until this one is reviewed, so the page is a real guided
  // walkthrough instead of every stage dumped on screen at once.
  const activeRoundIndex = module.timeline.findIndex(
    (entry) => entry.kind === "round" && !entry.round.reviewed,
  )
  const visible =
    activeRoundIndex === -1 ? module.timeline : module.timeline.slice(0, activeRoundIndex + 1)

  let roundNumber = 0

  // Runs once per module switch (this component remounts via the `key` its
  // parent gives it) — restores whatever scroll position app-shell.tsx last
  // saved for this specific module, instead of always starting at the top.
  useLayoutEffect(() => {
    const main = document.querySelector("main")
    if (!main) return
    try {
      const saved = sessionStorage.getItem(`coach_scroll_${module.id}`)
      main.scrollTop = saved ? Number(saved) : 0
    } catch {
      main.scrollTop = 0
    }
  }, [module.id])

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-balance">{module.title}</h1>
        <span className="font-mono text-xs text-muted-foreground">covered {module.coveredOn}</span>
      </div>

      {visible.map((entry, i) => {
        if (entry.kind === "section") {
          return <SectionCard key={entry.section.id} section={entry.section} />
        }

        roundNumber += 1
        const isActive = i === activeRoundIndex
        return isActive ? (
          <RoundWorkspace
            key={entry.round.id}
            round={entry.round}
            roundNumber={roundNumber}
            onSave={(doubts, answer) => onSaveRound(entry.round.id, doubts, answer)}
          />
        ) : (
          <HistoryRound key={entry.round.id} round={entry.round} roundNumber={roundNumber} />
        )
      })}

      {module.complete && (
        <div className="flex items-center gap-2 rounded-xl bg-success/15 px-4 py-3.5 text-sm font-semibold text-success">
          <CheckCircle2 className="size-4" aria-hidden="true" />
          Module complete — no open doubts
        </div>
      )}
    </div>
  )
}
