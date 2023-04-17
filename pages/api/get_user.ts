import prisma from '@/lib/prisma'

export const getUser = async (userId) => {
	const user = await prisma.user.findUnique({
		where: {
			userId: userId
		},
		include: {
			chatPaywalls: true
		}
	})

	return user
}

export default async function handler(req, res) {
	try {
		const user = await getUser(req.body.userId)
		res.json(user)
	} catch (e) {
		console.error(e)
	}
}
