import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { authConfig } from "@/auth/config"
import { loginSchema } from "@/validations/auth"
import { sendWelcomeEmail } from "@/lib/mail"

export const { handlers, auth, signIn } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  providers: [
    ...authConfig.providers,
    Credentials({
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const email = parsed.data.email.trim().toLowerCase()
        const { password } = parsed.data

        const user = await db.user.findUnique({ where: { email } })
        if (!user || !user.password) return null

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) return null

        return { id: user.id, name: user.name, email: user.email, image: user.image }
      },
    }),
    Credentials({
      id: "demo",
      credentials: { secret: {} },
      authorize: async (credentials) => {
        const secret = process.env.DEMO_LOGIN_SECRET
        if (!secret || credentials?.secret !== secret) return null

        const demoEmail = process.env.DEMO_USER_EMAIL
        if (!demoEmail) return null

        const user = await db.user.findUnique({
          where: { email: demoEmail.trim().toLowerCase() },
          select: { id: true, name: true, email: true, image: true },
        })

        if (!user) return null
        return { id: user.id, name: user.name, email: user.email, image: user.image }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session: sessionData }) {
      if (user) token.id = user.id
      if (trigger === 'update' && sessionData) {
        if (sessionData.name) token.name = sessionData.name as string
        if (sessionData.image) token.picture = sessionData.image as string
      }
      return token
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string
      if (token.picture) session.user.image = token.picture as string
      return session
    },
  },
  events: {
    async createUser({ user }) {
      const email = user.email?.trim().toLowerCase()
      if (!email) return

      const name = user.name?.trim() || "there"
      void sendWelcomeEmail({ name, email }).catch((error) => {
        console.error("welcome_email_failed", {
          event: "welcome_email_failed",
          reason: "nextauth_create_user_event",
          to: email,
          error,
        })
      })
    },
  },
})
