import clientPromise from '../../lib/mongodb'
import { database } from './util'
require('dotenv').config()

export async function getPosts() {
	try {
		const client = await clientPromise
		const db = client.db(database)

		const posts = await db.collection('posts').find({}).toArray()
		return posts
	} catch (e) {
		console.error(e)
	}
}

export default async function handler(req, res) {
	try {
		const posts = await getPosts()
		res.json(posts)
	} catch (e) {
		console.error(e)
	}
}
