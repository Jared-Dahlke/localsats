import prisma from '@/lib/prisma'

export const getPostsToDelete = async () => {
	// for every post, loop through all of its messages and find the posts where the poster never sent a message

	const posts = await prisma.post.findMany({
		include: {
			messages: true
		},
		where: {
			messages: {
				some: {}
			}
		}
	})

	// find the posts where poster never sent a message
	const postsToDelete = posts
		.filter((post) => {
			const messages = post.messages
			const posterMessage = messages.find((message) => {
				return message.fromUserId === post.userId
			})
			//14 days in milliseconds, no e

			// if no poster message and the first message is more than 14 days old
			if (!posterMessage && messages[0].sentDate < Date.now() - 1209600000) {
				return true
			}
			return false
		})
		.map((p) => p.id)

	return postsToDelete
}

export default async function handler(req, res) {
	try {
		const posts = await getPostsToDelete()

		res.json(posts)
	} catch (e) {
		console.error(e)
	}
}
