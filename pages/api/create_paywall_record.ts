// creates paywall record in db
import prisma from '@/lib/prisma'

export default async function handler(req, res) {
	try {
		let paywall = req.body.paywall
		const result = await prisma.chatPaywalls.create({
			data: paywall
		})
		res.json(result.id)
	} catch (e) {
		console.error(e)
	}
}
