import prisma from '@/lib/prisma'

export const getPosts = async () => {
	const posts = await prisma.post.findMany({
		include: {
			user: true,
			chatPaywalls: true
		},
		orderBy: {
			postedAt: 'desc'
		}
	})
	return posts
}

export default async function handler(req, res) {
	try {
		const posts = await getPosts()

		res.json(posts)
	} catch (e) {
		console.error(e)
	}
}
