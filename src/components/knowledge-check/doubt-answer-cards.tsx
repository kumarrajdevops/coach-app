import { RichText } from "@/components/common/rich-text"

interface DoubtAnswerCardsProps {
  items: { doubt: string; answer: string }[]
}

export function DoubtAnswerCards({ items }: DoubtAnswerCardsProps) {
  return (
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border bg-card px-3.5 py-3">
          <p className="mb-1.5 text-sm font-semibold text-primary">{item.doubt}</p>
          <RichText text={item.answer} className="text-sm leading-relaxed text-foreground/90" />
        </div>
      ))}
    </div>
  )
}
