import prisma from '@/lib/prisma'
import clientPromise from '@/lib/mongodb'

export default async function handler(req, res) {
	try {
		const client = await clientPromise
		const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
		const chatPaywalls = await db.collection('chatPaywalls').find({}).toArray()

		res.json(chatPaywalls)
	} catch (e) {
		console.error(e)
	}
}
