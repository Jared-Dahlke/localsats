import prisma from '@/lib/prisma'

export default async function handler(req, res) {
	try {
		const chatPaywall = await prisma.chatPaywalls.findMany({
			where: {
				userId: req.body.userId,
				postId: req.body.postId,
				recipientUserId: req.body.recipientUserId
			}
		})

		res.json(chatPaywall)
	} catch (e) {
		console.error(e)
	}
}
