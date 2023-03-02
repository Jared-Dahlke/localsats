import clientPromise from '../../lib/mongodb'

export default async function handler(req, res) {
	try {
		const client = await clientPromise
		const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)

		const posts = await db.collection('posts').find({}).toArray()

		res.json(posts)
	} catch (e) {
		console.error(e)
	}
}
