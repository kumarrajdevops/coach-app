import { Card } from "@/components/ui/card"
import { CodeBlock } from "@/components/code/code-block"
import { KeyInsight } from "@/components/learning/key-insight"
import { DefinitionCards } from "@/components/learning/definition-cards"
import { ContentTable } from "@/components/learning/content-table"
import { RequestPathDiagram } from "@/components/learning/request-path-diagram"
import { StageBadge } from "@/components/learning/stage-badge"
import { renderInline } from "@/lib/inline-text"
import type { ContentBlock, ReferenceSection } from "@/types"

function renderBlock(block: ContentBlock, key: number) {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={key} className="mb-2 text-[0.92rem] leading-relaxed text-foreground/90 last:mb-0">
          {renderInline(block.text)}
        </p>
      )
    case "bullets":
      return (
        <ul key={key} className="my-2 list-disc space-y-1.5 pl-5 text-[0.92rem] leading-relaxed text-foreground/90">
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      )
    case "numbered":
      return (
        <ol
          key={key}
          className="my-2 list-decimal space-y-1.5 pl-5 text-[0.92rem] leading-relaxed text-foreground/90"
        >
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ol>
      )
    case "table":
      return <ContentTable key={key} headers={block.headers} rows={block.rows} />
    case "note":
      return <KeyInsight key={key} text={block.text} />
    case "blockquote":
      return (
        <blockquote
          key={key}
          className="my-3 border-l-[3px] border-muted-foreground/30 pl-4 text-[0.92rem] text-foreground/80 italic"
        >
          {renderInline(block.text)}
          {block.attribution && (
            <footer className="mt-1 text-xs font-medium text-muted-foreground not-italic">
              — {block.attribution}
            </footer>
          )}
        </blockquote>
      )
    case "definitions":
      return <DefinitionCards key={key} items={block.items} />
    case "code":
      return (
        <div key={key} className="my-3 space-y-3">
          {block.examples.map((example, i) => (
            <CodeBlock key={i} {...example} />
          ))}
        </div>
      )
    case "diagram":
      return <RequestPathDiagram key={key} nodes={block.nodes} highlight={block.highlight} />
    case "image":
      return (
        <figure key={key} className="my-4">
          <img
            src={block.src}
            alt={block.alt}
            className="w-full rounded-lg border"
          />
          {block.caption && (
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">{block.caption}</figcaption>
          )}
        </figure>
      )
  }
}

export function SectionCard({ section }: { section: ReferenceSection }) {
  return (
    <Card className="gap-3 p-5">
      <div className="flex flex-wrap items-center gap-2.5">
        <StageBadge stage={section.stageKind} />
      </div>
      <h3 className="mb-1 text-base font-bold text-foreground text-balance">{section.heading}</h3>
      <div>{section.blocks.map((block, i) => renderBlock(block, i))}</div>
    </Card>
  )
}
