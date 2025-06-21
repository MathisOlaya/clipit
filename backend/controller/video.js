import ytdl from '@distube/ytdl-core'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'

// FFMPEG
import ffmpeg from 'fluent-ffmpeg'
import staticFfmpeg from 'ffmpeg-static'

// FFMPEG Config
ffmpeg.setFfmpegPath(staticFfmpeg)

class VideoController {
  constructor() {}
  async create(url, videoID, cuttingTime, ws) {
    // Youtube VIDEO URL
    if (!url) {
      return ws.send(JSON.stringify({ message: "Aucune URL n'a été fournie" }))
    }

    try {
      // Validate VIDEO's URL
      if (!ytdl.validateURL(url)) {
        return ws.send(JSON.stringify({ message: "L'URL fournie n'est pas valide", type: 'error' }))
      }

      // Get Youtube Video Title
      ws.send(JSON.stringify({ message: "Création d'un identifiant unique...", type: 'pending' }))
      const uniqueID = uuidv4()

      // Get video informations
      ws.send(
        JSON.stringify({ message: 'Obtention des informations de la vidéo...', type: 'pending' }),
      )
      const data = await ytdl.getBasicInfo(url)
      const basicInfo = {
        title: data.videoDetails.title,
        cover: data.videoDetails.thumbnails[data.videoDetails.thumbnails.length - 1].url,
      }

      // Download
      const fileStream = fs.createWriteStream(`uploads/${uniqueID}.mp4`)
      ws.send(
        JSON.stringify({
          message: 'Téléchargement de la vidéo...',
          type: 'pending',
          videoData: basicInfo,
        }),
      )
      ytdl(url).pipe(fileStream)

      // On Download DONE
      fileStream.on('finish', async () => {
        // Stack both videos
        ws.send(JSON.stringify({ message: 'Empilage des 2 vidéos...', type: 'pending' }))
        await this.stackVideos(
          `uploads/${uniqueID}.mp4`,
          this.getSecondaryVideoPathById(videoID),
          `full/${uniqueID}.mp4`,
        )

        // Cut video in multiple part
        ws.send(JSON.stringify({ message: 'Découpage de la vidéo...', type: 'pending' }))
        this.cutVideoIntoParts(cuttingTime, uniqueID, ws)

        // // Get preview
        ws.send(JSON.stringify({ message: "Création d'une prévisualisation...", type: 'pending' }))
        const previewURL = await this.getPreview(uniqueID)

        ws.send(
          JSON.stringify({
            message: '✅ La vidéo est prête.',
            type: 'done',
            id: uniqueID,
            previewURL,
          }),
        )
      })
    } catch (err) {
      console.log(err)
      return ws.send(
        JSON.stringify({ message: 'Merci de réessayer ultérieurement', type: 'error' }),
      )
    }
  }
  getPreview(uuid) {
    return new Promise((resolve, reject) => {
      const path = `full/${uuid}.mp4`
      const outputPath = `previews/${uuid}-preview.mp4`

      if (!fs.existsSync(path)) {
        return reject(new Error("Aucune vidéo n'a été trouvée avec cet identifiant"))
      }

      ffmpeg(path)
        .setStartTime(0)
        .setDuration(10)
        .output(outputPath)
        .on('end', () => {
          if (!fs.existsSync(outputPath)) {
            return reject(new Error('Vidéo de preview non trouvée'))
          }
          resolve(`http://${process.env.HOST}:${process.env.PORT}/${outputPath}`)
        })
        .on('error', (err) => {
          reject(err)
        })
        .run()
    })
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

  async cutVideoIntoParts(segmentDuration, uuid, ws) {
    try {
      fs.mkdirSync(`final/${uuid}`)

      const metadata = await new Promise((resolve, reject) => {
        ffmpeg.ffprobe(`full/${uuid}.mp4`, (err, data) => {
          if (err) return reject(err)
          resolve(data)
        })
      })

      const totalDuration = Math.floor(metadata.format.duration)
      const segmentCount = Math.ceil(totalDuration / segmentDuration)

      const cutPromises = []

      for (let i = 0; i < segmentCount; i++) {
        const start = i * segmentDuration
        const outPutPath = path.join(`final/${uuid}/📹 Clip It - Partie ${i + 1}.mp4`)

        ws.send(
          JSON.stringify({
            message: `Découpage de la vidéo... ${i + 1} / ${segmentCount}`,
            type: 'pending',
          }),
        )

        const cutPromise = new Promise((resolve, reject) => {
          ffmpeg(`full/${uuid}.mp4`)
            .setStartTime(start)
            .setDuration(segmentDuration)
            .output(outPutPath)
            .on('end', resolve)
            .on('error', () => {
              // Send WS Error
              ws.send(JSON.stringify({ message: 'Une erreur est survenue.', type: 'error' }))
              reject
            })
            .run()
        })

        cutPromises.push(cutPromise)
      }

      await Promise.all(cutPromises)
    } catch (error) {
      console.error(error)
      ws.send(JSON.stringify({ message: 'Merci de réessayer ultérieurement', type: 'error' }))
    }
  }

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
          coverURL: `http://${process.env.HOST}:${process.env.PORT}/videos/${folder}/cover.png`,
          metadata,
        })
      } catch (err) {
        console.error('Erreur lors de lecture du fichier', err)
      }
    }

    return res.status(200).json({ videos: Videos })
  }

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
