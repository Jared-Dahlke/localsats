import { sendEmail } from '@/lib/sendEmail'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getPostsToDelete } from '../get_unanswered_posts'

export default async function handler(req: NextRequest) {
	const postIdsToDelete = await getPostsToDelete()

	await prisma.message.deleteMany({
		where: {
			postId: {
				in: postIdsToDelete
			}
		}
	})

	await prisma.chatPaywalls.deleteMany({
		where: {
			postId: {
				in: postIdsToDelete
			}
		}
	})

	await prisma.post.deleteMany({
		where: {
			id: {
				in: postIdsToDelete
			}
		}
	})

	await sendEmail({
		toAddress: 'jared.dahlke@protonmail.com',
		fromAddress: 'notifications@localsats.org',
		subject: 'deleted orders from localsats.org',
		body: `<div>
              these were deleted due to poster not responding: ${JSON.stringify(
								postIdsToDelete
							)}
           </div>`
	})

	// todo: delete the posts and associated data

	return new NextResponse(JSON.stringify({ test: 'sent' }), {
		status: 200
	})
}
