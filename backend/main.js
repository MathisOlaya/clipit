import express from "express"
import dotenv from 'dotenv'
import { WebSocketServer } from "ws";

// Config
dotenv.config()

// Server's CONFIG
const app = express();
app.use(express.json())
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'http://localhost'

// Import Router
import VideoRouter from "./router/video.js";

// Listen router
app.use("/video", VideoRouter)

// Start server
const server = app.listen(port, () =>{
    console.log(`🚀 Serveur démaré avec succès sur le port ${port}`)
})

// WebSocketServer & VideoController
const wss = new WebSocketServer({ server })
import VideoController from './controller/video.js'

wss.on('connection', (ws) => {
    console.log("✅ Connexion établie avec le client")

    ws.on('message', async (data) =>{
        try {  
            console.log("🚀 Lancement du processus")
            const { url } = JSON.parse(data);

            await VideoController.create(url, ws)
        } catch(error) {
            console.error(error)
            ws.send(JSON.stringify({message: 'Merci de rééssayer ultérieurement' }));
        }
    })
})

// Throw warning alert 
if(!process.env.PORT){
    console.warn("⚠️ Vous n'avez pas spécifier de port. Utilisation du port par défaut : 3000")
}
if(!process.env.HOST){
    console.warn("⚠️ Vous n'avez pas spécifier d'hôte. Utilisation de l'hôte par défaut : http://localhost")
}
