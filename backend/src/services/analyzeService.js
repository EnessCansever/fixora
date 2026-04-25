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
    shortSummary: 'Kod yazımında bir sorun var.',
    turkishExplanation: 'Kodda parantez, tırnak, virgül veya benzeri yazım hataları bulunuyor.',
    possibleCauses: ['Eksik kapanan parantez', 'Yanlış tırnak kullanımı', 'Eksik virgül ya da sembol'],
    solutionSteps: ['Hata satırını kontrol edin.', 'Parantez ve tırnakları eşleştirin.', 'Kodun çevresindeki satırları da inceleyin.'],
    exampleFixCode: "const user = { name: 'John' }",
    notes: 'Sözdizimi hataları genelde derleme veya çalışma anında hemen görülür.',
  },
  'Reference Error': {
    shortSummary: 'Bir değişken ya da fonksiyon bulunamadı.',
    turkishExplanation: 'Kod, tanımlı olmayan bir değişkeni veya fonksiyonu kullanmaya çalışıyor.',
    possibleCauses: ['Değişken tanımlı değil', 'Import eksik', 'Scope dışından erişim yapılıyor'],
    solutionSteps: ['Değişkenin tanımlı olduğunu kontrol edin.', 'Gerekli importları ekleyin.', 'Scope yapısını gözden geçirin.'],
    exampleFixCode: "const userName = 'John'\nconsole.log(userName)",
    notes: 'Kullanımdan önce değişkenin var olduğundan emin olun.',
  },
  'Type Error': {
    shortSummary: 'Yanlış veri tipiyle işlem yapılmaya çalışılıyor.',
    turkishExplanation: 'Bir değişkenin tipi beklenen yapıda değil ve bu nedenle bir metod ya da işlem hata veriyor.',
    possibleCauses: ['null veya undefined değer', 'Yanlış tipte veri', 'Dizi yerine string kullanımı'],
    solutionSteps: ['Değerin tipini kontrol edin.', 'Boş değer kontrolleri ekleyin.', 'Gerekirse tip dönüşümü yapın.'],
    exampleFixCode: "const items = data?.items || []\nitems.map((item) => item)",
    notes: 'Tip kontrolü yapmadan metod çağırmayın.',
  },
  'React Error': {
    shortSummary: 'React kullanımında bir kural ihlali olabilir.',
    turkishExplanation: 'Hook kullanımı, render yapısı ya da component akışında React kurallarına aykırı bir durum var.',
    possibleCauses: ['Hook koşullu kullanıldı', 'Component dışında hook çağrıldı', 'Listelerde key eksik'],
    solutionSteps: ['Hookları component üst seviyesinde kullanın.', 'Koşullu hook kullanımından kaçının.', 'Listelere benzersiz key ekleyin.'],
    exampleFixCode: "const [count, setCount] = useState(0)",
    notes: 'React kurallarını sade ve tutarlı şekilde uygulayın.',
  },
  'API / Network Error': {
    shortSummary: 'API ya da ağ isteği başarısız oldu.',
    turkishExplanation: 'Sunucuya ulaşılamadı, CORS engeli oldu ya da istek beklenen cevabı alamadı.',
    possibleCauses: ['Yanlış URL', 'CORS sorunu', 'Sunucu çalışmıyor'],
    solutionSteps: ['Endpoint adresini kontrol edin.', 'Backend çalışıyor mu bakın.', 'Network sekmesinden isteği inceleyin.'],
    exampleFixCode: "fetch('/api/data')\n  .then((res) => res.json())",
    notes: 'Ağ sorunlarında log ve network paneli ilk kontrol noktası olsun.',
  },
  'Build Tool Error': {
    shortSummary: 'Build aracında bir sorun oluştu.',
    turkishExplanation: 'Vite, Webpack veya Babel gibi araçlardan biri projeyi derlerken hata ile karşılaştı.',
    possibleCauses: ['Yanlış yapılandırma', 'Eksik modül', 'Derleme sırasında yakalanan sözdizimi hatası'],
    solutionSteps: ['Yapılandırma dosyasını kontrol edin.', 'Paketleri yeniden kurun.', 'Build logunu dikkatli okuyun.'],
    exampleFixCode: "import { defineConfig } from 'vite'\nexport default defineConfig({})",
    notes: 'Build hataları genelde yapılandırma veya bağımlılık kaynaklıdır.',
  },
  Unknown: {
    shortSummary: 'Hata mesajını net şekilde eşleştiremedim.',
    turkishExplanation: 'Bu hata için en güvenli yaklaşım, mesajın tamamını ve stack trace ayrıntılarını incelemektir.',
    possibleCauses: ['Mesaj eksik olabilir', 'Nadir bir hata olabilir'],
    solutionSteps: ['Tam hata mesajını kontrol edin.', 'Stack trace satırlarını inceleyin.', 'Gerekirse daha fazla bağlam ekleyin.'],
    exampleFixCode: 'Daha fazla bilgi gerekli.',
    notes: 'Belirsiz durumlarda genel kontrol adımlarını izleyin.',
  },
}

function buildSeoContentFallback(shortSummary, errorMessage, category) {
  const summaryText = typeof shortSummary === 'string' ? shortSummary.trim() : ''
  const errorText = typeof errorMessage === 'string' ? errorMessage.trim() : ''
  const categoryText = typeof category === 'string' && category.trim() ? category.trim() : 'bu hata'
  const normalizedCategory = categoryText.toLowerCase()

  let introText = `${normalizedCategory} sınıfındaki bu hata, uygulamanın beklediği veri yapısı, çalışma sırası veya bileşen davranışı ile gerçek çalışma koşulları arasında bir uyumsuzluk oluştuğunda ortaya çıkar.`

  if (summaryText) {
    introText = `${summaryText} Bu durum çoğunlukla ${normalizedCategory} kategorisindeki bir uyumsuzluğun görünür hale gelmiş sonucudur.`
  } else if (errorText) {
    const shortenedError = errorText.length > 140 ? `${errorText.slice(0, 140).trimEnd()}...` : errorText
    introText = `${shortenedError} mesajı, kodun bir noktada beklediği koşulları karşılayamadığını ve ${normalizedCategory} ile ilişkili bir kırılma yaşandığını gösterir.`
  }

  const fallbackText = `${introText} Bu hatalar genellikle API yanıtının beklenenden farklı gelmesi, asenkron işlemlerin tahmin edilenden geç tamamlanması, null veya undefined değerlerin kontrol edilmeden kullanılması, yanlış tipte veri ile işlem yapılması ya da bileşen yaşam döngüsünde sıralama hatası yapılması gibi gerçek senaryolarda görülür. Geliştiricilerin en sık yaptığı hata, yalnızca hatanın görünen satırına odaklanıp verinin kaynağını ve önceki adımları incelememektir; bu nedenle sorun kısa süreli olarak kapanır ama benzer bir durumda tekrar eder. Daha kalıcı bir çözüm için önce hatayı yeniden üretin, ardından hataya giden veri akışını adım adım izleyin, kritik değişkenlerin tip ve değer kontrollerini ekleyin, sınır durumlarını test edin ve beklenmeyen girişler için güvenli geri dönüş davranışı tanımlayın. İyi bir pratik olarak, kritik alanlarda koruyucu koşullar ve anlamlı loglama kullanın; böylece hem hatayı daha hızlı izole eder hem de benzer problemlerin üretimde kullanıcıya yansımasını belirgin biçimde azaltırsınız.`

  const words = fallbackText.split(/\s+/).filter(Boolean)
  if (words.length > 300) {
    return `${words.slice(0, 300).join(' ')}...`
  }

  return fallbackText
}

function normalizeSeoContentLength(value, fallbackValue) {
  if (typeof value !== 'string') {
    return fallbackValue
  }

  const normalized = value.replace(/\s+/g, ' ').trim()
  if (!normalized) {
    return fallbackValue
  }

  const words = normalized.split(/\s+/).filter(Boolean)

  if (words.length < 150) {
    return fallbackValue
  }

  if (words.length > 300) {
    return `${words.slice(0, 300).join(' ')}...`
  }

  return normalized
}

function buildFallbackAnalysis(errorMessage, codeSnippet) {
  const category = categorizeError(errorMessage)
  const fallback = fallbackResponses[category] || fallbackResponses.Unknown
  const seoContent = buildSeoContentFallback(fallback.shortSummary, errorMessage, category)

  return {
    category,
    shortSummary: fallback.shortSummary,
    turkishExplanation: fallback.turkishExplanation,
    possibleCauses: fallback.possibleCauses,
    solutionSteps: fallback.solutionSteps,
    exampleFixCode: fallback.exampleFixCode,
    notes: fallback.notes,
    seoContent,
    inputError: errorMessage.slice(0, 100),
    codeProvided: Boolean(codeSnippet && codeSnippet.trim()),
    usedFallback: true,
  }
}

function buildPrompt(errorMessage, codeSnippet, suggestedCategory) {
  return `
Sen junior seviyeye uygun, açık ve Türkçe anlatan bir hata analiz yardımcısısın.
Kullanıcı sana tarayıcı konsolundan gelen İngilizce hata mesajını ve opsiyonel kod parçasını verdi.

Amacın:
- Hata mesajını Türkçe ve sade şekilde açıkla.
- Muhtemel nedenleri sırala.
- Uygulanabilir çözüm adımları ver.
- Gerekirse kısa ve anlaşılır bir düzeltilmiş kod örneği sun.
- Teknik jargon kullanma, gereksiz uzatma yapma.

Yazım kuralları:
- Türkçe karakterleri eksiksiz kullan.
- Doğal, profesyonel ve akıcı Türkçe yaz.
- "Türkçe", "çözüm", "açıklama", "kullanıcı", "örnek", "değişken", "geçerli" gibi kelimeleri doğru yaz.

Kategori tahmini (yalnızca ipucu): ${suggestedCategory}
Bu kategoriye zorunlu değilsin, hata mesajına göre daha doğru kategori seç.

Kullanıcı girdisi:
Hata mesajı: ${errorMessage}
Kod parçası: ${codeSnippet || 'Yok'}

Bağlama dikkat et:
- "cannot read properties of undefined", "reading 'map'", "reading 'filter'", "is not a function", "is not iterable" gibi mesajlarda genelde tip kaynaklı problem vardır.
- "is not defined" ifadesi genelde reference problemidir.
- "hydration", "server/client render mismatch", "did not match" gibi ifadeler React render/hydration problemidir.
- Açıklamayı bu anahtar ifadelere göre özelleştir, genel/geçiştirici cevap verme.

Sadece geçerli JSON nesnesi döndür. Markdown, açıklama metni veya kod bloğu ekleme.
Alanlar tam olarak şu olsun:
{
  "category": "Syntax Error | Reference Error | Type Error | React Error | API / Network Error | Build Tool Error | Unknown",
  "shortSummary": "Kısa, tek cümlelik özet",
  "turkishExplanation": "Türkçe, sade ve anlaşılır açıklama",
  "possibleCauses": ["madde 1", "madde 2"],
  "solutionSteps": ["adım 1", "adım 2"],
  "exampleFixCode": "Kısa düzeltilmiş kod örneği",
  "notes": "Dikkat edilmesi gerekenler",
  "seoContent": "150-300 kelime, Türkçe, akıcı ve özgün SEO içeriği"
}

Kurallar:
- possibleCauses ve solutionSteps dizi olsun.
- exampleFixCode kısa olsun ve markdown code fence kullanma.
- category yukarıdaki değerlerden biri olsun.
- seoContent mutlaka tek bir string olsun ve markdown kullanmasın.
- seoContent 150-300 kelime aralığında olsun.
- seoContent şu akışı doğal biçimde içersin: hatanın genel açıklaması, neden ortaya çıktığı gerçek senaryolar, geliştiricilerin sık yaptığı hatalar, çözüm için mantıksal yaklaşım, kısa bir best practice önerisi.
- seoContent teknik ama sade bir dille yazılsın, junior geliştirici tarafından anlaşılabilsin.
- seoContent içinde gereksiz tekrar ve anahtar kelime spam kullanma.
- Cevap Türkçe olsun ve yazım kurallarına uygun, doğal Türkçe karakterlerle yazılsın.
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
    seoContent: extractString('seoContent'),
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
    rawResult.seoContent,
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
  const normalizedShortSummary = normalizeTextValue(rawResult.shortSummary, fallback.shortSummary)
  const normalizedSeoContent = normalizeSeoContentLength(
    normalizeTextValue(rawResult.seoContent, ''),
    fallback.seoContent,
  )

  return {
    category: normalizeCategoryValue(rawResult.category, fallback.category),
    shortSummary: normalizedShortSummary,
    turkishExplanation: normalizeTextValue(rawResult.turkishExplanation, fallback.turkishExplanation),
    possibleCauses: normalizeArrayValue(rawResult.possibleCauses, fallback.possibleCauses),
    solutionSteps: normalizeArrayValue(rawResult.solutionSteps, fallback.solutionSteps),
    exampleFixCode: normalizeTextValue(rawResult.exampleFixCode, fallback.exampleFixCode),
    notes: normalizeTextValue(rawResult.notes, fallback.notes),
    seoContent: normalizedSeoContent || buildSeoContentFallback(normalizedShortSummary, errorMessage, fallback.category),
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
    console.error(`[analyzeService] Gemini analiz hatası: ${error.message}`)
    console.warn('[analyzeService] Fallback kullaniliyor.')
    return buildFallbackAnalysis(errorMessage, codeSnippet)
  }
}

module.exports = {
  analyzeError,
}
