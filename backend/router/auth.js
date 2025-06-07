import express from 'express'

// Controller
import AuthController from '../controller/auth.js'

const AuthRouter = express.Router()

// Routes
AuthRouter.post('/register', AuthController.register)

export default AuthRouter
