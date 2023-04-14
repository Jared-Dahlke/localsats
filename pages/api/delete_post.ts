import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import prisma from '@/lib/prisma'

export default async function handler(req, res) {
	const session = await getServerSession(req, res, authOptions)
	const postId = req.body.id
	if (!session) {
		res.status(401).json({ error: 'Not authenticated' })
		return
	}

	//confirm postId belongs to user
	const posts = await prisma.post.findMany({
		where: {
			userId: session?.user?.userId,
			id: postId
		}
	})

	if (posts.length !== 1) {
		res.status(401).json({ error: 'Not authorized' })
		return
	}

	try {
		// mark post and its messages as deleted
		await prisma.message.updateMany({
			where: { postId },
			data: { deletedDate: new Date() }
		})
		await prisma.chatPaywalls.updateMany({
			where: { postId },
			data: { deletedDate: new Date() }
		})
		const result = await prisma.post.update({
			where: {
				id: postId
			},
			data: { deletedDate: new Date() }
		})

		res.json(result)
	} catch (e) {
		console.error(e)
	}
}
