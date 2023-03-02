import React, { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { UserCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { getNameFromId, getPostId } from '../utils/utils'
import { MessageType } from '../types/types'
import Axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { rqKeys } from '../constants'
import { useSession } from 'next-auth/react'

const RecipientMessage = ({ message }: { message: string }) => {
	return (
		<div className='chat-message'>
			<div className='flex items-end'>
				<div className='flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start'>
					<div>
						<span className='px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600'>
							{message}
						</span>
					</div>
				</div>
				<div className='w-6 h-6 rounded-full order-1 bg-slate-300'>
					<UserCircleIcon className='w-6 h-6 text-white' />
				</div>
			</div>
		</div>
	)
}

const YourMessage = ({ message }: { message: string }) => {
	return (
		<div className='chat-message'>
			<div className='flex items-end justify-end'>
				<div className='flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end'>
					<div>
						<span className='px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white '>
							{message}
						</span>
					</div>
				</div>
				<div className='w-6 h-6 rounded-full order-1 bg-blue-500'>
					<UserCircleIcon className='w-6 h-6 text-white' />
				</div>
			</div>
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

	React.useEffect(() => {
		if (!messages || !open || messages.length < 1) return
		markMessagesAsSeen()
	}, [messages, open])

	React.useEffect(() => {
		if (!open) {
			queryClient.invalidateQueries(rqKeys.messagesKey())
		}
	}, [open])

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as='div' className='relative z-10' onClose={setOpen}>
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
									<div className='flex h-full flex-col justify-between  bg-white py-3 shadow-xl'>
										{/* header */}
										<div className='px-4 sm:px-6 py-6 flex-none grow-1'>
											<div className='flex items-start justify-between'>
												<Dialog.Title className='text-lg font-medium text-gray-900'>
													Chat about postId:{' '}
													{messages ? getPostId(messages[0]?.postId) : ''} with
													user{' '}
													{messages[0]?.toUserId === user
														? getNameFromId(messages[0]?.fromUserId)
														: getNameFromId(messages[0]?.toUserId)}
												</Dialog.Title>
												<div className='ml-3 flex h-7 items-center'>
													<button
														type='button'
														className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
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
											className='flex flex-col space-y-4 px-3 py-6 h-full overflow-y-auto '>
											{messages &&
												messages.map((message) => {
													const fromMe = message.fromUserId === user
													return fromMe ? (
														<YourMessage
															key={message._id}
															message={message.body}
														/>
													) : (
														<RecipientMessage
															key={message._id}
															message={message.body}
														/>
													)
												})}
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
	return (
		<div className='grow-1 items-start space-x-4 p-3'>
			<div className='min-w-0 flex-1'>
				<div className='relative'>
					<div className='overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500'>
						<label htmlFor='comment' className='sr-only'>
							Send a message
						</label>
						<textarea
							rows={3}
							name='comment'
							id='comment'
							className='block w-full resize-none border-0 py-3 focus:ring-0 sm:text-sm'
							placeholder='Send a message...'
							onChange={(e) => setMessage(e.target.value)}
							autoFocus
							value={message}
						/>

						{/* Spacer element to match the height of the toolbar */}
						<div className='py-2' aria-hidden='true'>
							{/* Matches height of button in toolbar (1px border + 36px content height) */}
							<div className='py-px'>
								<div className='h-9' />
							</div>
						</div>
					</div>

					<div className='absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2'>
						<div className='flex items-center space-x-5'>
							<div className='flex items-center'></div>
						</div>
						<div className='flex-shrink-0'>
							<button
								onClick={() => {
									const messageCopy = JSON.parse(JSON.stringify(message))
									createMessageMutation(messageCopy)
									setMessage('')
								}}
								className='inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
								Post
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
