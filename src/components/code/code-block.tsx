import { useState } from "react"
import { Highlight, themes, type Language } from "prism-react-renderer"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { CodeExample } from "@/types"

// prism-react-renderer doesn't ship an "hcl" grammar, and it has no generic
// "no highlighting" fallback — an unrecognized language used to silently
// fall through to "tsx". That's actively wrong for HCL: a heredoc like
// `<<-EOF` starts with `<`, which the tsx tokenizer tries to parse as JSX,
// and on blocks as large as the hands-on Terraform code that's expensive,
// pathological regex backtracking done synchronously during mount — the
// likely cause of a visible stall/flash switching to and from that page.
// Treating "hcl" as plain text (like "text"/"tree") avoids the wrong
// grammar entirely; it's still perfectly readable monospace.
const SUPPORTED: Record<string, Language> = { yaml: "yaml", bash: "bash", json: "json" }
const PLAIN_LANGUAGES = new Set(["text", "tree", "hcl"])

export function CodeBlock({ language, caption, code }: CodeExample) {
  const [copied, setCopied] = useState(false)
  const isPlain = PLAIN_LANGUAGES.has(language)
  const prismLanguage = SUPPORTED[language] ?? ("tsx" as Language)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // clipboard API unavailable (insecure context, permissions) — the
      // copy button simply won't confirm; no crash, no fake success.
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/60 bg-code shadow-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="font-mono text-xs tracking-wide text-code-foreground/50 uppercase">
          {caption ?? language}
        </span>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="h-7 gap-1.5 px-2 text-code-foreground/70 hover:bg-white/10 hover:text-code-foreground"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          <span className="text-xs">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      {isPlain ? (
        <pre className="overflow-x-auto px-4 py-3.5 text-[0.8rem] leading-[1.65] text-code-foreground">
          {code.trim()}
        </pre>
      ) : (
        <Highlight theme={themes.nightOwl} code={code.trim()} language={prismLanguage}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={cn(className, "overflow-x-auto px-4 py-3.5 text-[0.8rem] leading-[1.65]")}
              style={{ ...style, background: "transparent" }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      )}
    </div>
  )
}
