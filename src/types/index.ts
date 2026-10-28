export type Verdict = "correct" | "partial" | "incomplete"

export interface Round {
  id: string
  doubts: string
  question: string
  answer: string
  savedAt: string | null
  reviewed: boolean
  verdict: Verdict | null
  assessment: string | null
  clarification: string | null
  /** Doubt-by-doubt answers, each rendered as its own card — for rounds with many separate questions in the notes. */
  doubtAnswers?: { doubt: string; answer: string }[]
}

export interface CodeExample {
  language: string
  /** Short label shown above the block, e.g. a filename or "directory layout". */
  caption?: string
  code: string
}

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "numbered"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  /** Callout box (rendered via the existing KeyInsight component). */
  | { type: "note"; text: string }
  | { type: "blockquote"; text: string; attribution?: string }
  /** Glossary-style term cards, e.g. a section introducing several pieces at once. */
  | { type: "definitions"; items: { term: string; definition: string }[] }
  /** One or more full, line-commented examples (files, command output, tree diagrams). */
  | { type: "code"; examples: CodeExample[] }
  /** Shared request-path style diagram — an ordered row of labeled boxes with some emphasized. */
  | { type: "diagram"; nodes: string[]; highlight: string[] }
  /** A real static image (e.g. a generated architecture diagram), served from /public. */
  | { type: "image"; src: string; alt: string; caption?: string }

/** The 9-step pattern every topic page follows; drives a shared badge on each section's card. */
export type StageKind =
  | "knowledge"
  | "pieces"
  | "hands-on"
  | "troubleshoot"
  | "key-insight"
  | "fault-injection"
  | "conclusion"

export interface ReferenceSection {
  id: string
  heading: string
  stageKind: StageKind
  blocks: ContentBlock[]
}

/** One entry in a module's linear walkthrough — content and rounds genuinely interleaved. */
export type TimelineEntry =
  | { kind: "section"; section: ReferenceSection }
  | { kind: "round"; round: Round }

export interface Module {
  id: string
  title: string
  coveredOn: string
  complete: boolean
  timeline: TimelineEntry[]
}

export interface CoachState {
  modules: Module[]
}

export type SaveStatus = "idle" | "saving" | "saved-server" | "saved-local" | "error"
