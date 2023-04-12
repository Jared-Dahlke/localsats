import prisma from '@/lib/prisma'

export default async function handler(req, res) {
	try {
		const users = await prisma.user.findMany({
			select: {
				createDate: true,
				id: true,
				mongoId: true,
				pgpPrivateKeyEncrypted: true,
				pgpPublicKey: true,
				seenWelcome: true,
				updatedPrivateKeysDate: true,
				userId: true
			}
		})

		const posts = await prisma.post.findMany()
		const chatPaywalls = await prisma.chatPaywalls.findMany()

		const dataDump = {
			users,
			posts,
			chatPaywalls
		}

		res.json(dataDump)
		return res.status(200).json({})
	} catch (e) {
		console.error(e)
	}
}
