import clientPromise from '@/lib/mongodb'
import { getAuthKey } from 'lib/lnurl/getAuthKey'
import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import axios from 'axios'
import { addPgpToUser } from '../add_pgp_to_user'

export const authOptions: NextAuthOptions = {
	adapter: MongoDBAdapter(clientPromise),
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
				k1: { type: 'text' },
				locale: { type: 'text' }
			},
			async authorize(credentials) {
				if (!credentials) {
					return null
				}

				const authKey = await getAuthKey(credentials.k1)
				if (!authKey || !authKey.key) {
					return null
				}
				// auth key has been used already, so delete it
				const client = await clientPromise
				const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
				await db.collection('lnurlAuthKey').deleteMany({
					k1: authKey.k1
				})

				let user = await db.collection('users').findOne({
					userId: authKey.key
				})

				if (!user) {
					user = await db.collection('users').insertOne({
						userId: authKey.key,
						locale: credentials.locale,
						createDate: new Date(),
						seenWelcome: false
					})
					user.userId = authKey.key
					delete user.acknowledged
					delete user.insertedId
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
		signIn: '/home' // PageRoutes.dashboard
	},
	session: { strategy: 'jwt' }
}

const nextAuthFunc = (req: NextApiRequest, res: NextApiResponse) =>
	NextAuth(req, res, authOptions)
export default nextAuthFunc
