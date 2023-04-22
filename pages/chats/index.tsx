import { getServerSession } from 'next-auth'
import React from 'react'
import { Layout } from '@/components/layout'
import { GroupedMessage, MessageType, PostType } from '@/types/types'
import { useMessages } from '@/hooks/useMessages'
import { usePosts } from '@/hooks/usePosts'
import { getOptions } from '@/lib/next-auth-lnurl'
import { lnurlAuthConfig } from '@/lib/lnurlAuthConfig'
import { useRouter } from 'next/router'
import { getNameFromId } from '@/utils/utils'
import Link from 'next/link'

interface IProps {
	user: string
	messages: MessageType[]
}

export default function Chats({ user, messages: initialMessages }: IProps) {
	const { messagesQuery, groupedMessages, createMessageMutation } = useMessages(
		{
			userId: user,
			initialMessages
		}
	)

	const posts = usePosts({ initialPosts: [] })

	return (
		<div className='flex items-center flex-col gap-4 py-16'>
			{!messagesQuery.isLoading &&
			groupedMessages &&
			groupedMessages.length < 1 ? (
				<div className='text-center'>
					<h3 className='mt-2 text-sm font-semibold '>No chats</h3>
					<p className='mt-1 text-sm text-gray-500'>
						Start a chat by clicking on an icon on the{' '}
						<Link className='link' href={'/home'}>
							home page
						</Link>
					</p>
				</div>
			) : (
				<>
					{groupedMessages &&
						groupedMessages.map((messageGroup, personIdx) => {
							const post = posts?.find((p) => p.id === messageGroup.postId)

							return (
								<MessageGroup
									messageGroup={messageGroup}
									post={post}
									user={user}
									key={personIdx}
								/>
							)
						})}
				</>
			)}
		</div>
	)
}
Chats.getLayout = function getLayout(page) {
	return <Layout title='Chats'>{page}</Layout>
}

export const getServerSideProps = async function ({ req, res }) {
	const session = await getServerSession(req, res, getOptions(lnurlAuthConfig))
	const user = session?.user?.userId
	if (!user) {
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		}
	}
	return {
		props: { user }
	}
}

const MessageGroup = ({
	messageGroup,
	post,
	user
}: {
	messageGroup: GroupedMessage
	post: PostType
	user: string
}) => {
	const router = useRouter()
	const otherUserId =
		messageGroup.messages[0].fromUserId === user
			? messageGroup.messages[0].toUserId
			: messageGroup.messages[0].fromUserId
	return (
		<div className='lg:w-3/5 w-full card bg-base-300  shadow-2xl hover:scale-105 transition-all '>
			{messageGroup.hasUnreadMessages && (
				<div className='animate-pulse absolute -top-1 -right-2 flex-none rounded-full bg-green-400/10 p-1 text-green-400'>
					<div className='h-3 w-3 rounded-full bg-current' />
				</div>
			)}

			<div className='card-body'>
				<div className='flex flex-col gap-2 items-start'>
					<div className='card-title'>
						Chat Id: {getNameFromId(messageGroup.chatPaywallId)}
					</div>
					<div className='card-normal'>Order Id: {getNameFromId(post?.id)}</div>
					<div className='flex flex-col justify-center items-center gap-1'>
						<div className='avatar'>
							<div className='w-12 bg-base-300 rounded-full'>
								<img
									className='rounded-full'
									src={`https://robohash.org/${otherUserId}.png?size=500x500`}
								/>
							</div>
						</div>
						<div className='stat-desc'>{getNameFromId(otherUserId)}</div>
					</div>
				</div>

				<div className='content truncate  my-5'>
					{messageGroup.messages[messageGroup.messages.length - 1].body}
				</div>
				<div className='card-actions'>
					<button
						onClick={() => router.push(`/chats/${messageGroup.chatPaywallId}`)}
						className='btn btn-outline btn-secondary ml-auto'>
						Open
					</button>
				</div>
			</div>
		</div>
	)
}
