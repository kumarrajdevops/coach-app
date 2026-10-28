import { CheckCircle2, CircleDashed, CircleSlash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Verdict } from "@/types"

const CONFIG: Record<Verdict, { label: string; icon: typeof CheckCircle2; className: string }> = {
  correct: {
    label: "Correct",
    icon: CheckCircle2,
    className: "border-success/30 bg-success/15 text-success",
  },
  partial: {
    label: "Partial credit",
    icon: CircleDashed,
    className: "border-warning/30 bg-warning/15 text-warning",
  },
  incomplete: {
    label: "Needs work",
    icon: CircleSlash,
    className: "border-destructive/30 bg-destructive/15 text-destructive",
  },
}

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const { label, icon: Icon, className } = CONFIG[verdict]
  return (
    <Badge variant="outline" className={cn("gap-1.5 rounded-full px-3 py-1 font-semibold", className)}>
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </Badge>
  )
}
