import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { errorMiddleware } from './src/shared/middlewares/error.middleware.js'
import { PORT } from './src/shared/config/index.js'
import { connectDB } from './src/shared/db/db_config.js'

// Modules
import authRouter from './src/modules/Authentication/index.js'
import TeamC from './src/modules/Team_C/index.js'

const app = express()

// === Middlewares globaux ===
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(logger('combined'))

// === Routes ===
app.use('/api', authRouter)   // Auth routes (signup, login, etc.)
app.use('/api', TeamC)        // Team C routes (/api/tasks)

// === Gestion des erreurs ===
app.use(errorMiddleware)

// === Connexion DB & lancement serveur ===
await connectDB()

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
})
