import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface RequestPathDiagramProps {
  nodes: string[]
  highlight: string[]
}

// Shared across every topic page — authored as a short node list instead of
// bespoke prose/ASCII art each time (e.g. EC2's path vs. a later ALB/ASG path
// just pass a different `nodes` array through this same component).
export function RequestPathDiagram({ nodes, highlight }: RequestPathDiagramProps) {
  return (
    <div className="my-4 flex flex-wrap items-center gap-2 rounded-lg border bg-muted/30 p-4">
      {nodes.map((node, i) => (
        <div key={node} className="flex items-center gap-2">
          <div
            className={cn(
              "rounded-md border px-3 py-1.5 text-center text-[0.8rem] font-medium",
              highlight.includes(node)
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-background text-foreground/80",
            )}
          >
            {node}
          </div>
          {i < nodes.length - 1 && (
            <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  )
}
