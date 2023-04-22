import { useText } from '@/hooks/useText'
import { getServerSession } from 'next-auth'
import React, { useEffect, useRef, useState } from 'react'
import { Layout } from '@/components/layout'
import { getCalendarDate, getNameFromId } from '@/utils/utils'
import { getOptions } from '@/lib/next-auth-lnurl'
import { lnurlAuthConfig } from '@/lib/lnurlAuthConfig'
import { GetServerSideProps } from 'next'
import { getMessages } from '../api/get_messages'
import { getCookie } from 'cookies-next'
import { MessageType } from '@/types/types'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { useMessages } from '@/hooks/useMessages'
import { encryptMessage } from '@/lib/pgp'
import { useDatabaseUser } from '@/hooks/useDatabaseUser'
import prisma from '@/lib/prisma'
import { differenceInDays } from 'date-fns'

export default function Chat({
	user,
	messages: initialMessages,
	chatPaywallId,
	chatIsDeleted
}: {
	user: string
	messages: MessageType[]
	chatPaywallId: string
	chatIsDeleted: boolean
}) {
	const t = useText()
	const userFromDatabase = useDatabaseUser({ userId: user })

	const { messagesQuery, groupedMessages, createMessageMutation } = useMessages(
		{
			userId: user,
			initialMessages
		}
	)
	const messages =
		messagesQuery?.data?.filter((m) => m.chatPaywallId === chatPaywallId) || []

	const markMessagesAsSeen = async () => {
		await axios.post('/api/mark_messages_as_seen', {
			data: {
				postId: messages[0].postId,
				toUserId: user,
				fromUserId:
					messages[0].fromUserId === user
						? messages[0].toUserId
						: messages[0].fromUserId
			}
		})
	}

	const messagesEndRef = useRef(null)
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(() => {
		scrollToBottom()
		if (!messages || !open || messages.length < 1) return
		markMessagesAsSeen()
	}, [messages])

	const otherPartyUserId =
		messages[0]?.toUserId === user
			? messages[0]?.fromUserId
			: messages[0]?.toUserId

	const sendMessage = async (body: string) => {
		if (!body) return

		const toUserId =
			messages[0].fromUserId === user
				? messages[0].toUserId
				: messages[0].fromUserId

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
			postId: messages[0].postId,
			seen: false,
			sentDate: new Date(),
			chatPaywallId: messages[0].chatPaywallId
		}
		createMessageMutation.mutate(message)
	}

	if (chatIsDeleted) {
		return <div>The order for this chat has been deleted.</div>
	}

	return (
		<div className='flex h-full flex-col justify-between  pb-0 '>
			<div className='bg-base-200 flex  justify-between  w-full items-center relative p-3 rounded-lg'>
				<div className='w-1/3 h-full '>
					<h3 className='mb-0'>
						{t.orderId} {messages ? getNameFromId(messages[0]?.postId) : ''}
					</h3>
				</div>
				<div className='w-1/3 flex flex-col gap-1 items-center justify-center h-full'>
					<img
						className='h-12 w-12 rounded-full bg-base-100'
						src={`https://robohash.org/${otherPartyUserId}.png?size=500x500`}
						alt=''
					/>
					<div className='stat-desc'>{getNameFromId(otherPartyUserId)}</div>
				</div>
				<div className='w-1/3 h-full flex justify-end items-center'></div>
			</div>

			<div
				id='messages'
				className='flex flex-col space-y-12 px-3 py-6 h-full overflow-y-auto '>
				{messages &&
					messages.map((message) => {
						const fromMe = message.fromUserId === user
						return fromMe ? (
							<YourMessage
								key={message.id}
								message={message.body}
								sentDate={message.sentDate}
								userId={user}
							/>
						) : (
							<RecipientMessage
								key={message.id}
								message={message.body}
								sentDate={message.sentDate}
								userId={otherPartyUserId}
							/>
						)
					})}
				<div ref={messagesEndRef} />
			</div>

			<TextBox
				sendMessage={sendMessage}
				isSendingMessage={createMessageMutation.isLoading}
			/>
		</div>
	)
}

Chat.getLayout = function getLayout(page) {
	const chatPaywallId = page.props.children.props.chatPaywallId
	return (
		<Layout
			title='Chat'
			breadCrumbs={[
				{ name: 'Home', href: '/home' },
				{ name: 'Chats', href: '/chats' },
				{ name: getNameFromId(chatPaywallId)!, href: '' }
			]}>
			{page}
		</Layout>
	)
}

export const getServerSideProps: GetServerSideProps<any> = async function ({
	req,
	res,
	query
}) {
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

	const chatPaywallId = query.chatPaywallId

	if (typeof chatPaywallId === 'string') {
		//handle if chat is deleted

		// get chatpaywall
		const chat = await prisma.chatPaywalls.findUnique({
			where: {
				id: chatPaywallId
			}
		})
		if (!chat) {
			return {
				props: {
					user,
					messages: [],
					chatPaywallId,
					chatIsDeleted: true,
					posterHasResponded: false,
					daysSinceChatCreated: 0
				}
			}
		}

		const privateKeyPassphrase = getCookie('privateKeyPassphrase', {
			req,
			res
		})
		const allMyMessages = await getMessages(user, privateKeyPassphrase)
		const messages =
			allMyMessages?.filter((m) => m.chatPaywallId === chatPaywallId) || []

		return {
			props: {
				user,
				messages: JSON.parse(JSON.stringify(messages)),
				chatPaywallId,
				chatIsDeleted: false
			}
		}
	} else {
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		}
	}
}

const RecipientMessage = ({
	message,
	sentDate,
	userId
}: {
	message: string
	sentDate: Date
	userId: string
}) => {
	return (
		<div className='chat chat-start'>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img
						src={`https://robohash.org/${userId}.png?size=500x500`}
						className='w-8 h-8 bg-base-300'
					/>
				</div>
			</div>
			<div className='chat-header'>
				{getNameFromId(userId)}
				<time className='text-xs opacity-50 ml-2'>
					{getCalendarDate(sentDate)}
				</time>
			</div>
			<div className='chat-bubble'>{message}</div>
			<div className='chat-footer opacity-50'>Delivered</div>
		</div>
	)
}

const YourMessage = ({
	message,
	sentDate,
	userId
}: {
	message: string
	sentDate: Date
	userId: string
}) => {
	return (
		<div className='chat chat-end'>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img
						src={`https://robohash.org/${userId}.png?size=500x500`}
						className='w-8 h-8 bg-base-300'
					/>
				</div>
			</div>
			<div className='chat-header'>
				You
				<time className='text-xs opacity-50 ml-2'>
					{getCalendarDate(sentDate)}
				</time>
			</div>
			<div className='chat-bubble chat-bubble-primary'>{message}</div>
			<div className='chat-footer opacity-50'>Delivered</div>
		</div>
	)
}

const TextBox = ({
	isSendingMessage,
	sendMessage
}: {
	sendMessage: (message: string) => void
	isSendingMessage: boolean
}) => {
	const [message, setMessage] = useState('')
	const handleSendMessage = () => {
		const messageCopy = JSON.parse(JSON.stringify(message))
		sendMessage(messageCopy)
		setMessage('')
	}

	return (
		<div className='grow-1 items-start space-x-4 p-3  bg-base-200 rounded-lg'>
			<div className='min-w-0 flex-1'>
				<div className='relative'>
					<div className='overflow-hidden rounded-lg   '>
						<label htmlFor='comment' className='sr-only'>
							Send a message
						</label>
						<textarea
							rows={3}
							name='comment'
							id='comment'
							className='textarea border-base-300 block w-full resize-none py-3  bg-base-100 text-lg'
							placeholder='Send a message...'
							onChange={(e) => setMessage(e.target.value)}
							autoFocus
							value={message}
							onKeyUp={(e) => {
								if (e.key === 'Enter') {
									handleSendMessage()
								}
							}}
						/>
					</div>

					<div className='flex justify-between py-2 pl-3 pr-2'>
						<div className='flex items-center space-x-5'>
							<div className='flex items-center'></div>
						</div>
						<div className='flex-shrink-0'>
							<button
								disabled={isSendingMessage}
								onClick={handleSendMessage}
								className='btn btn-primary '>
								Send
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
