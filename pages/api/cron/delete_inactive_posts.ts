import clientPromise from '@/lib/mongodb'
import { sendEmail } from '@/lib/sendEmail'
import { NextRequest, NextResponse } from 'next/server'
import { getPosts } from '../get_posts'

export const config = {
	runtime: 'edge'
}

export default async function handler(req: NextRequest) {
	// get all chatPaywalls:
	const client = await clientPromise
	const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
	const chatPaywalls = await db.collection('chatPaywalls').find({}).toArray()

	// get all messages

	const messages = await db.collection('messages').find({}).toArray()

	// for each chatPaywall, check if poster has sent a message. If not, if the chat was started over 7 days ago, then delete the chatPaywall.
	const chatPaywallsToDelete = chatPaywalls.filter((chatPaywall) => {
		const messagesFromPoster = messages.filter((message) => {
			return (
				message.postId === chatPaywall.postId &&
				message.fromUserId === chatPaywall.recipientUserId
			)
		})
		return (
			messagesFromPoster.length === 0
			//&&
			//chatPaywall.createdAt < new Date().getTime()
			//chatPaywall.createdAt < new Date().getTime() - 1000 * 60 * 60 * 24 * 7 // 7 days
		)
	})

	// get a list of postIds from chatPaywallsToDelete
	const postIdsToDelete = chatPaywallsToDelete.map((chatPaywall) => {
		return chatPaywall.postId
	})

	await sendEmail({
		toAddress: 'jared.dahlke@protonmail.com',
		fromAddress: 'notifications@localsats.org',
		subject: 'New message received on localsats.org',
		body: `<div>
              proposing to delete these posts due to poster not responding: ${JSON.stringify(
								postIdsToDelete
							)}
           </div>`
	})

	// delete posts  in postIdsToDelete

	// const deleted = await db.collection('posts').deleteMany({ _id: { $in: postIdsToDelete } })

	// delete chatPaywalls in chatPaywallsToDelete
	// await db.collection('chatPaywalls').deleteMany({ _id: { $in: chatPaywallsToDelete.map((chatPaywall) => {
	//   return chatPaywall._id
	//}) } })

	// delete messages in postIdsToDelete
	// await db.collection('messages').deleteMany({ postId: { $in: postIdsToDelete } })

	// console.log('deleted',deleted)

	return new NextResponse(JSON.stringify(deleted), {
		status: 200
	})
}
