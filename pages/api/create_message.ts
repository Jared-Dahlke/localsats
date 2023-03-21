import { sendEmail } from '@/lib/sendEmail'
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
		const message = req.body.message

		if (message.fromUserId !== session?.user?.userId) {
			res.status(401).json({ error: 'Not authorized' })
			return
		}

		const client = await clientPromise
		const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
		const result = await db.collection('messages').insertOne(message)
		// send email to toUserId

		const toUser = await db
			.collection('users')
			.findOne({ userId: message.toUserId })
		if (toUser?.email) {
			try {
				await sendEmail({
					toAddress: toUser.email,
					fromAddress: 'notifications@localsats.org',
					subject: 'New message received on localsats.org',
					body: `<div>
										You've received a new message on localsats.org. <a href='https://localsats.org'>Click here to view it</a>
								 </div>`
				})
			} catch (err) {
				console.log('Error sending email', err)
			}
		}

		res.json(result)
	} catch (e) {
		console.error(e)
	}
}
