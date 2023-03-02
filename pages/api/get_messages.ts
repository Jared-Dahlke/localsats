import clientPromise from '../../lib/mongodb'

export default async function handler(req, res) {
	try {
		const client = await clientPromise
		const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
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
