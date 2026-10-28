import { useState } from "react"
import { NotesCard } from "@/components/knowledge-check/notes-card"
import { AnswerEditor } from "@/components/knowledge-check/answer-editor"
import type { Round, SaveStatus as SaveStatusType } from "@/types"

interface RoundWorkspaceProps {
  round: Round
  roundNumber: number
  onSave: (doubts: string, answer: string) => Promise<{ ok: boolean; error?: string }>
}

export function RoundWorkspace({ round, roundNumber, onSave }: RoundWorkspaceProps) {
  const [doubts, setDoubts] = useState(round.doubts)
  const [answer, setAnswer] = useState(round.answer)
  const [status, setStatus] = useState<SaveStatusType>("idle")
  const [errorDetail, setErrorDetail] = useState<string | undefined>(undefined)

  const dirty = doubts !== round.doubts || answer !== round.answer

  async function handleSave() {
    setStatus("saving")
    setErrorDetail(undefined)
    const result = await onSave(doubts, answer)
    if (result.ok) {
      setStatus("saved-server")
    } else {
      setStatus("saved-local")
      setErrorDetail(result.error ? `Saved locally only — ${result.error}` : undefined)
    }
  }

  function handleCancel() {
    setDoubts(round.doubts)
    setAnswer(round.answer)
    setStatus("idle")
  }

  return (
    <div className="space-y-3">
      <NotesCard value={doubts} onChange={setDoubts} />
      <AnswerEditor
        round={round}
        roundNumber={roundNumber}
        answer={answer}
        onAnswerChange={setAnswer}
        dirty={dirty}
        status={status}
        errorDetail={errorDetail}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  )
}
