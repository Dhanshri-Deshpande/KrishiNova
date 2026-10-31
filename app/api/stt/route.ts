import { NextResponse } from "next/server"

const VACHANA_API_KEY =
  process.env.VACHANA_API_KEY ||
  "vach_1ytE2CY5X2OtlnsfUU7svHoNhJtO0JQi3mRqA4m2DF87aee3esafAlOzHiBbCak6A9yuP4bSsjjbgJc3VA9MzmUZFe6dcSW0_f3425cc0e14a9cc99e2ccfb719b89cfa"

// Map internal language codes to supported Vachana STT locales:
// Supported by Prisma v2.5: as-IN, bn-IN, en-IN, gu-IN, hi-IN, indic-auto, kn-IN, ml-IN, mr-IN, pa-IN, ta-IN, te-IN
const LANGUAGE_CODE_MAP: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
  ur: "hi-IN", // Urdu uses the Hindustani acoustic space in Vachana ASR
  gu: "gu-IN",
  pa: "pa-IN",
  bn: "bn-IN",
  ta: "ta-IN",
  te: "te-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  as: "as-IN",
  auto: "indic-auto",
  "en-IN": "en-IN",
  "hi-IN": "hi-IN",
  "mr-IN": "mr-IN",
  "ur-IN": "hi-IN",
  "gu-IN": "gu-IN",
  "pa-IN": "pa-IN",
  "bn-IN": "bn-IN",
  "ta-IN": "ta-IN",
  "te-IN": "te-IN",
  "kn-IN": "kn-IN",
  "ml-IN": "ml-IN",
  "as-IN": "as-IN",
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || ""

    let audioBlob: Blob | null = null
    let rawLang = "en"

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      const file =
        (formData.get("audio_file") as Blob | null) ||
        (formData.get("audio") as Blob | null) ||
        (formData.get("file") as Blob | null)
      const lang = (formData.get("language") as string | null) || (formData.get("language_code") as string | null)

      if (file) {
        audioBlob = file
      }
      if (lang) {
        rawLang = lang
      }
    } else if (contentType.includes("application/json")) {
      const body = await req.json()
      const { audioBase64, language = "en" } = body
      if (audioBase64) {
        const base64Data = audioBase64.replace(/^data:audio\/\w+;base64,/, "")
        const buffer = Buffer.from(base64Data, "base64")
        audioBlob = new Blob([buffer], { type: "audio/wav" })
      }
      rawLang = language
    } else {
      // Raw binary stream
      const arrayBuffer = await req.arrayBuffer()
      if (arrayBuffer.byteLength > 0) {
        audioBlob = new Blob([arrayBuffer], { type: "audio/wav" })
      }
      const url = new URL(req.url)
      const langParam = url.searchParams.get("language") || url.searchParams.get("language_code")
      if (langParam) {
        rawLang = langParam
      }
    }

    if (!audioBlob || audioBlob.size === 0) {
      return NextResponse.json({ error: "No audio file or data provided" }, { status: 400 })
    }

    const languageCode = LANGUAGE_CODE_MAP[rawLang] || "en-IN"

    // Prepare FormData for Vachana STT API
    const vachanaFormData = new FormData()
    vachanaFormData.append("audio_file", audioBlob, "audio.wav")
    vachanaFormData.append("language_code", languageCode)

    if (languageCode === "indic-auto") {
      vachanaFormData.append("multi_lang_codes", "hi-IN,en-IN,mr-IN,gu-IN,pa-IN,bn-IN,ta-IN,te-IN,kn-IN")
    }

    const response = await fetch("https://api.vachana.ai/stt/v3", {
      method: "POST",
      headers: {
        "X-API-Key-ID": VACHANA_API_KEY,
      },
      body: vachanaFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Vachana STT Error:", response.status, errorText)
      return NextResponse.json(
        { error: "Vachana STT transcription failed", details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    let transcript = ""

    if (typeof data.transcript === "string") {
      transcript = data.transcript
    } else if (typeof data.transcript === "object" && data.transcript !== null) {
      // If multi-lang detection was used, find the detected language's transcript
      for (const val of Object.values(data.transcript)) {
        if (typeof val === "string" && val.trim().length > 0) {
          transcript = val
          break
        }
      }
    }

    if (!transcript && data.output?.literal) {
      transcript = typeof data.output.literal === "string" ? data.output.literal : ""
    }

    return NextResponse.json({
      success: true,
      transcript: transcript.trim(),
      details: {
        model: data.model,
        processing_time: data.processing_time,
      },
    })
  } catch (error: any) {
    console.error("STT Route Error:", error)
    return NextResponse.json(
      { error: "Internal server error in STT route", message: error?.message },
      { status: 500 }
    )
  }
}
