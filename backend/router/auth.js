import express from 'express'

// Controller
import AuthController from '../controller/auth.js'

const AuthRouter = express.Router()

// Routes
AuthRouter.post('/register', AuthController.register)
AuthRouter.post('/login', AuthController.login)
AuthRouter.get('/me', AuthController.me)

export default AuthRouter
