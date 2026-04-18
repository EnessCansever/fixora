const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const apiRoutes = require('./routes')
const { connectDatabase } = require('./config/database')
const { loadEnvConfig } = require('./config/env')
const { requestLogger } = require('./middlewares/requestLogger')

const env = loadEnvConfig()

const app = express()
const allowedOrigins = new Set(env.frontendOrigins)

if (env.nodeEnv === 'development') {
  allowedOrigins.add('http://localhost:5173')
}

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true)
    }

    return callback(new Error('CORS engeli: Bu origin icin izin tanimli degil.'))
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(requestLogger)

app.get('/', (req, res) => {
  res.json({ message: 'Fixora backend ayakta.' })
})

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
  })
})

app.use('/api', apiRoutes)

async function startServer() {
  await connectDatabase(env.mongoUri)

  app.listen(env.port, () => {
    console.log(`Server calisiyor: http://localhost:${env.port}`)
  })
}

startServer().catch((error) => {
  console.error('[startup] Backend baslatilamadi:', error.message)
  process.exit(1)
})
