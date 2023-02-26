import React from 'react'
import GoogleMapReact from 'google-map-react'
import Modal from './modal'
import axios from 'axios'
import NewPostModal from './newPostModal'
import { useQueryClient } from '@tanstack/react-query'
import { MyPosts } from './myPosts'
import { Messages } from './messages'
import { useMessages } from '../hooks/useMessages'
import QrCodeModal from './qrCodeModal'
import { useCheckInvoiceStatus } from '../hooks/useCheckInvoiceStatus'
import { SuccessAlert } from './successAlert'
import { ChatSlideOver } from './chatSlideOver'
import { MessageType, PaywallRecordType, PostType } from '../types/types'
import {
	CheckCircleIcon,
	InformationCircleIcon
} from '@heroicons/react/20/solid'
import { NewPostSuccessModal } from './newPostSuccessModal'
import { rqKeys } from '../constants'
import { usePosts } from '../hooks/usePosts'

const MarkerComponent = ({
	id,
	userId,
	type,
	amount,
	postedAt,
	setOpenId,
	lat,
	lng
}: {
	id: string
	userId: string
	type: string
	amount: number
	postedAt: string
	setOpenId: (id: string) => void
	lat: number
	lng: number
}) =>
	type === 'buy' ? (
		<svg
			onClick={() => {
				setOpenId(id)
			}}
			style={{
				zIndex: 999999,
				cursor: 'pointer',
				border: '3px solid red',
				borderRadius: 45,
				padding: 5
			}}
			height={30}
			fill='green'
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 512 512'>
			<path d='M320 96H192L144.6 24.9C137.5 14.2 145.1 0 157.9 0H354.1c12.8 0 20.4 14.2 13.3 24.9L320 96zM192 128H320c3.8 2.5 8.1 5.3 13 8.4C389.7 172.7 512 250.9 512 416c0 53-43 96-96 96H96c-53 0-96-43-96-96C0 250.9 122.3 172.7 179 136.4l0 0 0 0c4.8-3.1 9.2-5.9 13-8.4zm84 88c0-11-9-20-20-20s-20 9-20 20v14c-7.6 1.7-15.2 4.4-22.2 8.5c-13.9 8.3-25.9 22.8-25.8 43.9c.1 20.3 12 33.1 24.7 40.7c11 6.6 24.7 10.8 35.6 14l1.7 .5c12.6 3.8 21.8 6.8 28 10.7c5.1 3.2 5.8 5.4 5.9 8.2c.1 5-1.8 8-5.9 10.5c-5 3.1-12.9 5-21.4 4.7c-11.1-.4-21.5-3.9-35.1-8.5c-2.3-.8-4.7-1.6-7.2-2.4c-10.5-3.5-21.8 2.2-25.3 12.6s2.2 21.8 12.6 25.3c1.9 .6 4 1.3 6.1 2.1l0 0 0 0c8.3 2.9 17.9 6.2 28.2 8.4V424c0 11 9 20 20 20s20-9 20-20V410.2c8-1.7 16-4.5 23.2-9c14.3-8.9 25.1-24.1 24.8-45c-.3-20.3-11.7-33.4-24.6-41.6c-11.5-7.2-25.9-11.6-37.1-15l0 0-.7-.2c-12.8-3.9-21.9-6.7-28.3-10.5c-5.2-3.1-5.3-4.9-5.3-6.7c0-3.7 1.4-6.5 6.2-9.3c5.4-3.2 13.6-5.1 21.5-5c9.6 .1 20.2 2.2 31.2 5.2c10.7 2.8 21.6-3.5 24.5-14.2s-3.5-21.6-14.2-24.5c-6.5-1.7-13.7-3.4-21.1-4.7V216z' />
		</svg>
	) : (
		<svg
			style={{
				zIndex: 999999,
				cursor: 'pointer',
				border: '3px solid red',
				borderRadius: 45,
				padding: 5
			}}
			onClick={() => {
				setOpenId(id)
			}}
			height={30}
			fill='orange'
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 512 512'>
			<path d='M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zm-141.651-35.33c4.937-32.999-20.191-50.739-54.55-62.573l11.146-44.702-27.213-6.781-10.851 43.524c-7.154-1.783-14.502-3.464-21.803-5.13l10.929-43.81-27.198-6.781-11.153 44.686c-5.922-1.349-11.735-2.682-17.377-4.084l.031-.14-37.53-9.37-7.239 29.062s20.191 4.627 19.765 4.913c11.022 2.751 13.014 10.044 12.68 15.825l-12.696 50.925c.76.194 1.744.473 2.829.907-.907-.225-1.876-.473-2.876-.713l-17.796 71.338c-1.349 3.348-4.767 8.37-12.471 6.464.271.395-19.78-4.937-19.78-4.937l-13.51 31.147 35.414 8.827c6.588 1.651 13.045 3.379 19.4 5.006l-11.262 45.213 27.182 6.781 11.153-44.733a1038.209 1038.209 0 0 0 21.687 5.627l-11.115 44.523 27.213 6.781 11.262-45.128c46.404 8.781 81.299 5.239 95.986-36.727 11.836-33.79-.589-53.281-25.004-65.991 17.78-4.098 31.174-15.792 34.747-39.949zm-62.177 87.179c-8.41 33.79-65.308 15.523-83.755 10.943l14.944-59.899c18.446 4.603 77.6 13.717 68.811 48.956zm8.417-87.667c-7.673 30.736-55.031 15.12-70.393 11.292l13.548-54.327c15.363 3.828 64.836 10.973 56.845 43.035z' />
		</svg>
	)

export default function SimpleMap({
	user,
	posts: initialPosts,
	messages: initialMessages
}: {
	user: string
	posts: PostType[]
	messages: MessageType[]
}) {
	const queryClient = useQueryClient()
	const [showPaymentSuccess, setShowPaymentSuccess] = React.useState(false)
	const [showQr, setShowQr] = React.useState(false)
	const [openId, setOpenId] = React.useState(null)
	const [newPost, setNewPost] = React.useState(null)
	const [pendingInvoice, setPendingInvoice] = React.useState(null)
	const [openChatPaywallId, setOpenChatPaywallId] = React.useState<
		string | null
	>(null)
	const [showOnlyMyPosts, setShowOnlyMyPosts] = React.useState(false)
	const [showNewPostSuccess, setShowNewPostSuccess] = React.useState(false)
	const [isCreatingPaywall, setIsCreatingPaywall] = React.useState(false)

	const invoiceStatus = useCheckInvoiceStatus({
		paywallId: pendingInvoice?.paywallId,
		paymentHash: pendingInvoice?.paymentHash
	})

	React.useEffect(() => {
		if (invoiceStatus?.data?.data?.paid) {
			handleInvoicePaid()
		}
	}, [invoiceStatus?.data?.data?.paid])

	const posts = usePosts({ initialPosts })
	const myPosts = posts?.filter((post: PostType) => post.userId === user)
	const openPost = posts?.find((post: PostType) => post._id === openId)

	const { messagesQuery, groupedMessages, createMessageMutation } = useMessages(
		{
			userId: user,
			initialMessages
		}
	)

	const messages = messagesQuery?.data

	const postsWithNewMessages = groupedMessages?.filter(
		(message) => message?.hasUnreadMessages
	)

	const handleInvoicePaid = async () => {
		setShowPaymentSuccess(true)
		const paywallRecord: Omit<PaywallRecordType, '_id'> = {
			userId: user,
			postId: openPost?._id,
			recipientUserId: openPost?.userId,
			createdAt: new Date()
		}
		const newPaywallId = await axios.post('/api/create_paywall_record', {
			paywall: paywallRecord
		})
		setOpenId(null)
		setShowQr(false)
		setPendingInvoice(null)

		// insert new initial message here
		const newMessage: Omit<MessageType, '_id'> = {
			chatPaywallId: newPaywallId.data,
			body: 'Hi! I would like to chat with you about your post.',
			postId: openPost?._id,
			fromUserId: user,
			toUserId: openPost?.userId,
			seen: false,
			sentDate: new Date()
		}
		createMessageMutation.mutate(newMessage)

		setOpenChatPaywallId(newPaywallId.data)
		setShowPaymentSuccess(false)
	}

	const defaultProps = {
		center: {
			lat: 38.994137323882356,
			lng: -105.61145327609245
		},
		zoom: 1
	}

	const [locationProps, setLocationProps] = React.useState(defaultProps)

	const createPaywall = async () => {
		setIsCreatingPaywall(true)
		const newPaywallId = await axios.post('/api/create_paywall', {
			userId: user,
			recipientUserId: openPost?.userId,
			postId: openPost?._id
		})

		const invoice = await axios.post('/api/create_invoice', {
			paywallId: newPaywallId.data.paywallId
		})
		setPendingInvoice({
			paywallId: newPaywallId.data.paywallId,
			paymentHash: invoice.data.invoice.payment_hash
		})
		setShowQr(invoice.data.invoice.payment_request)
		setIsCreatingPaywall(false)
	}

	const handleMapClick = (e: { lat: number; lng: number }) => {
		const lat = e.lat
		const lng = e.lng
		setNewPost({ lat, lng })
	}

	const deletePost = async (id: string) => {
		await axios.post('/api/delete_post', {
			id
		})
		queryClient.invalidateQueries(rqKeys.postsKey())
		queryClient.invalidateQueries(rqKeys.messagesKey())
		queryClient.invalidateQueries(rqKeys.chatPaywallsKey())
	}

	React.useEffect(() => {
		if (openId && newPost) {
			setNewPost(null)
		}
	}, [openId, newPost])

	const filteredPosts = showOnlyMyPosts ? myPosts : posts

	const openMessages =
		messages?.filter((m) => m.chatPaywallId === openChatPaywallId) || []

	return (
		// Important! Always set the container height explicitly
		<div className='mt-3' style={{ height: '100vh', width: '100%' }}>
			{postsWithNewMessages && postsWithNewMessages.length > 0 && (
				<div className='rounded-md bg-blue-50 p-4 mt-3'>
					<div className='flex'>
						<div className='flex-shrink-0'>
							<InformationCircleIcon
								className='h-5 w-5 text-blue-400'
								aria-hidden='true'
							/>
						</div>
						<div className='ml-3 flex-1 md:flex md:justify-between '>
							<p className='text-sm text-blue-700'>You have a new message.</p>
							<p className='mt-3 text-sm md:mt-0 md:ml-6'>
								<a
									onClick={() => {
										setOpenChatPaywallId(postsWithNewMessages[0].chatPaywallId)
									}}
									className='cursor-pointer whitespace-nowrap font-medium text-blue-700 hover:text-blue-600'>
									Open
									<span aria-hidden='true'> &rarr;</span>
								</a>
							</p>
						</div>
					</div>
				</div>
			)}
			{myPosts && myPosts.length > 0 && messages && messages.length < 1 && (
				<div className='rounded-md bg-green-50 p-4 mt-3'>
					<div className='flex'>
						<div className='flex-shrink-0'>
							<CheckCircleIcon
								className='h-5 w-5 text-green-400'
								aria-hidden='true'
							/>
						</div>
						<div className='ml-3'>
							<h3 className='text-sm font-medium text-green-800'>
								{myPosts && myPosts.length > 1
									? 'You have active posts'
									: 'Your post is active'}
							</h3>
							<div className='mt-2 text-sm text-green-700'>
								<p>
									Check back later to see if someone messaged you. Or if you
									have an email saved, you will receive an email when someone
									messages you.
								</p>
							</div>
						</div>
					</div>
				</div>
			)}

			<Modal
				post={openPost}
				open={openId !== null}
				setOpen={() => setOpenId(null)}
				createPaywall={createPaywall}
				isCreatingPaywall={isCreatingPaywall}
				deletePost={deletePost}
				activeChats={groupedMessages.filter((m) => m.postId === openId)}
				openThisChat={(chatPaywallId: string) => {
					setOpenChatPaywallId(chatPaywallId)
				}}
			/>
			<NewPostSuccessModal
				open={showNewPostSuccess}
				setOpen={() => setShowNewPostSuccess(false)}
			/>
			<NewPostModal
				open={!!newPost}
				close={() => {
					setNewPost(null)
				}}
				handleSuccess={() => {
					setShowNewPostSuccess(true)
					setNewPost(null)
				}}
				lat={newPost?.lat}
				lng={newPost?.lng}
				userId={user}
			/>
			<QrCodeModal
				code={showQr}
				setOpen={() => {
					setShowQr(false)
					setPendingInvoice(null)
				}}
				open={!!showQr}
			/>

			<ChatSlideOver
				open={!!openChatPaywallId}
				setOpen={setOpenChatPaywallId}
				messages={openMessages}
				createMessageMutation={(body: string) => {
					if (!openChatPaywallId || !body) return
					const message: Omit<MessageType, '_id'> = {
						body,
						fromUserId: user,
						toUserId:
							openMessages[0].fromUserId === user
								? openMessages[0].toUserId
								: openMessages[0].fromUserId,
						postId: openMessages[0].postId,
						seen: false,
						sentDate: new Date(),
						chatPaywallId: openMessages[0].chatPaywallId
					}
					createMessageMutation.mutate(message)
				}}
			/>

			<div className='md:flex md:gap-4'>
				{myPosts && myPosts.length > 0 && (
					<MyPosts posts={myPosts} deletePost={deletePost} />
				)}
				{groupedMessages && groupedMessages.length > 0 && (
					<Messages
						messages={groupedMessages}
						setOpenChatPaywallId={setOpenChatPaywallId}
						setLocationProps={setLocationProps}
						posts={posts}
					/>
				)}
			</div>
			{myPosts && myPosts.length > 0 && (
				<div className='flex items-center mb-2 w-full justify-end gap-2'>
					<input
						checked={showOnlyMyPosts}
						onChange={(e) => setShowOnlyMyPosts(e.target.checked)}
						id='comments'
						name='comments'
						type='checkbox'
						className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 '
					/>
					<div className='text-sm'>Show only your posts</div>
				</div>
			)}

			<GoogleMapReact
				onClick={handleMapClick}
				bootstrapURLKeys={{ key: 'AIzaSyBzbCrAFKFxe5ytG-z2kCZf1MNiYzccjto' }}
				defaultCenter={defaultProps.center}
				defaultZoom={defaultProps.zoom}
				zoom={locationProps.zoom}
				center={locationProps.center}
				yesIWantToUseGoogleMapApiInternals>
				{filteredPosts &&
					filteredPosts?.map((post) => {
						return (
							<MarkerComponent
								key={post._id}
								lat={post.lat}
								lng={post.lng}
								type={post.type}
								userId={post.userId}
								amount={post.amount}
								postedAt={post.postedAt}
								id={post._id}
								setOpenId={setOpenId}
							/>
						)
					})}
			</GoogleMapReact>

			<div
				aria-live='assertive'
				className='pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6'>
				<div className='flex w-full flex-col items-center space-y-4 sm:items-end'>
					<SuccessAlert
						show={showPaymentSuccess}
						setShow={setShowPaymentSuccess}
						title='Payment Success!'
						subtitle='You may now chat with this user'
					/>
				</div>
			</div>
		</div>
	)
}
