import prisma from '@/lib/prisma'

export default async function handler(req, res) {
	try {
		const chatPaywalls = await prisma.chatPaywalls.findMany()
		res.json(chatPaywalls)
	} catch (e) {
		console.error(e)
	}
}
