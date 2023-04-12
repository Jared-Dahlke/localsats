import prisma from '@/lib/prisma'

export const getMessagesCount = async () => {
	const messages = await prisma.message.findMany()
	return messages?.length
}

export default async function handler(req, res) {
	try {
		const messagesCount = await getMessagesCount()
		res.json(messagesCount)
	} catch (e) {
		console.error(e)
	}
}
