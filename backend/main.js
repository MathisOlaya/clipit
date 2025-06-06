import express from "express"
import dotenv from 'dotenv'

// Config
dotenv.config()

// Server's CONFIG
const app = express();
app.use(express.json())
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'http://localhost'
// Start server
const server = app.listen(port, () =>{
    console.log(`🚀 Serveur démaré avec succès sur le port ${port}`)
})
// Throw warning alert 
if(!process.env.PORT){
    console.warn("⚠️ Vous n'avez pas spécifier de port. Utilisation du port par défaut : 3000")
}
if(!process.env.HOST){
    console.warn("⚠️ Vous n'avez pas spécifier d'hôte. Utilisation de l'hôte par défaut : http://localhost")
}
