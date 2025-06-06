import ytdl from '@distube/ytdl-core'
import fs from 'fs'
import { json } from 'stream/consumers'

class VideoController {
    constructor(){}
    async create(url, ws){
        // Youtube VIDEO URL
        if(!url){
            return ws.send(JSON.stringify({message: "Aucune URL n'a été fournie"}))
        }

        try{
            // Validate VIDEO's URL
            if(!ytdl.validateURL(url)){
                return res.status(400).json({message: "L'URL fournie n'est pas valide"})
            }

            // Get Youtube Video Title
            ws.send(JSON.stringify({message: "Obtention des données de la vidéo..."}))
            const info = await ytdl.getInfo(url)
            
            
            ws.send(JSON.stringify({message: "Téléchargement de la vidéo..."}))
            ytdl(url).pipe(fs.createWriteStream('uploads/'.concat(info.videoDetails.title.concat('.mp4'))))
            
            
        } catch(err) {
            console.log(err)
            return res.status(500).json({message: "Merci de réessayer ultérieurement"})
        }
        
    }
}

export default new VideoController();