import { VerdictBadge } from "@/components/knowledge-check/verdict-badge"
import { RichText } from "@/components/common/rich-text"
import { DoubtAnswerCards } from "@/components/knowledge-check/doubt-answer-cards"
import type { Round } from "@/types"

export function FeedbackPanel({ round }: { round: Round }) {
  if (!round.reviewed || !round.verdict) return null

  return (
    <div className="space-y-3 border-t pt-4">
      <VerdictBadge verdict={round.verdict} />
      <div>
        <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Assessment
        </p>
        {round.assessment && (
          <RichText text={round.assessment} className="text-sm leading-relaxed text-foreground/90" />
        )}
      </div>
      {round.clarification && (
        <div className="rounded-lg border-l-[3px] border-primary bg-muted/60 px-3.5 py-3">
          <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Clarification
          </p>
          <RichText text={round.clarification} className="text-sm leading-relaxed text-foreground/90" />
        </div>
      )}
      {round.doubtAnswers && round.doubtAnswers.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Your doubts, answered one by one
          </p>
          <DoubtAnswerCards items={round.doubtAnswers} />
        </div>
      )}
    </div>
  )
}
