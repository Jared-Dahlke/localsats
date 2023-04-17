import { useText } from '@/hooks/useText'
import { getServerSession } from 'next-auth'
import React from 'react'
import { Layout } from '@/components/layout'
import { handleLogout } from '@/utils/utils'
import { authOptions } from './api/auth/[...nextauth]'
import { MessageType } from '@/types/types'
import { useMessages } from '@/hooks/useMessages'
import { usePosts } from '@/hooks/usePosts'
import { Messages as MessagesComponent } from '@/components/messages'
import { ChatSlideOver } from '@/components/chatSlideOver'
import axios from 'axios'
import { encryptMessage } from '@/lib/pgp'
import { useDatabaseUser } from '@/hooks/useDatabaseUser'

interface IProps {
	user: string

	messages: MessageType[]
}

export default function Messages({ user, messages: initialMessages }: IProps) {
	const { messagesQuery, groupedMessages, createMessageMutation } = useMessages(
		{
			userId: user,
			initialMessages
		}
	)
	const userFromDatabase = useDatabaseUser({ userId: user })

	const messages = messagesQuery?.data
	const posts = usePosts({ initialPosts: [] })
	const [openChatPaywallId, setOpenChatPaywallId] = React.useState<
		string | null
	>(null)
	const openMessages =
		messages?.filter((m) => m.chatPaywallId === openChatPaywallId) || []
	const t = useText()
	return (
		<div className='h-screen flex items-center flex-col gap-16 break-all text-center'>
			{groupedMessages && groupedMessages.length > 0 && (
				<MessagesComponent
					messages={groupedMessages}
					setOpenChatPaywallId={setOpenChatPaywallId}
					posts={posts}
				/>
			)}

			<ChatSlideOver
				open={!!openChatPaywallId}
				setOpen={setOpenChatPaywallId}
				messages={openMessages}
				isSendingMessage={createMessageMutation.isLoading}
				createMessageMutation={async (body: string) => {
					if (!openChatPaywallId || !body) return

					const toUserId =
						openMessages[0].fromUserId === user
							? openMessages[0].toUserId
							: openMessages[0].fromUserId

					const toUser = await axios.post('/api/get_user', {
						userId: toUserId
					})

					const toUserPgpPublicKey = toUser.data.pgpPublicKey

					const publicKeyArmored = toUserPgpPublicKey
					const myPublicKeyArmored = userFromDatabase?.data?.data?.pgpPublicKey

					let finalMessage = body
					if (publicKeyArmored && myPublicKeyArmored) {
						finalMessage = await encryptMessage({
							publicKey1: publicKeyArmored,
							publicKey2: myPublicKeyArmored,
							message: body
						})
					}

					const message: Omit<MessageType, '_id'> = {
						body: finalMessage,
						fromUserId: user,
						toUserId,
						postId: openMessages[0].postId,
						seen: false,
						sentDate: new Date(),
						chatPaywallId: openMessages[0].chatPaywallId
					}
					createMessageMutation.mutate(message)
				}}
			/>
		</div>
	)
}
Messages.getLayout = function getLayout(page) {
	return <Layout title='Messages'>{page}</Layout>
}

export const getServerSideProps = async function ({ req, res }) {
	const session = await getServerSession(req, res, authOptions)
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
