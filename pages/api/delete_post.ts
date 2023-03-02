import { ObjectId } from 'mongodb'
import clientPromise from '../../lib/mongodb'

export default async function handler(req, res) {
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
