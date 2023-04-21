import { sendEmail } from '@/lib/sendEmail'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { getOptions } from '@/lib/next-auth-lnurl'
import { lnurlAuthConfig } from '@/lib/lnurlAuthConfig'

export default async function handler(req, res) {
	try {
		const session = await getServerSession(
			req,
			res,
			getOptions(lnurlAuthConfig)
		)

		if (!session) {
			res.status(401).json({ error: 'Not authenticated' })
			return
		}
		const message = req.body.message

		if (message.fromUserId !== session?.user?.userId) {
			res.status(401).json({ error: 'Not authorized' })
			return
		}

		const result = await prisma.message.create({
			data: message
		})

		const toUser = await prisma.user.findUnique({
			where: {
				userId: message.toUserId
			}
		})

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
				console.error('Error sending email', err)
			}
		}

		res.json(result)
	} catch (e) {
		console.error(e)
	}
}
