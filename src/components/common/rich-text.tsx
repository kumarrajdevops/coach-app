import { Fragment } from "react"
import { CodeBlock } from "@/components/code/code-block"
import { renderInline } from "@/lib/inline-text"

type Block = { type: "text"; content: string } | { type: "code"; language: string; content: string }

function parseBlocks(text: string): Block[] {
  const blocks: Block[] = []
  const fence = /```(\w*)\n?([\s\S]*?)```/g
  let lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = fence.exec(text))) {
    if (m.index > lastIndex) blocks.push({ type: "text", content: text.slice(lastIndex, m.index) })
    blocks.push({ type: "code", language: m[1] || "hcl", content: m[2].replace(/\n$/, "") })
    lastIndex = fence.lastIndex
  }
  if (lastIndex < text.length) blocks.push({ type: "text", content: text.slice(lastIndex) })
  return blocks
}

// Renders assessment/clarification text: paragraphs with bold/inline-code
// formatting via renderInline, plus fenced code blocks through the real
// CodeBlock component. Not a general markdown parser, just the subset this
// content actually uses.
export function RichText({ text, className }: { text: string; className?: string }) {
  const blocks = parseBlocks(text)
  return (
    <div className={className}>
      {blocks.map((b, i) => {
        if (b.type === "code") {
          return (
            <div key={i} className="my-2.5">
              <CodeBlock language={b.language} code={b.content} />
            </div>
          )
        }
        const paragraphs = b.content
          .split(/\n{2,}/)
          .map((p) => p.trim())
          .filter(Boolean)
        return paragraphs.map((p, j) => (
          <p key={`${i}-${j}`} className="mb-2 last:mb-0">
            {p.split("\n").map((line, k, arr) => (
              <Fragment key={k}>
                {renderInline(line)}
                {k < arr.length - 1 && <br />}
              </Fragment>
            ))}
          </p>
        ))
      })}
    </div>
  )
}
