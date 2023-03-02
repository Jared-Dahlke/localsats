// creates paywall record in db
import clientPromise from '../../lib/mongodb'

export default async function handler(req, res) {
	try {
		let paywall = req.body.paywall
		const client = await clientPromise
		const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
		const result = await db.collection('chatPaywalls').insertOne(paywall)
		res.json(result.insertedId)
	} catch (e) {
		console.error(e)
	}
}
