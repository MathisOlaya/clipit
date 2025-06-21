// Prisma DB
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class AuthController {
  async register(req, res) {
    if (!req.body) {
      return res.status(404).json({ message: 'Merci de rentrer tous les champs' })
    }

    // Creds
    const { mail, password } = req.body

    if (!mail || !password) {
      return res.status(404).json({ message: 'Merci de rentrer tous les champs' })
    }

    try {
      const account = await prisma.user.findFirst({ where: { mail } })

      if (account) {
        return res.status(400).json({ message: 'Un compte existe déjà avec cette adresse mail' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      //Create account
      const user = await prisma.user.create({
        data: {
          mail,
          password: hashedPassword,
          subscription: {
            create: {
              role: 'BASIC',
            },
          },
        },
      })

      // Generate JWT
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

      // Save it to cookies
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      return res.status(200).json({ message: 'Compte créer avec succès' })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'Veuillez réessayer utlérieurement' })
    }
  }

  async login(req, res) {
    if (!req.body) {
      return res.status(404).json({ message: 'Merci de rentrer tous les champs' })
    }

    // Creds
    const { mail, password } = req.body

    try {
      const user = await prisma.user.findFirst({
        where: {
          mail,
        },
      })

      if (!user) {
        return res.status(404).json({ message: "L'email ou le mot de passe est incorrect" })
      }

      const result = await bcrypt.compare(password, user.password)

      if (!result) {
        return res.status(404).json({ message: "L'email ou le mot de passe est incorrect" })
      }

      // Generate JWT
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

      // Save it to cookies
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      return res.status(200).json({ message: 'Succès' })
    } catch {
      return res.status(500).json({ message: 'Veuillez réessayer utlérieurement' })
    }
  }

  async me(req, res) {
    const token = req.cookies.token

    if (!token) return res.status(401).json({ error: 'Non authentifié' })

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
      return res.status(200).json({ message: 'Ok' })
    } catch (err) {
      res.status(401).json({ error: 'Token invalide' })
      console.error(err)
    }
  }
}

export default new AuthController()
