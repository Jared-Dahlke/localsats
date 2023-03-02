import clientPromise from '../../lib/mongodb'

export default async function handler(req, res) {
	try {
		let post = req.body.post
		const client = await clientPromise
		const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
		const result = await db.collection('posts').insertOne(post)
		res.json(result)
	} catch (e) {
		console.error(e)
	}
}
