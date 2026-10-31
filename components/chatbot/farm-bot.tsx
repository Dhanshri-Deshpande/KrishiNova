"use client"

import { useState, useEffect, useRef } from "react"
import { useLanguage } from "@/components/language-context"
import { AudioRecorder } from "@/lib/audio-recorder"
import {
  MessageCircle,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Loader2,
  Square,
  Sparkles,
  Globe,
  ChevronDown,
  Check,
} from "lucide-react"

export const BOT_LANGUAGES = [
  { code: "hi", name: "हिन्दी", flag: "🇮🇳", label: "Hindi", locale: "hi-IN" },
  { code: "en", name: "English", flag: "🇬🇧", label: "English", locale: "en-IN" },
  { code: "mr", name: "मराठी", flag: "🇮🇳", label: "Marathi", locale: "mr-IN" },
  { code: "ur", name: "اردو", flag: "🇵🇰", label: "Urdu", locale: "ur-IN" },
  { code: "gu", name: "ગુજરાતી", flag: "🇮🇳", label: "Gujarati", locale: "gu-IN" },
  { code: "pa", name: "ਪੰਜਾਬੀ", flag: "🇮🇳", label: "Punjabi", locale: "pa-IN" },
  { code: "bn", name: "বাংলা", flag: "🇮🇳", label: "Bengali", locale: "bn-IN" },
  { code: "ta", name: "தமிழ்", flag: "🇮🇳", label: "Tamil", locale: "ta-IN" },
  { code: "te", name: "తెలుగు", flag: "🇮🇳", label: "Telugu", locale: "te-IN" },
  { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳", label: "Kannada", locale: "kn-IN" },
]

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function FarmBot() {
  const { language } = useLanguage()
  const [botLanguage, setBotLanguage] = useState<string>(language || "en")
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: getWelcomeMessage(language || "en") },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Speech states
  const [isListening, setIsListening] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(true)
  const [playingMessageIndex, setPlayingMessageIndex] = useState<number | null>(null)
  const [showScrollBottom, setShowScrollBottom] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const recorderRef = useRef<AudioRecorder | null>(null)
  const recognitionRef = useRef<any>(null)
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null)
  const currentAudioUrlRef = useRef<string | null>(null)
  const activeTtsAbortRef = useRef<AbortController | null>(null)
  const langMenuRef = useRef<HTMLDivElement>(null)

  // Synchronize when the global app language changes
  useEffect(() => {
    if (language) {
      setBotLanguage(language)
    }
  }, [language])

  // Update welcome message if language changes and no user messages yet
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === "assistant") {
      setMessages([{ role: "assistant", content: getWelcomeMessage(botLanguage) }])
    }
  }, [botLanguage])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTranscribing])

  // Close language menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Initialize browser fallback recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript))
          setIsListening(false)
        }

        recognition.onerror = () => {
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current = recognition
      }
    }

    return () => {
      stopSpeaking()
      recorderRef.current?.cancel()
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    setShowScrollBottom(false)
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 70
    setShowScrollBottom(!isNearBottom)
  }

  // Fallback to browser SpeechSynthesis
  const fallbackBrowserSpeak = (text: string, index?: number) => {
    if (!speechEnabled || typeof window === "undefined" || !window.speechSynthesis) {
      setIsSpeaking(false)
      setPlayingMessageIndex(null)
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)

    const selectedConfig = BOT_LANGUAGES.find((l) => l.code === botLanguage)
    utterance.lang = selectedConfig?.locale || "en-IN"

    utterance.onstart = () => {
      setIsSpeaking(true)
      if (typeof index === "number") setPlayingMessageIndex(index)
    }
    utterance.onend = () => {
      setIsSpeaking(false)
      setPlayingMessageIndex(null)
    }
    utterance.onerror = () => {
      setIsSpeaking(false)
      setPlayingMessageIndex(null)
    }

    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    if (activeTtsAbortRef.current) {
      activeTtsAbortRef.current.abort()
      activeTtsAbortRef.current = null
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause()
      audioPlayerRef.current.currentTime = 0
      audioPlayerRef.current = null
    }

    if (currentAudioUrlRef.current) {
      URL.revokeObjectURL(currentAudioUrlRef.current)
      currentAudioUrlRef.current = null
    }

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }

    setIsSpeaking(false)
    setPlayingMessageIndex(null)
  }

  // High-fidelity multilingual TTS using Vachana AI
  const speakText = async (text: string, index?: number) => {
    if (!speechEnabled) return

    stopSpeaking()
    setIsSpeaking(true)
    if (typeof index === "number") setPlayingMessageIndex(index)

    const abortController = new AbortController()
    activeTtsAbortRef.current = abortController

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          language: botLanguage,
          voice: "Kalpana",
        }),
        signal: abortController.signal,
      })

      if (!response.ok) {
        throw new Error(`TTS server responded with ${response.status}`)
      }

      const audioBlob = await response.blob()
      if (abortController.signal.aborted) return

      const audioUrl = URL.createObjectURL(audioBlob)
      currentAudioUrlRef.current = audioUrl

      const audio = new Audio(audioUrl)
      audioPlayerRef.current = audio

      audio.onended = () => {
        setIsSpeaking(false)
        setPlayingMessageIndex(null)
        if (currentAudioUrlRef.current) {
          URL.revokeObjectURL(currentAudioUrlRef.current)
          currentAudioUrlRef.current = null
        }
      }

      audio.onerror = () => {
        fallbackBrowserSpeak(text, index)
      }

      await audio.play()
    } catch (err: any) {
      if (err.name === "AbortError") return
      fallbackBrowserSpeak(text, index)
    }
  }

  // High-accuracy Multilingual STT using Vachana AI
  const toggleListen = async () => {
    stopSpeaking()

    if (isListening) {
      setIsListening(false)
      setIsTranscribing(true)

      try {
        if (recorderRef.current) {
          const wavBlob = await recorderRef.current.stop()
          if (wavBlob && wavBlob.size > 100) {
            const formData = new FormData()
            formData.append("audio_file", wavBlob, "voice.wav")
            formData.append("language", botLanguage)

            const response = await fetch("/api/stt", {
              method: "POST",
              body: formData,
            })

            if (response.ok) {
              const data = await response.json()
              if (data.success && data.transcript) {
                setInput((prev) => (prev ? `${prev} ${data.transcript}` : data.transcript))
              }
            }
          }
        }
      } catch (err) {
        console.error("Error stopping recorder or transcribing:", err)
      } finally {
        setIsTranscribing(false)
      }
    } else {
      try {
        if (!recorderRef.current) {
          recorderRef.current = new AudioRecorder()
        }
        await recorderRef.current.start()
        setIsListening(true)
      } catch {
        // Fallback to browser recognition
        if (recognitionRef.current) {
          const selectedConfig = BOT_LANGUAGES.find((l) => l.code === botLanguage)
          recognitionRef.current.lang = selectedConfig?.locale || "en-IN"
          try {
            recognitionRef.current.start()
            setIsListening(true)
          } catch {
            alert("Microphone access unavailable. Please check permissions.")
          }
        } else {
          alert("Microphone access was denied or is not supported in this browser.")
        }
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || isTranscribing) return

    const userMessage = input.trim()
    setInput("")

    const newMessages = [...messages, { role: "user" as const, content: userMessage }]
    setMessages(newMessages)
    setIsLoading(true)
    stopSpeaking()

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          language: botLanguage,
        }),
      })

      if (!response.ok) throw new Error("Failed to fetch")

      const data = await response.json()
      const botReply = data.reply || getFallbackMessage(botLanguage)

      const updated = [...newMessages, { role: "assistant" as const, content: botReply }]
      setMessages(updated)
      speakText(botReply, updated.length - 1)
    } catch {
      const errorMsg = getFallbackMessage(botLanguage)
      const updated = [...newMessages, { role: "assistant" as const, content: errorMsg }]
      setMessages(updated)
      speakText(errorMsg, updated.length - 1)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleChat = () => {
    if (isOpen) {
      stopSpeaking()
      if (isListening) {
        recorderRef.current?.cancel()
        setIsListening(false)
      }
      setIsLangMenuOpen(false)
    }
    setIsOpen(!isOpen)
  }

  const currentLangObj = BOT_LANGUAGES.find((l) => l.code === botLanguage) || BOT_LANGUAGES[0]

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 z-50 cursor-pointer"
        aria-label="Toggle Chatbot"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 w-[320px] sm:w-[350px] max-h-[490px] h-[460px] bg-white dark:bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-fade-in-up">
          {/* Header */}
          <div className="bg-primary p-3 flex justify-between items-center text-white relative">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 flex-shrink-0" />
              <div>
                <h3 className="font-heading font-semibold text-sm sm:text-base leading-tight">KrishiBot</h3>
                <span className="text-[10px] text-white/80 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Multilingual Voice AI
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Language Selector Dropdown Button */}
              <div className="relative" ref={langMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  title="Switch Language / भाषा बदलें"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{currentLangObj.name}</span>
                  <ChevronDown className="w-3 h-3 opacity-80" />
                </button>

                {/* Dropdown Menu */}
                {isLangMenuOpen && (
                  <div className="absolute right-0 top-9 w-44 bg-white dark:bg-popover border border-border rounded-xl shadow-2xl py-1 z-50 text-foreground animate-scale-in max-h-64 overflow-y-auto">
                    <div className="px-2.5 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50">
                      Select Language
                    </div>
                    {BOT_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setBotLanguage(lang.code)
                          setIsLangMenuOpen(false)
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-muted transition-colors cursor-pointer ${
                          botLanguage === lang.code ? "bg-primary/10 text-primary font-semibold" : ""
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                          <span className="text-[10px] text-muted-foreground">({lang.label})</span>
                        </span>
                        {botLanguage === lang.code && <Check className="w-3.5 h-3.5 text-primary" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Stop Playing Voice */}
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors animate-pulse"
                  title="Stop voice playback"
                >
                  <Square className="w-4 h-4 fill-white" />
                </button>
              )}

              {/* Mute/Unmute */}
              <button
                onClick={() => {
                  setSpeechEnabled(!speechEnabled)
                  if (isSpeaking) stopSpeaking()
                }}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                title={speechEnabled ? "Mute Voice" : "Enable Voice"}
              >
                {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-white/60" />}
              </button>

              {/* Close */}
              <button
                onClick={toggleChat}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                title="Close Chatbot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages List with Custom Smooth Scrollbar */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 min-h-0 p-3 overflow-y-auto chat-scrollbar bg-slate-50 dark:bg-background/50 flex flex-col gap-2.5 relative"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`group relative max-w-[88%] p-2.5 px-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground self-end rounded-br-none"
                    : "bg-white dark:bg-card border border-border text-foreground self-start rounded-bl-none"
                }`}
              >
                <div>{msg.content}</div>

                {/* Speaker replay button on assistant messages */}
                {msg.role === "assistant" && (
                  <div className="mt-1 flex items-center justify-end">
                    <button
                      onClick={() => {
                        if (playingMessageIndex === idx) {
                          stopSpeaking()
                        } else {
                          speakText(msg.content, idx)
                        }
                      }}
                      className="p-1 text-muted-foreground hover:text-primary transition-colors rounded-full"
                      title={playingMessageIndex === idx ? "Stop speaking" : "Listen in voice"}
                    >
                      {playingMessageIndex === idx ? (
                        <Square className="w-3.5 h-3.5 fill-primary text-primary animate-pulse" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="bg-white dark:bg-card border border-border text-foreground self-start rounded-2xl rounded-bl-none p-2.5 px-3 shadow-sm max-w-[85%] flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">Thinking...</span>
              </div>
            )}

            {isTranscribing && (
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 self-start rounded-2xl p-2 px-3 shadow-sm text-xs flex items-center gap-2 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>{getTranscribingText(botLanguage)}</span>
              </div>
            )}

            <div ref={messagesEndRef} />

            {/* Floating scroll to bottom button */}
            {showScrollBottom && (
              <button
                type="button"
                onClick={scrollToBottom}
                className="sticky bottom-1 self-center px-2.5 py-1 bg-primary/95 text-white text-xs font-medium rounded-full shadow-lg hover:bg-primary transition-all flex items-center gap-1 cursor-pointer animate-fade-in z-20"
                title="Scroll to latest messages"
              >
                <span>Latest</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Listening status badge */}
          {isListening && (
            <div className="px-3 py-1 bg-red-50 dark:bg-red-950/50 border-t border-red-200 dark:border-red-900 flex items-center justify-between text-xs text-red-600 dark:text-red-400">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                {getListeningText(botLanguage)}
              </span>
              <span className="text-[10px] text-red-500/80">Vachana Voice</span>
            </div>
          )}

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className="p-2.5 bg-white dark:bg-card border-t border-border flex items-center gap-1.5"
          >
            <button
              type="button"
              onClick={toggleListen}
              disabled={isTranscribing}
              className={`p-2.5 rounded-full transition-all cursor-pointer ${
                isListening
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105 animate-pulse"
                  : isTranscribing
                  ? "bg-amber-100 text-amber-600"
                  : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}
              title={isListening ? "Click to stop recording" : "Speak into microphone"}
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : isTranscribing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? getListeningPlaceholder(botLanguage) : getPlaceholder(botLanguage)}
              disabled={isTranscribing}
              className="flex-1 px-3 py-2 bg-muted/50 border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading || isTranscribing}
              className="p-2.5 bg-primary text-white rounded-full disabled:opacity-50 hover:bg-primary/90 transition-colors cursor-pointer"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}

// Multilingual Static Text Helpers
function getWelcomeMessage(lang: string) {
  switch (lang) {
    case "hi":
      return "नमस्ते किसान भाई! मैं आपका कृषिनोवा AI सहायक हूँ। आप मुझसे फसल, खाद, सिंचाई या मौसम के बारे में कुछ भी पूछ सकते हैं।"
    case "mr":
      return "नमस्कार शेतकरी बंधू! मी तुमचा कृषिनोव्हा AI सहाय्यक आहे. आपण मला पीक, खत, पाणी किंवा हवामानाविषयी विचारू शकता."
    case "ur":
      return "ہیلو کسان بھائی! میں کرشی نووا اسسٹنٹ ہوں۔ آپ مجھ سے فصل، کھاد، پانی اور موسم سے متعلق سوالات پوچھ سکتے ہیں۔"
    case "gu":
      return "નમસ્તે ખેડૂત મિત્ર! હું તમારો કૃષિનોવા AI સહાયક છું. તમે મને પાક, ખાતર, સિંચાઈ અથવા હવામાન વિશે પૂછી શકો છો."
    case "pa":
      return "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ! ਮੈਂ ਤੁਹਾਡਾ ਕ੍ਰਿਸ਼ੀਨੋਵਾ AI ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਮੈਨੂੰ ਫ਼ਸਲਾਂ, ਖਾਦਾਂ, ਪਾਣੀ ਜਾਂ ਮੌਸਮ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ।"
    case "bn":
      return "নমস্কার কৃষক ভাই! আমি আপনার কৃশিনোভা সহকারী। ফসল, সার, সেচ বা আবহাওয়া সম্পর্কে যে কোনো প্রশ্ন করুন।"
    case "ta":
      return "வணக்கம் விவசாய நண்பரே! நான் உங்கள் கிருஷிநோவா AI உதவியாளர். பயிர், உரம், பாசனம் அல்லது வானிலை பற்றி கேளுங்கள்."
    case "te":
      return "నమస్కారం రైతు సోదరులారా! నేను మీ కృషినోవా AI సహాయకుడిని. పంటలు, ఎరువులు, నీటి యాజమాన్యం గురించి అడగండి."
    case "kn":
      return "ನಮಸ್ಕಾರ ರೈತ ಮಿತ್ರರೇ! ನಾನು ನಿಮ್ಮ ಕೃಷಿನೋವಾ AI ಸಹಾಯಕ. ಬೆಳೆ, ಗೊಬ್ಬರ, ನೀರಾವರಿ ಅಥವಾ ಹವಾಮಾನದ ಬಗ್ಗೆ ಕೇಳಿ."
    default:
      return "Hello farmer! I am your Krishinova AI assistant. Ask me anything about crops, soil nutrients, water irrigation, or weather."
  }
}

function getPlaceholder(lang: string) {
  switch (lang) {
    case "hi":
      return "अपना सवाल लिखें या माइक दबाकर बोलें..."
    case "mr":
      return "तुमचा प्रश्न लिहा किंवा माइक दाबून बोला..."
    case "ur":
      return "اپنا سوال لکھیں یا بولنے کے لیے مائیک دبائیں..."
    case "gu":
      return "પ્રશ્ન લખો અથવા માઇક દબાવીને બોલો..."
    case "pa":
      return "ਸਵਾਲ ਲਿਖੋ ਜਾਂ ਮਾਈਕ ਦਬਾ ਕੇ ਬੋਲੋ..."
    case "bn":
      return "প্রশ্ন লিখুন বা মাইকে বলুন..."
    case "ta":
      return "கேள்வியை எழுதவும் அல்லது பேசி கேட்கவும்..."
    case "te":
      return "ప్రశ్నను టైప్ చేయండి లేదా మైక్ ద్వారా మాట్లాడండి..."
    case "kn":
      return "ಪ್ರಶ್ನೆ ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮೈಕ್ ಬಳಸಿ ಮಾತನಾಡಿ..."
    default:
      return "Type your question or click mic to speak..."
  }
}

function getListeningPlaceholder(lang: string) {
  switch (lang) {
    case "hi":
      return "सुन रहा हूँ... बोलिए..."
    case "mr":
      return "ऐकत आहे... बोला..."
    case "ur":
      return "سن رہا ہے... بولیں..."
    case "gu":
      return "સાંભળી રહ્યો છું... બોલો..."
    case "pa":
      return "ਸੁਣ ਰਿਹਾ ਹਾਂ... ਬੋਲੋ..."
    case "bn":
      return "শুনছি... বলুন..."
    case "ta":
      return "கேட்கிறேன்... பேசுங்கள்..."
    case "te":
      return "వింటున్నాను... మాట్లాడండి..."
    case "kn":
      return "ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ... ಮಾತನಾಡಿ..."
    default:
      return "Listening... Speak now..."
  }
}

function getListeningText(lang: string) {
  switch (lang) {
    case "hi":
      return "माइक चालू है • समाप्त करने के लिए फिर से क्लिक करें"
    case "mr":
      return "माइक चालू आहे • पूर्ण करण्यासाठी पुन्हा क्लिक करा"
    case "ur":
      return "مائیک آن ہے • مکمل کرنے کے لیے دوبارہ کلک کریں"
    case "gu":
      return "માઇક ચાલુ છે • સમાપ્ત કરવા ફરી ક્લિક કરો"
    case "pa":
      return "ਮਾਈਕ ਚਾਲੂ ਹੈ • ਸਮਾਪਤ ਕਰਨ ਲਈ ਦੁਬਾਰਾ ਕਲਿੱਕ ਕਰੋ"
    case "bn":
      return "মাইক চালু আছে • শেষ করতে আবার ক্লিক করুন"
    case "ta":
      return "மைக் ஆன் • முடிக்க மீண்டும் கிளிக் செய்யவும்"
    case "te":
      return "మైక్ ఆన్ లో ఉంది • పూర్తి చేయడానికి మళ్లీ క్లిక్ చేయండి"
    case "kn":
      return "ಮೈಕ್ ಆನ್ ಆಗಿದೆ • ನಿಲ್ಲಿಸಲು ಮತ್ತೆ ಕ್ಲಿಕ್ ಮಾಡಿ"
    default:
      return "Listening • Click mic to finish"
  }
}

function getTranscribingText(lang: string) {
  switch (lang) {
    case "hi":
      return "वचना AI से आवाज़ पहचान रहा है..."
    case "mr":
      return "वचना AI द्वारे आवाज ओळखत आहे..."
    case "ur":
      return "وچنا AI سے آواز کی شناخت ہو رہی ہے..."
    case "gu":
      return "વચના AI અવાજ ઓળખી રહ્યું છે..."
    case "pa":
      return "ਵਚਨਾ AI ਆਵਾਜ਼ ਪਛਾਣ ਰਿਹਾ ਹੈ..."
    case "bn":
      return "বচনা AI ভয়েস শনাক্ত করছে..."
    case "ta":
      return "வசனா AI குரலை உரையாக மாற்றுகிறது..."
    case "te":
      return "వచనా AI వాయిస్ గుర్తిస్తోంది..."
    case "kn":
      return "ವಚನಾ AI ಧ್ವನಿ ಗುರುತಿಸುತ್ತಿದೆ..."
    default:
      return "Transcribing with Vachana AI..."
  }
}

function getFallbackMessage(lang: string) {
  switch (lang) {
    case "hi":
      return "क्षमा करें, मुझे अभी जुड़ने में समस्या हो रही है। कृपया सुनिश्चित करें कि ओलामा (Ollama) चल रहा है।"
    case "mr":
      return "क्षमस्व, मला आता कनेक्ट होण्यात अडचण येत आहे. कृपया ओलामा चालू असल्याची खात्री करा."
    case "ur":
      return "معذرت، مجھے ابھی جڑنے میں دشواری ہو رہی ہے۔"
    case "gu":
      return "ક્ષમા કરશો, જોડાણમાં સમસ્યા આવી રહી છે."
    case "pa":
      return "ਮਾਫ਼ ਕਰਨਾ, ਕਨੈਕਟ ਕਰਨ ਵਿੱਚ ਸਮੱਸਿਆ ਆ ਰਹੀ ਹੈ।"
    case "bn":
      return "দুঃখিত, সংযোগ করতে সমস্যা হচ্ছে।"
    case "ta":
      return "மன்னிக்கவும், இணைப்பில் சிக்கல் உள்ளது."
    case "te":
      return "క్షమించండి, కనెక్ట్ కావడంలో సమస్య ఉంది."
    case "kn":
      return "ಕ್ಷಮಿಸಿ, ಸಂಪರ್ಕಿಸಲು ಸಮಸ್ಯೆಯಾಗುತ್ತಿದೆ."
    default:
      return "Sorry, I'm having trouble connecting right now. Please ensure Ollama is running locally."
  }
}
