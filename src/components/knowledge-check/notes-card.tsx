import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

interface NotesCardProps {
  value: string
  onChange: (value: string) => void
}

export function NotesCard({ value, onChange }: NotesCardProps) {
  return (
    <Card className="gap-2 p-4">
      <label htmlFor="notes-doubts" className="flex items-center gap-1.5 text-sm font-semibold">
        <span className="inline-block size-2 rounded-sm bg-primary" aria-hidden="true" />
        Notes &amp; doubts
      </label>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Jot anything while you read — a concept, a command, "why does X work this way," whatever.
        Saved together with your answer below.
      </p>
      <Textarea
        id="notes-doubts"
        value={value}
        placeholder="Leave blank if none…"
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[220px]"
      />
    </Card>
  )
}
