import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import prisma from '@/lib/prisma'

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

		const user = await prisma.user.update({
			where: {
				userId: req.body.userId
			},
			data: {
				seenWelcome: true
			}
		})

		res.json(user)
	} catch (e) {
		console.error(e)
	}
}
