import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import dayjs from 'dayjs'
import { classNames, getNameFromId, getPostId } from '../utils/utils'
import { GroupedMessage } from '../types/types'
import { useSession } from 'next-auth/react'

export default function Modal({
	open,
	setOpen,
	post,
	createPaywall,
	deletePost,
	activeChats,
	openThisChat,
	isCreatingPaywall
}: {
	open: boolean
	setOpen: any
	post: any
	createPaywall: any
	deletePost: (id: string) => void
	activeChats: GroupedMessage[]
	openThisChat: (chatPaywallId: string) => void
	isCreatingPaywall: boolean
}) {
	const session = useSession()
	const user = session?.data?.user?.userId
	const isMyPost = user === post?.userId
	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as='div' className='relative z-10' onClose={setOpen}>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'>
					<div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
				</Transition.Child>

				<div className='fixed inset-0 z-10 overflow-y-auto'>
					<div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
							enterTo='opacity-100 translate-y-0 sm:scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 translate-y-0 sm:scale-100'
							leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
							<Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6'>
								<div>
									<div className='text-center'>
										<Dialog.Title
											as='h3'
											className='text-lg font-medium leading-6 text-gray-900'></Dialog.Title>

										<div className='text-sm text-gray-500 flex'>
											User {getNameFromId(post?.userId)} wants to {post?.type}{' '}
											{post?.amount} bitcoin. Posted{' '}
											{dayjs(post?.postedAt).format('MMMM D, YYYY h:mm A')}.
											Post ID: {getPostId(post?._id)}
										</div>
									</div>
								</div>
								<div className='mt-5 sm:mt-6 text-center'>
									{isMyPost ? (
										<div>
											<p className='mb-2'>This is your post</p>
											<button
												type='button'
												className='inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm'
												onClick={() => deletePost(post?._id)}>
												Delete
											</button>

											{activeChats.length > 0 && (
												<div className='mt-6'>
													<p className='mb-2'>
														You already have an open chat for this post
													</p>
													<div className='flex flex-col gap-2'>
														{activeChats.map((chat) => (
															<div key={chat.chatPaywallId}>
																<button
																	type='button'
																	className='inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm'
																	onClick={() =>
																		openThisChat(chat.chatPaywallId)
																	}>
																	Open chat with user{' '}
																	{chat.messages[0].fromUserId === user
																		? getNameFromId(chat.messages[0].toUserId)
																		: getNameFromId(
																				chat.messages[0].fromUserId
																		  )}
																</button>
															</div>
														))}
													</div>
												</div>
											)}
										</div>
									) : activeChats.length > 0 ? (
										<div>
											<p className='mb-4'>
												You already have an open chat for this post
											</p>
											<div className='flex flex-col gap-2'>
												{activeChats.map((chat) => (
													<div key={chat.chatPaywallId}>
														<button
															type='button'
															className='inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm'
															onClick={() => openThisChat(chat.chatPaywallId)}>
															Open chat with user{' '}
															{chat.messages[0].fromUserId === user
																? getNameFromId(chat.messages[0].toUserId)
																: getNameFromId(chat.messages[0].fromUserId)}
														</button>
													</div>
												))}
											</div>
										</div>
									) : (
										<button
											disabled={isCreatingPaywall}
											type='button'
											className={classNames(
												isCreatingPaywall ? 'cursor-wait' : '',
												'inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm'
											)}
											onClick={createPaywall}>
											Chat with this user
										</button>
									)}
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}
