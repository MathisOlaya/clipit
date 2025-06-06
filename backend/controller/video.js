import ytdl from '@distube/ytdl-core'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid';

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
                return res.status(400).json({message: "L'URL fournie n'est pas valide", type: 'error'})
            }

            // Get Youtube Video Title
            ws.send(JSON.stringify({message: "Création d'un identifiant unique...", type: 'pending'}))
            const uniqueID = uuidv4();
            
            // Download
            ws.send(JSON.stringify({message: "Téléchargement de la vidéo...", type: 'pending'}))
            ytdl(url).pipe(fs.createWriteStream(`uploads/${uniqueID}.mp4`))
            
            // On Download DONE
            ws.send(JSON.stringify({message: "✅ Le téléchargement est terminé.", type: 'done', id: uniqueID }))
        } catch(err) {
            console.log(err)
            return res.status(500).json({message: "Merci de réessayer ultérieurement"})
        }
        
    }
}

export default new VideoController();