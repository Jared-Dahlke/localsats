import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth'
import clientPromise from '../../lib/mongodb'
import { authOptions } from './auth/[...nextauth]'

export default async function handler(req, res) {
	const session = await getServerSession(req, res, authOptions)
	if (!session) {
		res.status(401).json({ error: 'Not authenticated' })
		return
	}
	try {
		let postId = req.body.id
		const client = await clientPromise
		const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
		const result = await db
			.collection('posts')
			.deleteOne({ _id: new ObjectId(postId) })

		await db.collection('messages').deleteMany({ postId })
		await db.collection('chatPaywalls').deleteMany({ postId })

		res.json(result)
	} catch (e) {
		console.error(e)
	}
}
