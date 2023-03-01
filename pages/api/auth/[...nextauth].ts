import clientPromise from '@/lib/mongodb'
//import { PrismaAdapter } from '@next-auth/prisma-adapter'
//import { User } from '@prisma/client'
import { getAuthKey } from 'lib/lnurl/getAuthKey'
import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'

//const adapter = PrismaAdapter(prisma)
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
				console.log('authorize', credentials)
				// console.log("LNURL AUTH", credentials?.k1);
				if (!credentials) {
					return null
				}

				const authKey = await getAuthKey(credentials.k1)
				// console.log("AUTH KEY", authKey);
				if (!authKey || !authKey.key) {
					return null
				}
				console.log('here2', authKey)
				// auth key has been used already, so delete it
				const client = await clientPromise
				const db = client.db('authtest')
				await db.collection('lnurlAuthKey').deleteOne({
					k1: credentials.k1
				})

				// await prisma.lnurlAuthKey.delete({
				// 	where: {
				// 		k1: authKey.k1
				// 	}
				// })

				let user = await db.collection('User').findOne({
					lnurlPublicKey: authKey.key
				})

				// let user = await prisma.user.findUnique({
				// 	where: {
				// 		lnurlPublicKey: authKey.key
				// 	}
				// })

				if (!user) {
					if (authKey.linkUserId) {
						user = await db.collection('User').findOne({
							id: authKey.linkUserId
						})

						// user = await prisma.user.findUnique({
						// 	where: {
						// 		id: authKey.linkUserId
						// 	}
						// })
						if (!user) {
							throw new Error(
								'User to link does not exist: ' + authKey.linkUserId
							)
						} else {
							await db
								.collection('User')
								.updateOne(
									{ id: user.id },
									{ $set: { lnurlPublicKey: authKey.key } }
								)

							// await prisma.user.update({
							// 	where: {
							// 		id: user.id
							// 	},
							// 	data: {
							// 		lnurlPublicKey: authKey.key
							// 	}
							// })
						}
					} else {
						user = await db.collection('User').insertOne({
							lnurlPublicKey: authKey.key,
							locale: credentials.locale
						})

						// user = await prisma.user.create({
						// 	data: {
						// 		lnurlPublicKey: authKey.key,
						// 		locale: credentials.locale
						// 	}
						// })
					}
				}
				return user
			}
		})
	],
	callbacks: {
		session: async ({ session, token }) => {
			// console.log("session.session", session, "session.token", token);
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
		signIn: '/dashboard' // PageRoutes.dashboard
	},
	session: { strategy: 'jwt' }
}

const nextAuthFunc = (req: NextApiRequest, res: NextApiResponse) =>
	NextAuth(req, res, authOptions)
export default nextAuthFunc
