import { sendEmail } from '@/lib/sendEmail'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export default async function handler(req: NextRequest) {
	// get all chatPaywalls:

	const chatPaywalls = await prisma.chatPaywalls.findMany()

	// get all messages
	const messages = await prisma.message.findMany()

	// for each chatPaywall, check if poster has sent a message. If not, if the chat was started over 7 days ago, then delete the chatPaywall.
	const chatPaywallsToDelete = chatPaywalls.filter((chatPaywall) => {
		const messagesFromPoster = messages.filter((message) => {
			return (
				message.postId === chatPaywall.postId &&
				message.fromUserId === chatPaywall.recipientUserId
			)
		})
		return (
			messagesFromPoster.length === 0 &&
			chatPaywall.createdAt < new Date().getTime() - 1000 * 60 * 60 * 24 * 3 // 3 days
		)
	})

	// get a list of postIds from chatPaywallsToDelete
	const postIdsToDelete = chatPaywallsToDelete.map((chatPaywall) => {
		return chatPaywall.postId
	})

	await sendEmail({
		toAddress: 'jared.dahlke@protonmail.com',
		fromAddress: 'notifications@localsats.org',
		subject: 'delete proposal from localsats.org',
		body: `<div>
              proposing to delete these posts due to poster not responding: ${JSON.stringify(
								postIdsToDelete
							)}
           </div>`
	})

	// todo: delete the posts and associated data

	return new NextResponse(JSON.stringify({ test: 'sent' }), {
		status: 200
	})
}
