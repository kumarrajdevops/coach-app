import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Mic, Pause, Play, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// The DOM lib doesn't ship types for the (still-prefixed) Web Speech API, so we
// declare just the surface this component touches.
interface SpeechRecognitionResultLike {
  isFinal: boolean
  0: { transcript: string }
}
interface SpeechRecognitionEventLike extends Event {
  resultIndex: number
  results: ArrayLike<SpeechRecognitionResultLike>
}
interface SpeechRecognitionErrorEventLike extends Event {
  error: string
}
interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null
  onend: (() => void) | null
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike

function getRecognitionCtor(): SpeechRecognitionCtor | undefined {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

const RECOGNITION_ERROR_MESSAGES: Record<string, string> = {
  "not-allowed": "Microphone access was denied — allow it in the browser's site settings and try again.",
  "no-speech": "Didn't catch any speech — try again.",
  "audio-capture": "No microphone found.",
  network: "Speech recognition network error — check your connection.",
}

interface VoiceControlsProps {
  question: string
  answer: string
  onAnswerChange: (value: string) => void
}

export function VoiceControls({ question, answer, onAnswerChange }: VoiceControlsProps) {
  const [speechState, setSpeechState] = useState<"idle" | "playing" | "paused">("idle")
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState("")

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  // Kept in sync with the `answer` prop so the recognition callback always
  // appends onto the latest value instead of a stale closure.
  const answerRef = useRef(answer)
  useEffect(() => {
    answerRef.current = answer
  }, [answer])

  const supportsTTS = typeof window !== "undefined" && "speechSynthesis" in window
  const supportsSTT = typeof window !== "undefined" && !!getRecognitionCtor()

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
      if (supportsTTS) window.speechSynthesis.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handlePlay() {
    if (!supportsTTS) return
    if (speechState === "paused") {
      window.speechSynthesis.resume()
      setSpeechState("playing")
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(question)
    utterance.onstart = () => setSpeechState("playing")
    utterance.onend = () => setSpeechState("idle")
    utterance.onerror = () => setSpeechState("idle")
    window.speechSynthesis.speak(utterance)
  }

  function handlePauseResume() {
    if (!supportsTTS) return
    if (speechState === "playing") {
      window.speechSynthesis.pause()
      setSpeechState("paused")
    } else if (speechState === "paused") {
      window.speechSynthesis.resume()
      setSpeechState("playing")
    }
  }

  function handleStop() {
    if (!supportsTTS) return
    window.speechSynthesis.cancel()
    setSpeechState("idle")
  }

  function handleToggleMic() {
    if (!supportsSTT) return
    if (listening) {
      recognitionRef.current?.stop()
      return
    }

    const Ctor = getRecognitionCtor()
    if (!Ctor) return
    const recognition = new Ctor()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event) => {
      let finalChunk = ""
      let interimChunk = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) finalChunk += result[0].transcript
        else interimChunk += result[0].transcript
      }
      if (finalChunk) {
        const next = answerRef.current ? `${answerRef.current} ${finalChunk}`.trim() : finalChunk.trim()
        answerRef.current = next
        onAnswerChange(next)
      }
      setInterim(interimChunk)
    }

    recognition.onerror = (event) => {
      toast.error(RECOGNITION_ERROR_MESSAGES[event.error] ?? `Speech recognition error: ${event.error}`)
    }

    recognition.onend = () => {
      setListening(false)
      setInterim("")
      recognitionRef.current = null
    }

    recognitionRef.current = recognition
    setListening(true)
    recognition.start()
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={!supportsTTS}
            onClick={speechState === "idle" ? handlePlay : handlePauseResume}
            aria-label={speechState === "playing" ? "Pause question audio" : "Read question aloud"}
          >
            {speechState === "playing" ? <Pause /> : <Play />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {supportsTTS
            ? speechState === "playing"
              ? "Pause"
              : speechState === "paused"
                ? "Resume"
                : "Read question aloud"
            : "Text-to-speech isn't supported in this browser"}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={!supportsTTS || speechState === "idle"}
            onClick={handleStop}
            aria-label="Stop question audio"
          >
            <Square />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Stop</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={listening ? "default" : "outline"}
            size="icon-sm"
            disabled={!supportsSTT}
            onClick={handleToggleMic}
            aria-label={listening ? "Stop dictating answer" : "Dictate answer by speaking"}
          >
            <Mic />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {supportsSTT
            ? listening
              ? "Stop dictating"
              : "Speak your answer"
            : "Speech-to-text isn't supported in this browser — use Chrome or Edge"}
        </TooltipContent>
      </Tooltip>

      {listening && (
        <Badge variant="secondary" className="animate-pulse">
          Listening…
        </Badge>
      )}
      {interim && <span className="text-xs text-muted-foreground italic">{interim}</span>}
    </div>
  )
}
