import clientPromise from '../../lib/mongodb'
import { database } from './util'

export default async function handler(req, res) {
	try {
		let post = req.body.post
		const client = await clientPromise
		const db = client.db(database)
		const result = await db.collection('posts').insertOne(post)
		res.json(result)
	} catch (e) {
		console.error(e)
	}
}