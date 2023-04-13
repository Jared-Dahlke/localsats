import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import prisma from '@/lib/prisma'

export default async function handler(req, res) {
	try {
		const session = await getServerSession(req, res, authOptions)

		if (!session) {
			res.status(401).json({ error: 'Not authenticated' })
			return
		}
		let post = req.body.post

		if (post.userId !== session?.user?.userId) {
			res.status(401).json({ error: 'Not authorized' })
			return
		}

		const myPosts = await prisma.post.findMany({
			where: {
				userId: post.userId
			}
		})
		if (myPosts.length > 2) {
			res
				.status(401)
				.json({ error: 'You have reached the maximum number of posts' })
			return
		}

		try {
			await prisma.post.create({
				data: {
					lat: post.lat,
					lng: post.lng,
					type: post.type,
					amount: post.amount,
					user: { connect: { userId: post.userId } }
				}
			})
			res.json({
				message: 'Success!'
			})
		} catch (err: any) {
			res.status(500).json({
				message: err?.message
			})
		}
	} catch (e) {
		console.error(e)
	}
}
