const express = require('express')
const { analyzeError } = require('../controllers/analyzeController')
const { analyzeRateLimiter } = require('../middlewares/rateLimiters')
const { requireAuth } = require('../middlewares/requireAuth')

const router = express.Router()

// Basit validation middleware
const validateAnalyzeRequest = (req, res, next) => {
  const { errorMessage, codeSnippet } = req.body

  // Boş request kontrolü
  if (!errorMessage) {
    return res.status(400).json({
      success: false,
      error: 'Hata mesajı alanı gerekli.',
    })
  }

  // String kontrolü
  if (typeof errorMessage !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Hata mesajı bir metin olmalı.',
    })
  }

  // Boşluk kontrolü
  if (errorMessage.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Hata mesajı boş bırakılamaz.',
    })
  }

  // Max length kontrolü
  if (errorMessage.length > 5000) {
    return res.status(400).json({
      success: false,
      error: 'Hata mesajı çok uzun (en fazla 5000 karakter).',
    })
  }

  // Kod parçası opsiyonel, ama gönderildiyse metin olmalı ve sınırlı kalmalı 
  if (codeSnippet !== undefined && codeSnippet !== null && typeof codeSnippet !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Kod parçası bir metin olmalı.',
    })
  }

  if (typeof codeSnippet === 'string' && codeSnippet.trim().length > 10000) {
    return res.status(400).json({
      success: false,
      error: 'Kod parçası en fazla 10000 karakter olabilir.',
    })
  }

  next()
}

router.post('/analyze', requireAuth, analyzeRateLimiter, validateAnalyzeRequest, analyzeError)

module.exports = router
