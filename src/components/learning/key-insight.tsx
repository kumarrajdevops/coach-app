import { Lightbulb } from "lucide-react"
import { renderInline } from "@/lib/inline-text"

export function KeyInsight({ text }: { text: string }) {
  return (
    <div className="my-4 flex gap-3 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3.5">
      <Lightbulb className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
      <div>
        <p className="mb-1 font-mono text-[0.68rem] font-semibold tracking-wider text-warning uppercase">
          Key insight
        </p>
        <p className="text-sm leading-relaxed text-foreground">{renderInline(text)}</p>
      </div>
    </div>
  )
}
