import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import prisma from '@/lib/prisma'

export default async function handler(req, res) {
	const session = await getServerSession(req, res, authOptions)

	if (!session) {
		res.status(401).json({ error: 'Not authenticated' })
		return
	}
	try {
		let postId = req.body.id
		const result = await prisma.post.deleteMany({
			where: {
				id: postId,
				userId: session?.user?.userId
			}
		})

		if (result.count !== 1) {
			res.status(401).json({ error: 'Not authorized' })
			return
		}
		await prisma.message.deleteMany({ where: { postId } })
		await prisma.chatPaywalls.deleteMany({ where: { postId } })

		res.json(result)
	} catch (e) {
		console.error(e)
	}
}
