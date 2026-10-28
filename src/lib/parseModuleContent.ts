import type { CodeExample, ContentBlock, Module, ReferenceSection, Round, StageKind, TimelineEntry, Verdict } from "@/types"

// Parses the plain-text `.txt` module format into the same typed structures
// every rendering component already consumes. Content authoring stays cheap
// (plain prose + a handful of [TAG] markers); none of the React components
// need to know this format exists.

interface Chunk {
  tag: string
  args: string
  lines: string[]
}

const ROUND_FIELD_KEYS = [
  "QUESTION",
  "DOUBTS",
  "ANSWER",
  "SAVEDAT",
  "REVIEWED",
  "VERDICT",
  "ASSESSMENT",
  "CLARIFICATION",
  "DOUBT_ANSWERS",
] as const

function splitChunks(body: string[]): Chunk[] {
  const chunks: Chunk[] = []
  let current: Chunk | null = null
  const tagLine = /^\[([A-Za-z-]+)(?:\s+(.*))?\]$/

  for (const line of body) {
    const match = tagLine.exec(line.trim())
    if (match) {
      current = { tag: match[1].toUpperCase(), args: match[2] ?? "", lines: [] }
      chunks.push(current)
    } else if (current) {
      current.lines.push(line)
    }
  }
  return chunks
}

function parseAttrs(args: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  const re = /(\w+)=("(?:[^"\\]|\\.)*"|\S+)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(args))) {
    const raw = m[2]
    attrs[m[1]] = raw.startsWith('"') ? raw.slice(1, -1) : raw
  }
  return attrs
}

function nonBlank(lines: string[]): string[] {
  return lines.map((l) => l.trim()).filter((l) => l.length > 0)
}

function joinParagraph(lines: string[]): string {
  return nonBlank(lines).join(" ")
}

function parseRoundFields(lines: string[]): Round {
  const fields: Record<string, string> = {}
  let currentKey: string | null = null
  const prefix = /^([A-Z_]+):\s?(.*)$/

  for (const line of lines) {
    const match = prefix.exec(line)
    if (match && (ROUND_FIELD_KEYS as readonly string[]).includes(match[1])) {
      currentKey = match[1]
      fields[currentKey] = match[2]
    } else if (currentKey) {
      fields[currentKey] = (fields[currentKey] ?? "") + "\n" + line
    }
  }
  for (const key of Object.keys(fields)) fields[key] = fields[key].trim()

  const verdict = fields.VERDICT as Verdict | undefined

  // DOUBT_ANSWERS is structured (one "doubt :: answer" per line), not prose —
  // parsed the same way as a [DEFS] block, into individually-rendered cards.
  const doubtAnswers = fields.DOUBT_ANSWERS
    ? fields.DOUBT_ANSWERS.split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
          const idx = l.indexOf("::")
          return idx === -1 ? { doubt: l, answer: "" } : { doubt: l.slice(0, idx).trim(), answer: l.slice(idx + 2).trim() }
        })
    : undefined

  return {
    id: "",
    question: fields.QUESTION ?? "",
    doubts: fields.DOUBTS ?? "",
    answer: fields.ANSWER ?? "",
    savedAt: fields.SAVEDAT || null,
    reviewed: fields.REVIEWED === "true",
    verdict: verdict === "correct" || verdict === "partial" || verdict === "incomplete" ? verdict : null,
    assessment: fields.ASSESSMENT || null,
    clarification: fields.CLARIFICATION || null,
    doubtAnswers,
  }
}

export function parseModuleContent(raw: string): Module {
  const lines = raw.replace(/\r\n/g, "\n").split("\n")

  let moduleId = ""
  let title = ""
  let coveredOn = ""
  let firstTagIndex = lines.length
  const headerLine = /^(MODULE|TITLE|COVERED):\s*(.*)$/

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim()
    if (trimmed.startsWith("[")) {
      firstTagIndex = i
      break
    }
    const match = headerLine.exec(trimmed)
    if (match) {
      if (match[1] === "MODULE") moduleId = match[2].trim()
      else if (match[1] === "TITLE") title = match[2].trim()
      else if (match[1] === "COVERED") coveredOn = match[2].trim()
    }
  }

  const chunks = splitChunks(lines.slice(firstTagIndex))
  const timeline: TimelineEntry[] = []
  let currentSection: ReferenceSection | null = null
  let lastWasCode = false
  let sectionCount = 0

  for (const chunk of chunks) {
    if (chunk.tag === "STAGE") {
      const stageKind = chunk.args.trim() as StageKind
      const headingLine = chunk.lines.find((l) => l.trim().startsWith("HEADING:"))
      const heading = headingLine ? headingLine.trim().slice("HEADING:".length).trim() : ""
      sectionCount += 1
      // Indexed, not just `${moduleId}-${stageKind}` — a stageKind (e.g. a
      // second "fault-injection") can legitimately repeat within one module.
      currentSection = { id: `${moduleId}-s${sectionCount}-${stageKind}`, heading, stageKind, blocks: [] }
      timeline.push({ kind: "section", section: currentSection })
      lastWasCode = false
      continue
    }

    if (chunk.tag === "ROUND") {
      const round = parseRoundFields(chunk.lines)
      round.id = chunk.args.trim()
      timeline.push({ kind: "round", round })
      currentSection = null
      lastWasCode = false
      continue
    }

    if (!currentSection) continue // stray block tag with no open stage — ignore

    let block: ContentBlock | null = null
    switch (chunk.tag) {
      case "P":
        block = { type: "paragraph", text: joinParagraph(chunk.lines) }
        break
      case "BULLETS":
        block = { type: "bullets", items: nonBlank(chunk.lines) }
        break
      case "NUMBERED":
        block = { type: "numbered", items: nonBlank(chunk.lines) }
        break
      case "NOTE":
        block = { type: "note", text: joinParagraph(chunk.lines) }
        break
      case "TABLE": {
        const rows = nonBlank(chunk.lines).map((l) => l.split("|").map((c) => c.trim()))
        const [headers, ...body] = rows
        block = { type: "table", headers: headers ?? [], rows: body }
        break
      }
      case "DEFS": {
        const items = nonBlank(chunk.lines).map((l) => {
          const idx = l.indexOf("::")
          return idx === -1
            ? { term: l, definition: "" }
            : { term: l.slice(0, idx).trim(), definition: l.slice(idx + 2).trim() }
        })
        block = { type: "definitions", items }
        break
      }
      case "DIAGRAM": {
        const attrs = parseAttrs(chunk.args)
        block = {
          type: "diagram",
          nodes: (attrs.nodes ?? "").split("|").map((s) => s.trim()).filter(Boolean),
          highlight: (attrs.highlight ?? "").split("|").map((s) => s.trim()).filter(Boolean),
        }
        break
      }
      case "IMAGE": {
        const attrs = parseAttrs(chunk.args)
        block = { type: "image", src: attrs.src ?? "", alt: attrs.alt ?? "", caption: attrs.caption }
        break
      }
      case "CODE": {
        const attrs = parseAttrs(chunk.args)
        const example: CodeExample = {
          language: attrs.lang ?? "text",
          caption: attrs.caption,
          code: chunk.lines.join("\n").replace(/^\n+|\n+$/g, ""),
        }
        const lastBlock = currentSection.blocks[currentSection.blocks.length - 1]
        if (lastWasCode && lastBlock?.type === "code") {
          lastBlock.examples.push(example)
        } else {
          block = { type: "code", examples: [example] }
        }
        lastWasCode = true
        break
      }
    }

    if (chunk.tag !== "CODE") lastWasCode = false
    if (block) currentSection.blocks.push(block)
  }

  return { id: moduleId, title, coveredOn, complete: false, timeline }
}
