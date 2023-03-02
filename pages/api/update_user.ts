import clientPromise from '../../lib/mongodb'

export default async function handler(req, res) {
	try {
		const client = await clientPromise
		const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
		const user = await db.collection('users').updateOne(
			{ userId: req.body.userId },
			{
				$set: {
					email: req.body.email
				}
			}
		)

		res.json(user)
	} catch (e) {
		console.error(e)
	}
}
