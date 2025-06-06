import express from 'express'
import dotenv from 'dotenv'
import { WebSocketServer } from 'ws'
import path, { dirname } from 'path'
import cors from 'cors'

// Config
dotenv.config()

// Server's CONFIG
const app = express()
app.use(express.json())
app.use('/videos', express.static(path.join(import.meta.dirname, 'video')))
app.use('/previews', express.static(path.join(import.meta.dirname, 'previews')))
app.use('/final', express.static(path.join(import.meta.dirname, 'final')))

app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
)

const port = process.env.PORT || 3000
const host = process.env.HOST || 'http://localhost'

// Import Router
import VideoRouter from './router/video.js'

// Listen router
app.use('/video', VideoRouter)

// Start server
const server = app.listen(port, () => {
  console.log(`🚀 Serveur démaré avec succès sur le port ${port}`)
})

// WebSocketServer & VideoController
const wss = new WebSocketServer({ server })
import VideoController from './controller/video.js'

wss.on('connection', (ws) => {
  console.log('✅ Connexion établie avec le client')

  ws.on('message', async (data) => {
    try {
      console.log('🚀 Lancement du processus')
      const { url, videoIndex } = JSON.parse(data)

      await VideoController.create(url, videoIndex, ws)
    } catch (error) {
      console.error(error)
      ws.send(JSON.stringify({ message: 'Merci de rééssayer ultérieurement' }))
    }
  })
})

// Throw warning alert
if (!process.env.PORT) {
  console.warn("⚠️ Vous n'avez pas spécifier de port. Utilisation du port par défaut : 3000")
}
if (!process.env.HOST) {
  console.warn(
    "⚠️ Vous n'avez pas spécifier d'hôte. Utilisation de l'hôte par défaut : http://localhost",
  )
}
