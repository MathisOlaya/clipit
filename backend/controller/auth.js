// Prisma DB
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import bcrypt from 'bcrypt'

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
      await prisma.user.create({
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

      return res.status(200).json({ message: 'Compte créer avec succès' })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'Veuillez réessayer utlérieurement' })
    }
  }
}

export default new AuthController()
