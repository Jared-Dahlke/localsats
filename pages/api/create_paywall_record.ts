// creates paywall record in db
import clientPromise from '../../lib/mongodb'
import { database } from './util'

export default async function handler(req, res) {
	try {
		let paywall = req.body.paywall
		const client = await clientPromise
		const db = client.db(database)
		const result = await db.collection('chatPaywalls').insertOne(paywall)
		res.json(result.insertedId)
	} catch (e) {
		console.error(e)
	}
}
