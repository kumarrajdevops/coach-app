import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SaveStatus as SaveStatusType } from "@/types"

const CONFIG: Record<Exclude<SaveStatusType, "idle">, { label: string; className: string }> = {
  saving: { label: "Saving…", className: "text-muted-foreground" },
  "saved-server": { label: "Saved — awaiting review", className: "text-success" },
  "saved-local": { label: "Saved locally only — live notify failed", className: "text-warning" },
  error: { label: "Save failed", className: "text-destructive" },
}

export function SaveStatus({ status, detail }: { status: SaveStatusType; detail?: string }) {
  if (status === "idle") return null
  const { label, className } = CONFIG[status]

  return (
    <div className={cn("flex items-center gap-1.5 text-xs font-medium", className)} role="status">
      {status === "saving" && <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />}
      {status === "saved-server" && <CheckCircle2 className="size-3.5" aria-hidden="true" />}
      {(status === "saved-local" || status === "error") && (
        <AlertTriangle className="size-3.5" aria-hidden="true" />
      )}
      <span>{detail ?? label}</span>
    </div>
  )
}
