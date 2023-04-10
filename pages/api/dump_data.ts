import clientPromise from '@/../lib/mongodb'

export default async function handler(req, res) {
	try {
		const client = await clientPromise
		const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)

		const users = await db
			.collection('users')
			.find({}, { projection: { email: 0 } })
			.toArray()

		const posts = await db.collection('posts').find({}).toArray()

		const chatPaywalls = await db.collection('chatPaywalls').find({}).toArray()

		const dataDump = {
			users,
			posts,
			chatPaywalls
		}

		res.json(dataDump)
		return res.status(200).json({})
	} catch (e) {
		console.error(e)
	}
}
