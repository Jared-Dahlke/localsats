import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { LnurlProps } from './next-auth-lnurl'

const prisma = new PrismaClient()

export const lnurlAuthConfig: LnurlProps = {
	adapter: PrismaAdapter(prisma),
	getAuthKey: async (k1: string) => {
		const authKey = await prisma.lnurlAuthKey.findUnique({
			where: {
				k1: k1
			}
		})

		if (!authKey || authKey === null) {
			return null
		}
		return authKey
	},
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
}
