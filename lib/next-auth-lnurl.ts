import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

interface lnurlAuthKey {
	id: string
	k1: string
	key: string | null
}
export interface LnurlProps {
	adapter: NextAuthOptions['adapter']
	getAuthKey: (k1: string) => Promise<lnurlAuthKey | null>
	deleteK1: (k1: string) => Promise<void>
	findUserByKey: (key: string) => Promise<any>
	createUser: (key: string) => Promise<any>
}

export const getOptions = ({
	adapter,
	getAuthKey,
	deleteK1,
	findUserByKey,
	createUser
}: LnurlProps) => {
	const nextAuthLnurlOptions: NextAuthOptions = {
		adapter: adapter,
		providers: [
			CredentialsProvider({
				id: 'lnurl',
				name: 'LNURL auth',
				credentials: {
					k1: { type: 'text' }
				},
				// this gets called on login
				async authorize(credentials) {
					if (!credentials) {
						return null
					}

					// get record from lnurlAuthKey table based off of k1
					const authKey = await getAuthKey(credentials.k1)
					if (!authKey || !authKey.key) {
						console.error('no auth key on login')
						return null
					}
					// now delete that record since we now have it stored in the authKey variable
					await deleteK1(authKey.k1)
					// find user by key (key is the userId in the user table)
					let user = await findUserByKey(authKey.key)

					// if no user, create user
					if (!user) {
						user = await createUser(authKey.key)
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
					user: token.user as any
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
	return nextAuthLnurlOptions
}
