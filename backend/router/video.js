import express from 'express'
import VideoController from '../controller/video.js'

const VideoRouter = express.Router()

VideoRouter.get('/:uuid/preview', VideoController.getPreview)
VideoRouter.get('/secondary', VideoController.getAllSecondaryVideos)

export default VideoRouter
