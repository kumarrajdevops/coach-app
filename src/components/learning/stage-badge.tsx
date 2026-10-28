import { BookOpen, Puzzle, Hammer, Search, Lightbulb, Bomb, FlagTriangleRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { StageKind } from "@/types"

const STAGE_META: Record<StageKind, { label: string; icon: typeof BookOpen }> = {
  knowledge: { label: "Knowledge", icon: BookOpen },
  pieces: { label: "Pieces", icon: Puzzle },
  "hands-on": { label: "Hands-on", icon: Hammer },
  troubleshoot: { label: "Troubleshoot", icon: Search },
  "key-insight": { label: "Key insight", icon: Lightbulb },
  "fault-injection": { label: "Fault injection", icon: Bomb },
  conclusion: { label: "Conclusion", icon: FlagTriangleRight },
}

export function StageBadge({ stage }: { stage: StageKind }) {
  const meta = STAGE_META[stage]
  const Icon = meta.icon
  return (
    <Badge variant="outline" data-icon="inline-start" className="font-mono text-[0.68rem] tracking-wide uppercase">
      <Icon className="size-3" aria-hidden="true" />
      {meta.label}
    </Badge>
  )
}
