import clientPromise from '../../lib/mongodb'
import { database } from './util'

export async function getMessages(userId: string) {
	const client = await clientPromise
	const db = client.db(database)
	const messages = await db
		.collection('messages')
		.find({
			$or: [{ toUserId: userId }, { fromUserId: userId }]
		})
		.sort({ sentDate: 1 })
		.toArray()

	return messages
}

export default async function handler(req, res) {
	try {
		const messages = await getMessages(req.body.userId)
		res.json(messages)
	} catch (e) {
		console.error(e)
	}
}
