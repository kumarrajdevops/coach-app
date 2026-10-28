import { useRef } from "react"
import { Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface ImportExportControlsProps {
  onExport: () => void
  onImport: (file: File) => Promise<void>
}

export function ImportExportControls({ onExport, onImport }: ImportExportControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleExport() {
    onExport()
    toast.success("Exported snapshot")
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    try {
      await onImport(file)
      toast.success("Imported — module data updated")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Import failed")
    }
  }

  return (
    <div className="flex gap-2">
      <Button type="button" variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleExport}>
        <Download className="size-3.5" aria-hidden="true" />
        Export
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="flex-1 gap-1.5"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="size-3.5" aria-hidden="true" />
        Import
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
