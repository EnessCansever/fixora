function requestLogger(req, res, next) {
  const startTime = process.hrtime.bigint()

  res.on('finish', () => {
    const endTime = process.hrtime.bigint()
    const durationMs = Number(endTime - startTime) / 1_000_000

    console.log(`[${req.method}] ${req.originalUrl} ${res.statusCode} - ${durationMs.toFixed(1)}ms`)
  })

  next()
}

module.exports = {
  requestLogger,
}