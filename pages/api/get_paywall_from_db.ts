import clientPromise from '../../lib/mongodb'
import { database } from './util'

export default async function handler(req, res) {
	try {
		const client = await clientPromise
		const db = client.db(database)

		const chatPaywall = await db
			.collection('chatPaywalls')
			.find({
				userId: req.body.userId,
				postId: req.body.postId,
				recipientUserId: req.body.recipientUserId
			})
			.toArray()

		res.json(chatPaywall)
	} catch (e) {
		console.error(e)
	}
}
