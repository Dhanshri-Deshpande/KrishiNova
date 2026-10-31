import { NextResponse } from "next/server"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""

const languageNames: Record<string, string> = {
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
}

const PREFERRED_MODELS = [
  "qwen2.5:3b",
  "qwen2.5:7b",
  "llama3.2:3b",
  "llama3.1:8b",
  "qwen:latest",
]

async function getBestInstalledOllamaModel(): Promise<string> {
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434"
  try {
    const res = await fetch(`${ollamaBaseUrl.replace(/\/$/, "")}/api/tags`, {
      signal: AbortSignal.timeout(1500),
    })
    if (res.ok) {
      const data = await res.json()
      const installed: string[] = (data.models || []).map((m: any) => m.name)
      for (const pref of PREFERRED_MODELS) {
        if (installed.includes(pref) || installed.some((m) => m.startsWith(pref))) {
          return pref
        }
      }
      if (installed.length > 0) {
        return installed[0]
      }
    }
  } catch (_) {}
  return "qwen2.5:3b"
}

function buildSystemPrompt(targetLang: string): string {
  return `You are KrishiBot, an expert Senior Agricultural Scientist and Practical Agronomist on the Krishinova platform.

CORE OPERATIONAL RULES:

1. TARGET LANGUAGE:
Always respond fully, naturally, and fluently in ${targetLang}. Never switch to another language unless explicitly requested.

2. SPELLING MISTAKES HANDLING (TYPOS ONLY):
• If the user's message contains simple typos, spelling mistakes, phonetic spelling, speech-to-text slips, or transliteration errors (for example: "tometo" for tomato, "fertlizr" for fertilizer, "irigashun" for irrigation, "पिलिपति" / "पदो" in Hindi/Marathi, etc.):
• DO NOT point out, mention, or lecture about the spelling mistake.
• Silently understand the intended meaning and provide the DIRECT, helpful agricultural answer immediately.

3. SEMANTIC & CONCEPTUAL MISTAKES HANDLING:
• A semantic mistake happens when the question contains an agricultural misconception, contradiction, scientifically false premise, or harmful practice (for example: asking to spray Urea/fertilizer to kill fungus/pests, using salt water for irrigation, spraying herbicides on crops during flowering, using kerosene/diesel on leaves, sowing rainy Kharif crops in freezing dry winter, etc.).
• When a semantic or conceptual mistake is detected:
  a. FIRST, politely clarify and explain why that concept or action is incorrect or dangerous (e.g., "Caution/Note: Urea is a nitrogen fertilizer that promotes vegetative leaf growth, not a fungicide; spraying urea on fungal infections can actually worsen the disease.").
  b. THEN, provide the correct, safe, and scientifically recommended agricultural solution (e.g., recommend appropriate fungicides like Mancozeb or neem oil with proper dosage).

4. PRACTICAL FARMING STRUCTURE:
When answering crop health or management questions:
• Provide Cause / Diagnosis.
• Provide Organic / Natural remedy (e.g., Neem oil, Trichoderma, FYM).
• Provide Chemical solution with exact name and dosage (e.g., NPK 19:19:19 @ 5g/L, Mancozeb @ 2g/L).
• Provide irrigation and prevention tips.`
}

// Call Google Gemini API (if key is configured)
async function callGemini(messages: any[], targetLang: string): Promise<string | null> {
  if (!GEMINI_API_KEY) return null

  try {
    const systemInstruction = buildSystemPrompt(targetLang)

    const contents = messages
      .filter((m: any) => m.role === "user" || m.role === "assistant")
      .map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }))

    const payload = {
      system_instruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: contents,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 800,
      },
    }

    // Try primary gemini-2.5-flash, fallback to gemini-1.5-flash
    for (const model of ["gemini-2.5-flash", "gemini-1.5-flash"]) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(6000),
        })

        if (res.ok) {
          const data = await res.json()
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text
          if (text && text.trim().length > 0) {
            return text.trim()
          }
        }
      } catch (_) {}
    }
  } catch (err: any) {
    console.warn("Gemini API call error:", err.message)
  }
  return null
}

// Detect repetitive hallucination loops or gibberish from small 3B models
function isLowQualityOrHallucination(text: string): boolean {
  if (!text || text.length < 15) return true

  // Check for repetitive hallucination loops (common in small local models)
  const words = text.split(/\s+/)
  if (words.length > 15) {
    const phrases = new Map<string, number>()
    for (let i = 0; i < words.length - 2; i++) {
      const p = `${words[i]} ${words[i + 1]} ${words[i + 2]}`
      const count = (phrases.get(p) || 0) + 1
      phrases.set(p, count)
      if (count >= 3) {
        return true // Repetitive loop detected!
      }
    }
  }

  // Catch known small-model hallucinations in Indic languages
  if (
    text.includes("चिकाल") ||
    text.includes("जीवाश्मांचे") ||
    text.includes("समुद्र में सबसे बड़ा यंत्र")
  ) {
    return true
  }

  return false
}

// Multilingual knowledge fallback with spelling tolerance and semantic checking
function getAgriFallbackReply(query: string, lang: string): string {
  const q = query.toLowerCase()

  // SEMANTIC CHECK 1: Using Urea/Fertilizer to kill fungus/pests
  const hasFertilizer = q.includes("urea") || q.includes("यूरिया") || q.includes("fertilizer") || q.includes("खाद") || q.includes("खत")
  const hasKillDisease = q.includes("kill fungus") || q.includes("फंगस मार") || q.includes("कीट मार") || q.includes("disease kill") || q.includes("कीड मार")
  if (hasFertilizer && hasKillDisease) {
    switch (lang) {
      case "hi":
        return "⚠️ **महत्वपूर्ण स्पष्टीकरण (Semantic Correction):**\nयूरिया या खाद पौधों के पोषण और वृद्धि के लिए होती है, यह फंगस (उल्ली) या कीट मारने की दवा नहीं है। फफूंद पर यूरिया डालने से रोग और बढ़ सकता है!\n\n✅ **सही समाधान:**\n• फफूंद (Fungus) के लिए: मैंकोजेब (Mancozeb) 2 ग्राम/लीटर या साफ (Saaf) 2 ग्राम/लीटर पानी में घोलकर छिड़कें।\n• कीटों के लिए: नीम का तेल 5 मिली/लीटर पानी में मिलाकर छिड़कें।"
      case "mr":
        return "⚠️ **महत्त्वाचा खुलासा (Semantic Correction):**\nयुरिया किंवा खत हे पिकांच्या वाढीसाठी असते, ते बुरशी किंवा कीड मारण्याचे औषध नाही. बुरशीवर युरिया टाकल्यास रोग जास्त वाढू शकतो!\n\n✅ **योग्य उपाय:**\n• बुरशीसाठी (Fungus): मॅन्कोझेब २ ग्रॅम/लिटर किंवा कॉपर ऑक्सिक्लोराईड २.५ ग्रॅम/लिटर फवारावे.\n• किडींसाठी: निंबोळी अर्क ५ मिली/लिटर वापरावे."
      default:
        return "⚠️ **Important Clarification (Semantic Correction):**\nUrea is a nitrogen fertilizer used for vegetative growth, NOT a fungicide or pesticide. Spraying urea on fungal infections will actually accelerate fungal spread!\n\n✅ **Correct Solution:**\n• For Fungus: Spray Mancozeb 75% WP @ 2g/L or Carbendazim @ 1g/L of water.\n• For Pests: Use Neem oil @ 5ml/L or an appropriate registered insecticide."
    }
  }

  // SEMANTIC CHECK 2: Salt water for irrigation
  const hasSalt = q.includes("salt") || q.includes("नमक") || q.includes("मीठ") || q.includes("لوݨ")
  const hasIrrigate = q.includes("water") || q.includes("पानी") || q.includes("पाणी") || q.includes("irrigation") || q.includes("सिंचाई")
  if (hasSalt && hasIrrigate) {
    switch (lang) {
      case "hi":
        return "⚠️ **सावधानी (Semantic Correction):**\nफसलों में कभी भी नमक का पानी नहीं डालना चाहिए। नमक से मिट्टी की संरचना खराब हो जाती है, लवणता (Salinity) बढ़ती है और जड़ें सूखकर पौधे मर जाते हैं!\n\n✅ हमेशा सामान्य मीठे और शुद्ध पानी से ही सिंचाई करें।"
      case "mr":
        return "⚠️ **सावधान (Semantic Correction):**\nपिकांना मिठाचे पाणी कधीही देऊ नये. यामुळे जमिनीची क्षारता वाढते आणि मुळे जळून पीक वाळून जाते!\n\n✅ पिकांसाठी नेहमी शुद्ध आणि गोड्या पाण्याचाच वापर करा."
      default:
        return "⚠️ **Critical Warning (Semantic Correction):**\nNever use salt water for irrigating crops! High salinity ruins soil structure, dehydrates root cells, and will kill your plants.\n\n✅ Always irrigate with sweet, low-salinity freshwater."
    }
  }

  // SPELLING-TOLERANT: Tomato / Yellow Leaves (tolerates: tometo, tomto, yelow, peela, pilla, etc.)
  if (
    q.includes("tomat") ||
    q.includes("tomet") ||
    q.includes("टमाटर") ||
    q.includes("टोमॅटो") ||
    q.includes("yelow") ||
    q.includes("yellow") ||
    q.includes("पीली") ||
    q.includes("पिवळी") ||
    q.includes("pili") ||
    q.includes("peela")
  ) {
    switch (lang) {
      case "hi":
        return "टमाटर की पत्तियां पीली होने के 3 मुख्य कारण और उनके सटीक इलाज:\n\n1. **नाइट्रोजन की कमी** (नीचे की पुरानी पत्तियां पीली पड़ना):\n   • उपाय: यूरिया या घुलनशील NPK 19:19:19 का 5 ग्राम प्रति लीटर पानी में मिलाकर पत्तियों पर छिड़काव करें।\n\n2. **अधिक पानी या जलभराव**:\n   • उपाय: पानी तभी दें जब खेत की ऊपरी 1-2 इंच मिट्टी सूख जाए। जलनिकासी दुरुस्त रखें।\n\n3. **झुलसा रोग (Early/Late Blight फफूंद)**:\n   • लक्षण: पत्तियों पर भूरे-काले छल्लेदार धब्बे।\n   • रासायनिक उपाय: मैंकोजेब (Mancozeb 75% WP) 2 ग्राम प्रति लीटर पानी में घोलकर छिड़कें।\n   • जैविक उपाय: 5 मिली नीम का तेल प्रति लीटर पानी में मिलाकर छिड़कें।"
      case "mr":
        return "टोमॅटोची पाने पिवळी पडण्याची मुख्य कारणे आणि उपाय:\n\n१. **नायट्रोजनची कमतरता**:\n   • उपाय: NPK १९:१९:१९ विद्राव्य खत ५ ग्रॅम प्रति लिटर पाण्यात मिसळून फवारावे.\n\n२. **पाण्याचा अतिवापर/निचरा न होणे**:\n   • उपाय: शेतात पाणी साचू देऊ नका. जमिनीचा वाफसा पाहूनच पाणी द्या.\n\n३. **करपा किंवा बुरशीजन्य रोग**:\n   • रासायनिक उपाय: मॅन्कोझेब २ ग्रॅम प्रति लिटर पाण्यात फवारावे.\n   • सेंद्रिय उपाय: ५ मिली निंबोळी अर्क प्रति लिटर पाण्यात फवारावे."
      case "gu":
        return "ટમેટાના પાંદડા પીળા પડવાના મુખ્ય કારણો અને ઉપાય:\n\n૧. **નાઇટ્રોજનની ખામી**: NPK 19:19:19 ખાતર ૫ ગ્રામ/લિટર પાણીમાં છાંટો.\n૨. **વધુ પડતું પાણી**: જમીન સૂકાય ત્યારે જ સિંચાઈ કરો.\n૩. **સુકારો/ફૂગ રોગ**: મેન્કોઝેબ ૨ ગ્રામ/લિટર પાણીમાં છાંટો."
      default:
        return "Tomato leaves turning yellow is caused by 3 main factors:\n\n1. **Nitrogen Deficiency** (lower leaves yellow first):\n   • Treatment: Foliar spray of water-soluble NPK 19:19:19 at 5g per liter of water.\n\n2. **Over-watering or Poor Drainage**:\n   • Treatment: Allow topsoil to dry slightly before irrigating.\n\n3. **Fungal Blight (Early/Late Blight)**:\n   • Chemical Treatment: Spray Mancozeb 75% WP @ 2g/L or Copper Oxychloride @ 2.5g/L.\n   • Organic Remedy: Cold-pressed Neem Oil @ 5ml/L."
    }
  }

  // SPELLING-TOLERANT: Irrigation / Water (tolerates: irigation, water, pni, sinchai)
  if (
    q.includes("water") ||
    q.includes("पानी") ||
    q.includes("पाणी") ||
    q.includes("irig") ||
    q.includes("सिंचाई") ||
    q.includes("सिंचन") ||
    q.includes("પાણી")
  ) {
    switch (lang) {
      case "hi":
        return "फसलों के लिए ड्रिप (टपक) या स्प्रिंकलर सिंचाई सबसे असरदार है। इससे 40-50% पानी की बचत होती है और फसल को संतुलित नमी मिलती है। कृषिनोवा के 'Water Management' टैब में जाकर आप अपनी मिट्टी और मौसम के अनुसार सटीक पानी की मात्रा भी जान सकते हैं।"
      case "mr":
        return "पिकांसाठी ठिबक किंवा तुषार सिंचन पद्धत सर्वोत्तम आहे. यामुळे ४०-५०% पाण्याची बचत होते. अचूक पाण्याचे नियोजन करण्यासाठी कृषिनोव्हाच्या 'Water Management' विभागात तपासा."
      default:
        return "Drip and sprinkler irrigation are the most efficient methods, saving 40-50% water while maintaining optimal root zone moisture. Check Krishinova's 'Water Management' tab to calculate exact irrigation volumes based on your acreage and weather forecast."
    }
  }

  // SPELLING-TOLERANT: Fertilizer / Soil (tolerates: fertlizer, fertzer, khad, khat, soil, mti)
  if (
    q.includes("fert") ||
    q.includes("खाद") ||
    q.includes("खत") ||
    q.includes("soil") ||
    q.includes("मिट्टी") ||
    q.includes("माती") ||
    q.includes("npk") ||
    q.includes("यूरिया")
  ) {
    switch (lang) {
      case "hi":
        return "संतुलित पोषण के लिए मिट्टी परीक्षण (Soil Test) के आधार पर NPK 4:2:1 का अनुपात अपनाएं। रासायनिक खाद के साथ गोबर की सड़ी खाद (FYM) या केंचुआ खाद (Vermicompost) का उपयोग मिट्टी की उर्वरकता बढ़ाता है।"
      case "mr":
        return "जमिनीच्या सुपीकतेसाठी माती परीक्षण करून NPK खतांचा समतोल वापर करा. शेणखत किंवा गांडूळ खताचा वापर केल्याने जमिनीतील सूक्ष्मजीवांचे प्रमाण वाढते आणि पीक जोमदार येते."
      default:
        return "Balanced nutrition based on soil testing gives the highest yield. Maintain balanced NPK application supplemented with well-decomposed farmyard manure or vermicompost to enhance soil organic carbon and nutrient uptake."
    }
  }

  // General fallback
  switch (lang) {
    case "hi":
      return "नमस्ते किसान भाई! मैं कृषिनोवा का कृषि AI सहायक हूँ। आप मुझसे फसल रोग, खाद, सिंचाई (पानी) या किसी भी कृषि समस्या के बारे में पूछ सकते हैं।"
    case "mr":
      return "नमस्कार शेतकरी बंधू! मी कृषिनोव्हा कृषी AI सहाय्यक आहे. आपण मला पीक रोग, खत, पाणी किंवा शेतीच्या कोणत्याही समस्येविषयी विचारू शकता."
    default:
      return "Hello! I am your Krishinova Agricultural Assistant. Feel free to ask about crop diseases, pest remedies, fertilizer dosages, water irrigation, or weather forecasting."
  }
}

export async function POST(req: Request) {
  try {
    const { messages, language = "en" } = await req.json()

    const targetLang = languageNames[language] || "English"
    const lastUserMessage = [...messages].reverse().find((m: any) => m.role === "user")?.content || ""

    // 1. Try Google Gemini API if configured
    if (GEMINI_API_KEY) {
      const geminiReply = await callGemini(messages, targetLang)
      if (geminiReply) {
        return NextResponse.json({ reply: geminiReply, provider: "gemini" })
      }
    }

    // 2. Try Ollama (Local or remote URL via OLLAMA_BASE_URL)
    const ollamaBaseUrl =
      process.env.OLLAMA_BASE_URL ||
      (!process.env.VERCEL ? "http://localhost:11434" : null)

    if (ollamaBaseUrl) {
      try {
        const selectedModel = await getBestInstalledOllamaModel()
        const systemPrompt = {
          role: "system",
          content: buildSystemPrompt(targetLang),
        }

        const modifiedMessages = [...messages]
        if (modifiedMessages.length > 0) {
          const lastMessage = modifiedMessages[modifiedMessages.length - 1]
          if (lastMessage.role === "user") {
            lastMessage.content = `${lastMessage.content}\n\n[Respond entirely in ${targetLang}. If simple typos exist, answer directly without mentioning them. If semantic/conceptual mistakes exist, clarify the misconception first, then provide the correct solution.]`
          }
        }

        const payload = {
          model: selectedModel,
          messages: [systemPrompt, ...modifiedMessages],
          stream: false,
          options: {
            temperature: 0.3,
            top_p: 0.9,
          },
        }

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 6000)

        const response = await fetch(`${ollamaBaseUrl.replace(/\/$/, "")}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          const botReply = data.message?.content?.trim()
          if (botReply && botReply.length > 10 && !isLowQualityOrHallucination(botReply)) {
            return NextResponse.json({ reply: botReply, provider: "ollama", model: selectedModel })
          }
        }
      } catch (e: any) {
        console.warn("Ollama call failed or skipped:", e.message)
      }
    }

    // 3. High quality contextual fallback with semantic correction and spelling tolerance
    const fallbackReply = getAgriFallbackReply(lastUserMessage, language)
    return NextResponse.json({ reply: fallbackReply, provider: "fallback" })
  } catch (error: any) {
    console.error("Chat API Error:", error)
    return NextResponse.json({
      reply: "KrishiBot is ready to help you with crops, weather, water management, and soil health. What would you like to know today?",
    })
  }
}
