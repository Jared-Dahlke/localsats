import { getServerSession } from 'next-auth'
import clientPromise from '../../lib/mongodb'
import { authOptions } from './auth/[...nextauth]'

export default async function handler(req, res) {
	try {
		const session = await getServerSession(req, res, authOptions)

		if (!session) {
			res.status(401).json({ error: 'Not authenticated' })
			return
		}
		if (req.body.userId !== session?.user?.userId) {
			res.status(401).json({ error: 'Not authorized' })
			return
		}
		const client = await clientPromise
		const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
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
