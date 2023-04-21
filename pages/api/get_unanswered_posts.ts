import prisma from '@/lib/prisma'

export const getPostsToDelete = async () => {
	const posts = await prisma.post.findMany({
		include: {
			chatPaywalls: {
				include: {
					messages: true
				}
			}
		}
	})

	let postsToDelete = []

	posts.forEach((post) => {
		post.chatPaywalls.forEach((chatPaywall) => {
			const messagesFromPoster = chatPaywall.messages.filter((message) => {
				return (
					message.postId === chatPaywall.postId &&
					message.fromUserId === chatPaywall.recipientUserId
				)
			})
			if (
				messagesFromPoster.length === 0 &&
				chatPaywall.createdAt <
					new Date().getTime() - 1000 * 60 * 60 * 24 * 7 &&
				!postsToDelete.includes(post.id)
			) {
				postsToDelete.push(post.id)
			}
		})
	})

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
