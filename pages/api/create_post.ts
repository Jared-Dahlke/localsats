import { getServerSession } from 'next-auth'
import clientPromise from '../../lib/mongodb'
import { authOptions } from './auth/[...nextauth]'

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

		const client = await clientPromise
		const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)

		const myPosts = await db
			.collection('posts')
			.find({ userId: post.userId })
			.toArray()
		if (myPosts.length > 2) {
			res
				.status(401)
				.json({ error: 'You have reached the maximum number of posts' })
			return
		}

		const result = await db.collection('posts').insertOne(post)
		res.json(result)
	} catch (e) {
		console.error(e)
	}
}
