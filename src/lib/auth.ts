import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { getDomainFromHeaders } from './server-utils'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const email = credentials.email as string
          const password = credentials.password as string

          const user = await prisma.user.findUnique({
            where: { email },
            include: { tenant: true }
          })

          if (!user) {
            return null
          }

          const domain = await getDomainFromHeaders()
          
          // User must belong to the tenant domain they are trying to login
          if (user.tenant.subdomain !== domain) {
            return null
          }

          const isValid = await bcrypt.compare(password, user.password)

          if (!isValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            tenantId: user.tenantId
          }
        } catch {
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/admin',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.tenantId = (user as any).tenantId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as any).tenantId = token.tenantId as string
      }
      return session
    },
  },
})
