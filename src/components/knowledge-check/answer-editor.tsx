import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SaveStatus } from "@/components/common/save-status"
import { FeedbackPanel } from "@/components/knowledge-check/feedback-panel"
import { VoiceControls } from "@/components/knowledge-check/voice-controls"
import type { Round, SaveStatus as SaveStatusType } from "@/types"

interface AnswerEditorProps {
  round: Round
  roundNumber: number
  answer: string
  onAnswerChange: (value: string) => void
  dirty: boolean
  status: SaveStatusType
  errorDetail?: string
  onSave: () => void
  onCancel: () => void
}

export function AnswerEditor({
  round,
  roundNumber,
  answer,
  onAnswerChange,
  dirty,
  status,
  errorDetail,
  onSave,
  onCancel,
}: AnswerEditorProps) {
  return (
    <Card className="gap-5 p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs tracking-wide text-muted-foreground">
          Round {roundNumber}
        </span>
        {round.reviewed && (
          <span className="font-mono text-xs tracking-wide text-muted-foreground">reviewed</span>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold">Knowledge check</p>
        <div className="rounded-lg bg-accent px-3.5 py-3 text-sm font-medium text-accent-foreground">
          {round.question}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor={`answer-${round.id}`} className="text-sm font-semibold">
          Your answer
        </label>
        <VoiceControls question={round.question} answer={answer} onAnswerChange={onAnswerChange} />
        <Textarea
          id={`answer-${round.id}`}
          value={answer}
          placeholder="Type your answer here…"
          onChange={(e) => onAnswerChange(e.target.value)}
          className="min-h-[90px]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={onSave} disabled={status === "saving" || (!dirty && status === "idle")}>
          Save
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={!dirty || status === "saving"}>
          Cancel
        </Button>
        <SaveStatus status={status} detail={errorDetail} />
      </div>

      <FeedbackPanel round={round} />
    </Card>
  )
}
