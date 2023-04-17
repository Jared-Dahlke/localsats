import { getAuthKey } from 'lib/lnurl/getAuthKey'
import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { useNextAuthLnurl } from '@/lib/next-auth-lnurl'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			id: 'lnurl',
			// The name to display on the sign in form (e.g. 'Sign in with...')
			name: 'LNURL auth',
			// The credentials is used to generate a suitable form on the sign in page.
			// You can specify whatever fields you are expecting to be submitted.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				k1: { type: 'text' }
			},
			async authorize(credentials) {
				if (!credentials) {
					return null
				}

				const authKey = await getAuthKey(credentials.k1)
				if (!authKey || !authKey.key) {
					return null
				}

				await prisma.lnurlAuthKey.deleteMany({
					where: {
						k1: authKey.k1
					}
				})

				let user = await prisma.user.findUnique({
					where: {
						userId: authKey.key
					}
				})

				if (!user) {
					user = await prisma.user.create({
						data: {
							userId: authKey.key,
							createDate: new Date()
						}
					})

					user.userId = authKey.key
				}

				return user
			}
		})
	],
	callbacks: {
		session: async ({ session, token }) => {
			return Promise.resolve({
				...session,
				user: token.user as User
			})
		},
		jwt: async ({ token, user }) => {
			if (user) {
				// on login / new user creation
				token.user = user
			}
			return token
		}
	},
	debug: false,
	pages: {
		signIn: '/home'
	},
	session: { strategy: 'jwt' }
}

export default (req: NextApiRequest, res: NextApiResponse) => {
	const { nextAuthLnurlOptions } = useNextAuthLnurl({
		adapter: PrismaAdapter(prisma),
		getAuthKey: getAuthKey,
		deleteK1: async (k1: string) => {
			await prisma.lnurlAuthKey.deleteMany({
				where: {
					k1: k1
				}
			})
		},
		findUserByKey: async (key: string) => {
			const user = await prisma.user.findUnique({
				where: {
					userId: key
				}
			})
			return user
		},
		createUser: async (key: string) =>
			await prisma.user.create({
				data: {
					userId: key,
					createDate: new Date()
				}
			})
	})
	return NextAuth(req, res, nextAuthLnurlOptions)
}
