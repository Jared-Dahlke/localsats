import clientPromise from '../../lib/mongodb'

export default async function handler(req, res) {
	try {
		const client = await clientPromise
		const db = client.db('BuySellBitcoinInPerson')
		const user = await db.collection('users').insertOne({
			userId: req.body.userId,
			createDate: new Date(),
			email: null
		})
		res.json(user)
	} catch (e) {
		console.error(e)
	}
}
