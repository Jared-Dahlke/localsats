import React from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'

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

const containerStyle = {
	width: '100%',
	height: '100%'
}

export default function SimpleMap({
	user,
	posts: initialPosts,
	messages: initialMessages
}: {
	user: string
	posts: PostType[]
	messages: MessageType[]
}) {
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: 'AIzaSyBzbCrAFKFxe5ytG-z2kCZf1MNiYzccjto'
	})

	const queryClient = useQueryClient()
	const [showPaymentSuccess, setShowPaymentSuccess] = React.useState(false)
	const [showQr, setShowQr] = React.useState(false)
	const [openId, setOpenId] = React.useState<string | null>(null)
	const [newPost, setNewPost] = React.useState<PostType | null>(null)
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
		zoom: 3
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
	const handleMapClick = (e: any) => {
		const lat = e.latLng.lat()
		const lng = e.latLng.lng()
		setNewPost({ lat, lng })
	}

	const deletePost = async (id: string) => {
		setOpenId(null)
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
				<div className='rounded-md bg-green-50 p-4 mt-5'>
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

			{isLoaded && (
				<GoogleMap
					mapContainerStyle={containerStyle}
					center={locationProps.center}
					onClick={handleMapClick}
					zoom={locationProps.zoom}>
					{filteredPosts &&
						filteredPosts?.map((post: PostType) => {
							return (
								<Marker
									key={post._id}
									position={{ lat: post.lat, lng: post.lng }}
									onClick={() => {
										setOpenId(post._id)
									}}
									icon={{
										url:
											post.type === 'sell'
												? 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
												: 'https://img.icons8.com/color/512/us-dollar-circled.png',
										scaledSize: new window.google.maps.Size(25, 25)
									}}
								/>
							)
						})}
				</GoogleMap>
			)}

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
