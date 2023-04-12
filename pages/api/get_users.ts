import prisma from '@/lib/prisma'

export const getUsers = async () => {
	const users = await prisma.user.findMany()
	return users
}

export default async function handler(req, res) {
	try {
		const users = await getUsers()
		res.json(users)
	} catch (e) {
		console.error(e)
	}
}
