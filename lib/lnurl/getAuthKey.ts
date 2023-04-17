import prisma from '../prisma'

export async function getAuthKey(k1: string) {
	const authKey = await prisma.lnurlAuthKey.findUnique({
		where: {
			k1: k1
		}
	})

	if (!authKey) {
		return null
	}
	return authKey
}
