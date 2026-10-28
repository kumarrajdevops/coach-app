import { Card } from "@/components/ui/card"
import { FeedbackPanel } from "@/components/knowledge-check/feedback-panel"
import { RichText } from "@/components/common/rich-text"
import type { Round } from "@/types"

export function HistoryRound({ round, roundNumber }: { round: Round; roundNumber: number }) {
  return (
    <Card className="gap-3 bg-muted/40 p-4 text-sm">
      <div>
        <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Round {roundNumber} · question
        </p>
        <p className="text-foreground/90">{round.question}</p>
      </div>
      {round.doubts && (
        <div>
          <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Your doubts
          </p>
          <RichText text={round.doubts} className="text-foreground/90" />
        </div>
      )}
      <div>
        <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Your answer
        </p>
        <RichText text={round.answer} className="text-foreground/90" />
      </div>
      <FeedbackPanel round={round} />
    </Card>
  )
}
