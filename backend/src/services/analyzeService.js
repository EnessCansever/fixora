const { GoogleGenAI } = require('@google/genai')
const { categorizeError } = require('../utils/categorizer')

const allowedCategories = [
  'Syntax Error',
  'Reference Error',
  'Type Error',
  'React Error',
  'API / Network Error',
  'Build Tool Error',
  'Unknown',
]

let genAIClient = null

function getGenAIClient(apiKey) {
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey })
  }

  return genAIClient
}

function getTextFromGenAIResponse(response) {
  if (!response) {
    return ''
  }

  if (typeof response.text === 'function') {
    return response.text()
  }

  if (typeof response.text === 'string') {
    return response.text
  }

  const firstCandidate = response.candidates?.[0]
  const parts = firstCandidate?.content?.parts
  if (Array.isArray(parts)) {
    return parts
      .map((part) => (typeof part.text === 'string' ? part.text : ''))
      .join('\n')
      .trim()
  }

  return ''
}

const fallbackResponses = {
  'Syntax Error': {
    shortSummary: 'Kod yaziminda bir sorun var.',
    turkishExplanation: 'Kodda parantez, tirnak, virgul veya benzeri yazim hatalari bulunuyor.',
    possibleCauses: ['Eksik kapanan parantez', 'Yanlis tirnak kullanimi', 'Eksik virgul ya da sembol'],
    solutionSteps: ['Hata satirini kontrol edin.', 'Parantez ve tirnaklari eslestirin.', 'Kodun cevresindeki satirlari da inceleyin.'],
    exampleFixCode: "const user = { name: 'John' }",
    notes: 'Syntax hatalari genelde derleme veya calisma aninda hemen gorulur.',
  },
  'Reference Error': {
    shortSummary: 'Bir degisken ya da fonksiyon bulunamadi.',
    turkishExplanation: 'Kod, tanimli olmayan bir degiskeni veya fonksiyonu kullanmaya calisiyor.',
    possibleCauses: ['Degisken tanimli degil', 'Import eksik', 'Scope disindan erisim yapiliyor'],
    solutionSteps: ['Degiskenin tanimli oldugunu kontrol edin.', 'Gerekli importlari ekleyin.', 'Scope yapisini gozden gecirin.'],
    exampleFixCode: "const userName = 'John'\nconsole.log(userName)",
    notes: 'Kullanimdan once degiskenin var oldugundan emin olun.',
  },
  'Type Error': {
    shortSummary: 'Yanlis veri tipiyle islem yapilmaya calisiliyor.',
    turkishExplanation: 'Bir degiskenin tipi beklenen yapida degil ve bu nedenle bir metod ya da islem hata veriyor.',
    possibleCauses: ['null veya undefined deger', 'Yanlis tipte veri', 'Dizi yerine string kullanimi'],
    solutionSteps: ['Degerin tipini kontrol edin.', 'Bos deger kontrolleri ekleyin.', 'Gerekirse tip donusumu yapin.'],
    exampleFixCode: "const items = data?.items || []\nitems.map((item) => item)",
    notes: 'Tip kontrolu yapmadan metod cagirmayin.',
  },
  'React Error': {
    shortSummary: 'React kullaniminda bir kural ihlali olabilir.',
    turkishExplanation: 'Hook kullanimi, render yapisi ya da component akisinda React kurallarina aykiri bir durum var.',
    possibleCauses: ['Hook kosullu kullanildi', 'Component disinda hook cagrildi', 'Listelerde key eksik'],
    solutionSteps: ['Hooklari component ust seviyesinde kullanin.', 'Kosullu hook kullanimindan kacinin.', 'Listelere unique key ekleyin.'],
    exampleFixCode: "const [count, setCount] = useState(0)",
    notes: 'React kurallarini sade ve tutarli sekilde uygulayin.',
  },
  'API / Network Error': {
    shortSummary: 'API ya da ag istegi basarisiz oldu.',
    turkishExplanation: 'Sunucuya ulasilamadi, CORS engeli oldu ya da istek beklenen cevabi alamadi.',
    possibleCauses: ['Yanlis URL', 'CORS sorunu', 'Sunucu calismiyor'],
    solutionSteps: ['Endpoint adresini kontrol edin.', 'Backend calisiyor mu bakın.', 'Network sekmesinden istegi inceleyin.'],
    exampleFixCode: "fetch('/api/data')\n  .then((res) => res.json())",
    notes: 'Agi sorunlarinda log ve network paneli ilk kontrol noktasi olsun.',
  },
  'Build Tool Error': {
    shortSummary: 'Build aracinda bir sorun olustu.',
    turkishExplanation: 'Vite, Webpack veya Babel gibi araclardan biri projeyi derlerken hata ile karsilasti.',
    possibleCauses: ['Yanlis config', 'Eksik modul', 'Derleme sirasinda yakalanan syntax hatasi'],
    solutionSteps: ['Config dosyasini kontrol edin.', 'Paketleri yeniden kurun.', 'Build logunu dikkatli okuyun.'],
    exampleFixCode: "import { defineConfig } from 'vite'\nexport default defineConfig({})",
    notes: 'Build hatalari genelde config veya bagimlilik kaynaklidir.',
  },
  Unknown: {
    shortSummary: 'Hata mesajini net sekilde eslestiremedim.',
    turkishExplanation: 'Bu hata icin en guvenli yaklasim mesajin tamamini ve stack trace detaylarini incelemektir.',
    possibleCauses: ['Mesaj eksik olabilir', 'Nadir bir hata olabilir'],
    solutionSteps: ['Tam hata mesajini kontrol edin.', 'Stack trace satirlarini inceleyin.', 'Gerekirse daha fazla baglam ekleyin.'],
    exampleFixCode: 'Daha fazla bilgi gerekli.',
    notes: 'Belirsiz durumlarda genel kontrol adimlarini izleyin.',
  },
}

function buildFallbackAnalysis(errorMessage, codeSnippet) {
  const category = categorizeError(errorMessage)
  const fallback = fallbackResponses[category] || fallbackResponses.Unknown

  return {
    category,
    shortSummary: fallback.shortSummary,
    turkishExplanation: fallback.turkishExplanation,
    possibleCauses: fallback.possibleCauses,
    solutionSteps: fallback.solutionSteps,
    exampleFixCode: fallback.exampleFixCode,
    notes: fallback.notes,
    inputError: errorMessage.slice(0, 100),
    codeProvided: Boolean(codeSnippet && codeSnippet.trim()),
    usedFallback: true,
  }
}

function buildPrompt(errorMessage, codeSnippet, suggestedCategory) {
  return `
Sen junior seviyeye uygun, acik ve Turkce anlatan bir hata analiz yardimcisisin.
Kullanici sana tarayici konsolundan gelen Ingilizce hata mesajini ve opsiyonel kod parcasini verdi.

Amacin:
- Hata mesajini Turkce ve sade sekilde acikla.
- Muhtemel nedenleri sirala.
- Uygulanabilir cozum adimlari ver.
- Gerekirse kisa ve anlasilir bir duzeltilmis kod ornegi sun.
- Teknik jargon kullanma, gereksiz uzatma yapma.

Kategori tahmini (yalnizca ipucu): ${suggestedCategory}
Bu kategoriye zorunlu degilsin, hata mesajina gore daha dogru kategori sec.

Kullanici girdisi:
Hata mesaji: ${errorMessage}
Kod parcasi: ${codeSnippet || 'Yok'}

Baglama dikkat et:
- "cannot read properties of undefined", "reading 'map'", "reading 'filter'", "is not a function", "is not iterable" gibi mesajlarda genelde tip kaynakli problem vardir.
- "is not defined" ifadesi genelde reference problemidir.
- "hydration", "server/client render mismatch", "did not match" gibi ifadeler React render/hydration problemidir.
- Aciklamayi bu anahtar ifadelere gore ozellestir, genel/gecistirici cevap verme.

Sadece gecerli JSON nesnesi dondur. Markdown, aciklama metni veya kod blogu ekleme.
Alanlar tam olarak su olsun:
{
  "category": "Syntax Error | Reference Error | Type Error | React Error | API / Network Error | Build Tool Error | Unknown",
  "shortSummary": "Kisa, tek cümlelik ozet",
  "turkishExplanation": "Turkce, sade ve anlasilir aciklama",
  "possibleCauses": ["madde 1", "madde 2"],
  "solutionSteps": ["adim 1", "adim 2"],
  "exampleFixCode": "Kisa duzeltilmis kod ornegi",
  "notes": "Dikkat edilmesi gerekenler"
}

Kurallar:
- possibleCauses ve solutionSteps dizi olsun.
- exampleFixCode kisa olsun ve markdown code fence kullanma.
- category yukaridaki degerlerden biri olsun.
- Cevap Turkce olsun.
`.trim()
}

function stripCodeFences(text) {
  return text.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim()
}

function parseModelResponse(text) {
  const cleaned = stripCodeFences(text)

  try {
    return JSON.parse(cleaned)
  } catch (error) {
    const startIndex = cleaned.indexOf('{')
    const endIndex = cleaned.lastIndexOf('}')

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      return JSON.parse(cleaned.slice(startIndex, endIndex + 1))
    }

    throw error
  }
}

function extractPartialFromText(text) {
  const cleaned = stripCodeFences(text)

  const extractString = (key) => {
    const regex = new RegExp(`"${key}"\\s*:\\s*"([\\s\\S]*?)"`, 'i')
    const match = cleaned.match(regex)
    return match ? match[1].replace(/\\n/g, '\n').trim() : undefined
  }

  const extractArray = (key) => {
    const regex = new RegExp(`"${key}"\\s*:\\s*\\[([\\s\\S]*?)\\]`, 'i')
    const match = cleaned.match(regex)
    if (!match) {
      return undefined
    }

    const itemRegex = /"([\s\S]*?)"/g
    const items = []
    let itemMatch = itemRegex.exec(match[1])

    while (itemMatch) {
      items.push(itemMatch[1].replace(/\\n/g, '\n').trim())
      itemMatch = itemRegex.exec(match[1])
    }

    return items.length > 0 ? items : undefined
  }

  return {
    category: extractString('category'),
    shortSummary: extractString('shortSummary'),
    turkishExplanation: extractString('turkishExplanation'),
    possibleCauses: extractArray('possibleCauses'),
    solutionSteps: extractArray('solutionSteps'),
    exampleFixCode: extractString('exampleFixCode'),
    notes: extractString('notes'),
  }
}

function hasUsableModelField(rawResult) {
  if (!rawResult || typeof rawResult !== 'object') {
    return false
  }

  return [
    rawResult.shortSummary,
    rawResult.turkishExplanation,
    rawResult.exampleFixCode,
    rawResult.notes,
    Array.isArray(rawResult.possibleCauses) ? rawResult.possibleCauses.length : 0,
    Array.isArray(rawResult.solutionSteps) ? rawResult.solutionSteps.length : 0,
  ].some((value) => {
    if (typeof value === 'string') {
      return value.trim().length > 0
    }

    return Number(value) > 0
  })
}

function normalizeArrayValue(value, fallbackValue) {
  if (Array.isArray(value)) {
    const items = value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean)

    return items.length > 0 ? items : fallbackValue
  }

  if (typeof value === 'string' && value.trim()) {
    return [value.trim()]
  }

  return fallbackValue
}

function normalizeTextValue(value, fallbackValue) {
  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }

  return fallbackValue
}

function normalizeCategoryValue(value, suggestedCategory) {
  if (typeof value !== 'string') {
    return suggestedCategory
  }

  const normalizedValue = value.trim()
  if (allowedCategories.includes(normalizedValue)) {
    return normalizedValue
  }

  return suggestedCategory
}

function normalizeAnalysis(rawResult, errorMessage, codeSnippet) {
  const fallback = buildFallbackAnalysis(errorMessage, codeSnippet)
  const hasModelData = hasUsableModelField(rawResult)

  return {
    category: normalizeCategoryValue(rawResult.category, fallback.category),
    shortSummary: normalizeTextValue(rawResult.shortSummary, fallback.shortSummary),
    turkishExplanation: normalizeTextValue(rawResult.turkishExplanation, fallback.turkishExplanation),
    possibleCauses: normalizeArrayValue(rawResult.possibleCauses, fallback.possibleCauses),
    solutionSteps: normalizeArrayValue(rawResult.solutionSteps, fallback.solutionSteps),
    exampleFixCode: normalizeTextValue(rawResult.exampleFixCode, fallback.exampleFixCode),
    notes: normalizeTextValue(rawResult.notes, fallback.notes),
    inputError: errorMessage.slice(0, 100),
    codeProvided: Boolean(codeSnippet && codeSnippet.trim()),
    usedFallback: !hasModelData,
  }
}

async function analyzeError(errorMessage, codeSnippet = '') {
  const apiKey = process.env.GEMINI_API_KEY
  const suggestedCategory = categorizeError(errorMessage)
  const isDevelopment = (process.env.NODE_ENV || 'development') === 'development'

  if (!apiKey) {
    console.warn('[analyzeService] GEMINI_API_KEY bulunamadi, fallback kullaniliyor.')
    return buildFallbackAnalysis(errorMessage, codeSnippet)
  }

  try {
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
    const client = getGenAIClient(apiKey)

    const prompt = buildPrompt(errorMessage, codeSnippet, suggestedCategory)
    const result = await client.models.generateContent({
      model: modelName,
      contents: prompt,
    })
    const responseText = getTextFromGenAIResponse(result)

    if (isDevelopment) {
      console.log(`[analyzeService] Gemini raw: ${String(responseText).replace(/\s+/g, ' ').slice(0, 280)}`)
    }

    let parsedResult = null
    try {
      parsedResult = parseModelResponse(responseText)
    } catch (parseError) {
      console.warn(`[analyzeService] JSON parse basarisiz: ${parseError.message}`)
      parsedResult = extractPartialFromText(responseText)
    }

    if (!hasUsableModelField(parsedResult)) {
      console.warn('[analyzeService] Model cevabi kullanilamadi, fallback kullaniliyor.')
      return buildFallbackAnalysis(errorMessage, codeSnippet)
    }

    return normalizeAnalysis(parsedResult, errorMessage, codeSnippet)
  } catch (error) {
    console.error(`[analyzeService] Gemini analiz hatasi: ${error.message}`)
    console.warn('[analyzeService] Fallback kullaniliyor.')
    return buildFallbackAnalysis(errorMessage, codeSnippet)
  }
}

module.exports = {
  analyzeError,
}
