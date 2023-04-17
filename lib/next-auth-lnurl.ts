import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

interface IProps {
	adapter: NextAuthOptions['adapter']
	getAuthKey: (k1: string) => Promise<any>
	deleteK1: (k1: string) => Promise<void>
	findUserByKey: (key: string) => Promise<any>
	createUser: (key: string) => Promise<any>
}

export const useNextAuthLnurl = ({
	adapter,
	getAuthKey,
	deleteK1,
	findUserByKey,
	createUser
}: IProps) => {
	const nextAuthLnurlOptions: NextAuthOptions = {
		adapter: adapter,
		providers: [
			CredentialsProvider({
				id: 'lnurl',
				name: 'LNURL auth',
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

					await deleteK1(authKey.k1)
					let user = await findUserByKey(authKey.key)

					if (!user) {
						// user = await prisma.user.create({
						// 	data: {
						// 		userId: authKey.key,
						// 		createDate: new Date()
						// 	}
						// })

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

	return { nextAuthLnurlOptions }
}
