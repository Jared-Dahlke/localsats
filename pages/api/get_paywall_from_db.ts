import clientPromise from '../../lib/mongodb'

export default async function handler(req, res) {
	try {
		const client = await clientPromise
		const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)

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
