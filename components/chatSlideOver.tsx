import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { UserCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { getCalendarDate, getNameFromId, getPostId } from '@/utils/utils'
import { MessageType } from '@/types/types'
import Axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { rqKeys } from '@/constants'
import { useSession } from 'next-auth/react'

const RecipientMessage = ({
	message,
	sentDate
}: {
	message: string
	sentDate: Date
}) => {
	return (
		<div className='chat chat-start'>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<UserCircleIcon className='w-8 h-8' />
				</div>
			</div>
			<div className='chat-header'>
				Other user
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
	sentDate
}: {
	message: string
	sentDate: Date
}) => {
	return (
		<div className='chat chat-end'>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<UserCircleIcon className='w-8 h-8' />
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

interface ChatSlideOverProps {
	messages: MessageType[]
	open: boolean
	setOpen: any
	createMessageMutation: any
}

export function ChatSlideOver({
	messages,
	open,
	setOpen,
	createMessageMutation
}: ChatSlideOverProps) {
	const session = useSession()
	const user = session?.data?.user?.userId
	const queryClient = useQueryClient()
	const markMessagesAsSeen = async () => {
		await Axios.post('/api/mark_messages_as_seen', {
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
	}, [messages])

	useEffect(() => {
		if (!messages || !open || messages.length < 1) return
		markMessagesAsSeen()
	}, [messages, open])

	useEffect(() => {
		if (!open) {
			queryClient.invalidateQueries(rqKeys.messagesKey())
		}
	}, [open])

	const otherPartyUserId =
		messages[0]?.toUserId === user
			? messages[0]?.fromUserId
			: messages[0]?.toUserId

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as='div' className='relative z-20' onClose={setOpen}>
				<div className='fixed inset-0' />

				<div className='fixed inset-0 overflow-hidden'>
					<div className='absolute inset-0 overflow-hidden'>
						<div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full w-full'>
							<Transition.Child
								as={Fragment}
								enter='transform transition ease-in-out duration-500 sm:duration-700'
								enterFrom='translate-x-full'
								enterTo='translate-x-0'
								leave='transform transition ease-in-out duration-500 sm:duration-700'
								leaveFrom='translate-x-0'
								leaveTo='translate-x-full'>
								<Dialog.Panel className='pointer-events-auto w-full'>
									<div className='flex h-full flex-col justify-between bg-base-100 pb-0 shadow-xl'>
										{/* header */}
										<div className='px-4 sm:px-6 py-6 flex-none grow-1 bg-base-200 h-32'>
											<div className='text-sm text-base-content justify-center flex w-full items-center flex-col gap-1 relative'>
												<img
													className='h-12 w-12 rounded-full bg-base-100'
													src={`https://robohash.org/${otherPartyUserId}.png?size=500x500`}
													alt=''
												/>
												{getNameFromId(otherPartyUserId)}

												<div className='absolute top-0 left-0 prose'>
													<h2 className='mb-0'>Chat</h2>
													<h3 className='text-primary mb-0'>
														PostID:{' '}
														{messages ? getPostId(messages[0]?.postId) : ''}
													</h3>
													{/* <button className='btn btn-xs btn-outline'>
														Report this user
													</button> */}
												</div>

												<div className='absolute top-0 right-0'>
													<button
														type='button'
														className='btn btn-ghost btn-square'
														onClick={() => setOpen(false)}>
														<span className='sr-only'>Close panel</span>
														<XMarkIcon className='h-6 w-6' aria-hidden='true' />
													</button>
												</div>
											</div>
										</div>

										{/* messages */}
										<div
											id='messages'
											className='flex flex-col space-y-12 px-3 py-6 h-full overflow-y-auto '>
											{messages &&
												messages.map((message) => {
													const fromMe = message.fromUserId === user
													return fromMe ? (
														<YourMessage
															key={message._id}
															message={message.body}
															sentDate={message.sentDate}
														/>
													) : (
														<RecipientMessage
															key={message._id}
															message={message.body}
															sentDate={message.sentDate}
														/>
													)
												})}
											<div ref={messagesEndRef} />
										</div>

										{/* input */}
										<TextBox createMessageMutation={createMessageMutation} />
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

const TextBox = ({ createMessageMutation }: { createMessageMutation: any }) => {
	const [message, setMessage] = useState('')
	const sendMessage = () => {
		const messageCopy = JSON.parse(JSON.stringify(message))
		createMessageMutation(messageCopy)
		setMessage('')
	}
	return (
		<div className='grow-1 items-start space-x-4 p-3  bg-base-200'>
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
									sendMessage()
								}
							}}
						/>
					</div>

					<div className='flex justify-between py-2 pl-3 pr-2'>
						<div className='flex items-center space-x-5'>
							<div className='flex items-center'></div>
						</div>
						<div className='flex-shrink-0'>
							<button onClick={sendMessage} className='btn btn-primary '>
								Send
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
