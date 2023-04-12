import prisma from '../prisma'

export async function getAuthKey(k1: string) {
	// const result = await db.collection('lnurlAuthKey').deleteMany({
	// 	created: {
	// 		$lt: sub(new Date(), {
	// 			minutes: 5
	// 		})
	// 	}
	// })

	// const authKey = await db.collection('lnurlAuthKey').findOne({
	// 	k1: k1 as string
	// })

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
