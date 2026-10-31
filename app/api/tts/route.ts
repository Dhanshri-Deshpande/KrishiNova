import { NextResponse } from "next/server"

const VACHANA_API_KEY =
  process.env.VACHANA_API_KEY ||
  "vach_1ytE2CY5X2OtlnsfUU7svHoNhJtO0JQi3mRqA4m2DF87aee3esafAlOzHiBbCak6A9yuP4bSsjjbgJc3VA9MzmUZFe6dcSW0_f3425cc0e14a9cc99e2ccfb719b89cfa"

// Map of all supported regional languages to Vachana Timbre v3.0 language names
const LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  mr: "Marathi",
  ur: "Urdu",
  gu: "Gujarati",
  pa: "Punjabi",
  bn: "Bengali",
  ta: "Tamil",
  te: "Telugu",
  kn: "Kannada",
  ml: "Malayalam",
  English: "English",
  Hindi: "Hindi",
  Marathi: "Marathi",
  Urdu: "Urdu",
  Gujarati: "Gujarati",
  Punjabi: "Punjabi",
  Bengali: "Bengali",
  Tamil: "Tamil",
  Telugu: "Telugu",
  Kannada: "Kannada",
  Malayalam: "Malayalam",
}

function cleanTextForSpeech(rawText: string): string {
  if (!rawText) return ""
  return rawText
    .replace(/[*_#`~>]/g, "") // remove markdown styling chars
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // clean markdown links
    .replace(/https?:\/\/\S+/g, "") // remove URLs
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "") // strip emojis
    .replace(/\s+/g, " ")
    .trim()
}

export async function POST(req: Request) {
  try {
    const { text, language = "en", voice = "Kalpana" } = await req.json()

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing or invalid 'text' field" }, { status: 400 })
    }

    const cleanedText = cleanTextForSpeech(text)
    if (!cleanedText) {
      return NextResponse.json({ error: "Text is empty after cleaning" }, { status: 400 })
    }

    // Limit text length for responsive audio generation (max 1000 characters)
    const truncatedText = cleanedText.length > 1000 ? cleanedText.slice(0, 1000) + "..." : cleanedText

    const targetLanguage = LANGUAGE_MAP[language] || "English"

    const payload = {
      model: "timbre-v3.0",
      text: truncatedText,
      voice: voice,
      language: targetLanguage,
      audio_config: {
        container: "wav",
      },
    }

    const response = await fetch("https://api.vachana.ai/api/v1/tts/inference", {
      method: "POST",
      headers: {
        "X-API-Key-ID": VACHANA_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Vachana TTS Error:", response.status, errorText)
      return NextResponse.json(
        { error: "Vachana TTS generation failed", details: errorText },
        { status: response.status }
      )
    }

    const audioBuffer = await response.arrayBuffer()

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Length": audioBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (error: any) {
    console.error("TTS Route Error:", error)
    return NextResponse.json(
      { error: "Internal server error in TTS route", message: error?.message },
      { status: 500 }
    )
  }
}
