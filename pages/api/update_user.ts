import clientPromise from '../../lib/mongodb'
import { database } from './util'

export default async function handler(req, res) {
	try {
		const client = await clientPromise
		const db = client.db(database)
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
