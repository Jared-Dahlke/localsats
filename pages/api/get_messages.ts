import clientPromise from '../../lib/mongodb'
import { database } from './util'

export default async function handler(req, res) {
	try {
		const client = await clientPromise
		const db = client.db(database)
		const messages = await db
			.collection('messages')
			.find({
				$or: [{ toUserId: req.body.userId }, { fromUserId: req.body.userId }]
			})
			.sort({ sentDate: 1 })
			.toArray()

		res.json(messages)
	} catch (e) {
		console.error(e)
	}
}
