import { classNames, getCalendarDate, getNameFromId } from '@/utils/utils'
import { GroupedMessage } from '@/types/types'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useText } from '@/hooks/useText'
export default function Modal({
	setOpen,
	post,
	createPaywall,
	deletePost,
	activeChats,
	openThisChat,
	isCreatingPaywall
}: {
	setOpen: any
	post: any
	createPaywall: any
	deletePost: (id: string) => void
	activeChats: GroupedMessage[]
	openThisChat: (chatPaywallId: string) => void
	isCreatingPaywall: boolean
}) {
	const t = useText()
	const session = useSession()
	const user = session?.data?.user?.userId
	const isMyPost = user === post?.userId

	// we have to set date in a useEffect to avoid hydration errors
	const [postDate, setPostDate] = useState('')
	useEffect(() => {
		setPostDate(getCalendarDate(post?.postedAt))
	}, [post])

	return (
		<div className='modal'>
			<div className='modal-box relative'>
				<button
					onClick={() => setOpen(false)}
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
						<div className='text-md flex'>
							User {getNameFromId(post?.userId)} wants to {post?.type}{' '}
							{post?.amount} bitcoin. Posted {postDate}. {t.orderId}:{' '}
							{getNameFromId(post?.id)}
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
								onClick={() => deletePost(post?.id)}>
								Delete
							</button>

							{activeChats.length > 0 && (
								<div className='mt-6'>
									<p className='mb-2'>
										You already have an open chat for this order
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
								You already have an open chat for this order
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
