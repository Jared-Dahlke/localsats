import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import dayjs from 'dayjs'
import { classNames, getNameFromId, getPostId } from '../utils/utils'
import { GroupedMessage } from '../types/types'
import { useSession } from 'next-auth/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

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
		<div className='modal'>
			<div className='modal-box relative'>
				<button
					onClick={() => setOpen(false)}
					//absolute right-4 top-4 z-20
					className='btn btn-sm btn-circle btn-outline absolute right-2 top-2'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-6 w-6'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							d='M6 18L18 6M6 6l12 12'
						/>
					</svg>
				</button>

				<section className='py-6'>
					<div className='text-center'>
						<div className='text-sm text-gray-500 flex'>
							User {getNameFromId(post?.userId)} wants to {post?.type}{' '}
							{post?.amount} bitcoin. Posted{' '}
							{dayjs(post?.postedAt).format('MMMM D, YYYY h:mm A')}. Post ID:{' '}
							{getPostId(post?._id)}
						</div>
					</div>
				</section>

				<div className='mt-5 sm:mt-6 text-center'>
					{isMyPost ? (
						<div>
							<p className='mb-2'>This is your post</p>
							<button
								type='button'
								className='btn-primary btn btn-error btn-block'
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
													className='btn btn-primary btn-block'
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
											className='btn btn-primary btn-block'
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
								isCreatingPaywall ? 'loading' : '',
								'btn btn-primary btn-block'
							)}
							onClick={createPaywall}>
							Chat with this user
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
