const rateLimit = require('express-rate-limit')

const ANALYZE_WINDOW_MS = 10 * 60 * 1000
const ANALYZE_MAX_REQUESTS = 20

const analyzeRateLimiter = rateLimit({
  windowMs: ANALYZE_WINDOW_MS,
  max: ANALYZE_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Çok fazla analiz isteği gönderildi. Lütfen biraz sonra tekrar deneyin.',
    })
  },
})

module.exports = {
  analyzeRateLimiter,
}