import clientPromise from '../../lib/mongodb'
import { database } from './util'

export default async function handler(req, res) {
	try {
		const client = await clientPromise
		const db = client.db(database)

		const posts = await db.collection('posts').find({}).toArray()

		res.json(posts)
	} catch (e) {
		console.error(e)
	}
}
