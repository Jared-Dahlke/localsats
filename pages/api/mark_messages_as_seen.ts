import clientPromise from '../../lib/mongodb'
import { database } from './util'

export default async function handler(req, res) {
	try {
		if (!req.body.data) return
		const { toUserId, fromUserId, postId } = req.body.data
		const client = await clientPromise
		const db = client.db(database)
		const result = await db
			.collection('messages')
			.updateMany({ toUserId, fromUserId, postId }, { $set: { seen: true } })
		res.json(result)
	} catch (e) {
		console.error(e)
	}
}
