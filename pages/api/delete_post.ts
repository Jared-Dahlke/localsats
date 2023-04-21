import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { getOptions } from '@/lib/next-auth-lnurl'
import { lnurlAuthConfig } from '@/lib/lnurlAuthConfig'

export default async function handler(req, res) {
	const session = await getServerSession(req, res, getOptions(lnurlAuthConfig))
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
		await prisma.message.deleteMany({
			where: { postId }
		})
		await prisma.chatPaywalls.deleteMany({
			where: { postId }
		})
		const result = await prisma.post.deleteMany({
			where: {
				id: postId
			}
		})

		res.json(result)
	} catch (e) {
		console.error(e)
	}
}
