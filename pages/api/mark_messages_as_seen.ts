import prisma from '@/lib/prisma'

export default async function handler(req, res) {
	try {
		if (!req.body.data) return
		const { toUserId, fromUserId, postId } = req.body.data

		const result = await prisma.message.updateMany({
			where: {
				toUserId: toUserId,
				fromUserId: fromUserId,
				postId: postId
			},
			data: {
				seen: true
			}
		})

		res.json(result)
	} catch (e) {
		console.error(e)
	}
}
