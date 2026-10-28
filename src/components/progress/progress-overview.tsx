import { Progress } from "@/components/ui/progress"

interface ProgressOverviewProps {
  modulesComplete: number
  totalModules: number
  reviewed: number
  totalRounds: number
  pending: number
}

export function ProgressOverview({
  modulesComplete,
  totalModules,
  reviewed,
  totalRounds,
  pending,
}: ProgressOverviewProps) {
  const pct = totalRounds > 0 ? Math.round((reviewed / totalRounds) * 100) : 0

  return (
    <div className="space-y-2.5 rounded-xl border bg-sidebar-accent/40 px-3.5 py-3">
      <div className="flex items-center justify-between font-mono text-[0.72rem] text-muted-foreground">
        <span>
          {modulesComplete}/{totalModules} modules
        </span>
        <span>{reviewed}/{totalRounds} reviewed</span>
      </div>
      <Progress value={pct} className="h-1.5" />
      {pending > 0 && (
        <p className="text-[0.72rem] text-warning">
          {pending} answer{pending === 1 ? "" : "s"} awaiting review
        </p>
      )}
    </div>
  )
}
