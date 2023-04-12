import prisma from '@/lib/prisma'

export default async function handler(req, res) {
	try {
		const messages = await prisma.message.findMany()
		res.json(messages)
	} catch (e) {
		console.error(e)
	}
}
