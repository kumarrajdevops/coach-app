import { renderInline } from "@/lib/inline-text"

interface DefinitionCardsProps {
  items: { term: string; definition: string }[]
}

export function DefinitionCards({ items }: DefinitionCardsProps) {
  return (
    <div className="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.term} className="rounded-lg border bg-muted/40 px-4 py-3.5">
          <p className="mb-1 text-sm font-semibold text-primary">{item.term}</p>
          <p className="text-[0.88rem] leading-relaxed text-foreground/90">{renderInline(item.definition)}</p>
        </div>
      ))}
    </div>
  )
}
