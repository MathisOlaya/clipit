import ytdl from '@distube/ytdl-core'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

// FFMPEG
import ffmpeg from 'fluent-ffmpeg'
import staticFfmpeg from 'ffmpeg-static'

// FFMPEG Config
ffmpeg.setFfmpegPath(staticFfmpeg)

class VideoController {
  constructor() {}
  async create(url, ws) {
    // Youtube VIDEO URL
    if (!url) {
      return ws.send(JSON.stringify({ message: "Aucune URL n'a été fournie" }))
    }

    try {
      // Validate VIDEO's URL
      if (!ytdl.validateURL(url)) {
        return res.status(400).json({ message: "L'URL fournie n'est pas valide", type: 'error' })
      }

      // Get Youtube Video Title
      ws.send(JSON.stringify({ message: "Création d'un identifiant unique...", type: 'pending' }))
      const uniqueID = uuidv4()

      // Download
      const fileStream = fs.createWriteStream(`uploads/${uniqueID}.mp4`)
      ws.send(JSON.stringify({ message: 'Téléchargement de la vidéo...', type: 'pending' }))
      ytdl(url).pipe(fileStream)

      // On Download DONE
      fileStream.on('finish', () => {
        ws.send(
          JSON.stringify({
            message: '✅ Le téléchargement est terminé.',
            type: 'done',
            id: uniqueID,
          }),
        )
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({ message: 'Merci de réessayer ultérieurement' })
    }
  }
  async getPreview(req, res) {
    // Get UUID
    const { uuid } = req.params

    if (!uuid) {
      return res.status(404).json({ message: "L'identifiant de la vidéo n'a pas été trouvé" })
    }
  stackVideos(top, bottom, output) {
    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(top)
        .input(bottom)
        .inputOptions(['-discard', 'nokey'])
        .inputOptions(['-discard', 'nokey'])
        .complexFilter([
          '[0:v]scale=1080:960[top]; [1:v]scale=1080:960[bottom]; [top][bottom]vstack=inputs=2[out]',
        ])
        .outputOptions([
          '-map',
          '[out]', // map video filtrée
          '-map',
          '0:a?', // map audio première entrée (optionnel)
          '-vcodec',
          'libx264',
          '-r',
          '30',
          '-c:a',
          'copy',
        ])
        .output(output)
        .on('start', (cmd) => console.log('▶️ Start:', cmd))
        .on('stderr', (line) => console.log('⚙️ FFmpeg:', line))
        .on('end', () => {
          console.log('✅ Stack terminé')
          resolve()
        })
        .on('error', (err) => {
          console.error('❌ Erreur FFmpeg', err)
          reject(err)
        })
        .run()
    })
  }

    // Video Path
    const path = `uploads/${uuid}.mp4`
    if (!fs.existsSync(path)) {
      return res.status(404).json({ message: "Aucune vidéo n'a été trouvée avec cet identifiant" })
  async getAllSecondaryVideos(req, res) {
    const DIRECTORY_PATH = 'video/'

    const folders = fs
      .readdirSync(DIRECTORY_PATH, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)

    const Videos = []
    // foreach folders, get image with metadata
    for (const folder of folders) {
      const currentFolderPath = path.join(DIRECTORY_PATH, folder)

      try {
        const metadata = JSON.parse(fs.readFileSync(path.join(currentFolderPath, 'metadata.json')))

        Videos.push({
          coverURL: `${process.env.HOST}:${process.env.PORT}/videos/${folder}/cover.png`,
          metadata,
        })
      } catch (err) {
        console.error('Erreur lors de lecture du fichier', err)
      }
    }

    // Get FIRST 10 seconds of the video
    const outputPath = `uploads/${uuid}-preview.mp4`
    ffmpeg(path)
      .setStartTime(0)
      .setDuration(10)
      .output(outputPath)
      .on('end', () => {
        // Is video existing
        if (!fs.existsSync(outputPath)) {
          return res.status(404).send('Vidéo non trouvée')
        }

        const stat = fs.statSync(outputPath)
        const fileSize = stat.size
        const range = req.headers.range

        if (range) {
          const parts = range.replace(/bytes=/, '').split('-')
          const start = parseInt(parts[0], 10)
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1

          if (start >= fileSize) {
            res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize)
            return
          }

          const chunksize = end - start + 1
          const file = fs.createReadStream(outputPath, { start, end })

          res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4', // adapte selon ton format
          })

          file.pipe(res)
        } else {
          // Pas de range header, envoie la vidéo entière
          res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
          })
          fs.createReadStream(outputPath).pipe(res)
        }
      })
      .run()
  getSecondaryVideoPathById(id) {
    const index = JSON.parse(fs.readFileSync('video/index.json'))

    for (const vid of index) {
      if (vid.fk === id) {
        return `video/${vid.path}`
      }
    }

    return null
  }
}

export default new VideoController()
