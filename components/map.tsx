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
import { encryptMessage } from '@/lib/pgp'
import { useDatabaseUser } from '@/hooks/useDatabaseUser'
import { MaxPostsModal } from './maxPostsModal'

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
	const userFromDatabase = useDatabaseUser({ userId: user })
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
	const [showMaxPostsModal, setShowMaxPostsModal] = React.useState(false)
	const [showNewPostModal, setShowNewPostModal] = React.useState(false)
	const [showPostModal, setShowPostModal] = React.useState(false)
	// const invoiceStatus = useCheckInvoiceStatus({
	// 	paywallId: pendingInvoice?.paywallId,
	// 	paymentHash: pendingInvoice?.paymentHash
	// })

	// React.useEffect(() => {
	// 	if (invoiceStatus?.data?.data?.paid) {
	// 		handleInvoicePaid()
	// 	}
	// }, [invoiceStatus?.data?.data?.paid])

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
		//	setShowPaymentSuccess(true)
		setShowPostModal(false)
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

		const publicKeyArmored = openPost?.author[0].pgpPublicKey
		const myPublicKeyArmored = userFromDatabase?.data?.data?.pgpPublicKey

		let finalMessage = 'Hello, I am interested in your post.'
		try {
			const encryptedMessage = await encryptMessage({
				publicKey1: publicKeyArmored,
				publicKey2: myPublicKeyArmored,
				message: 'Hello, I am interested in your post.'
			})
			finalMessage = encryptedMessage
		} catch (e) {
			// ok, user may not have a pgp key (maybe signed up before we added this feature)
		}

		// insert new initial message here
		const newMessage: Omit<MessageType, '_id'> = {
			chatPaywallId: newPaywallId.data,
			body: finalMessage,
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
		if (myPosts?.length > 2) {
			setShowMaxPostsModal(true)
			return
		}
		setNewPost({ lat, lng })
		setShowNewPostModal(true)
	}

	const deletePost = async (id: string) => {
		setShowPostModal(false)

		await axios.post('/api/delete_post', {
			id
		})
		setOpenId(null)
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
		<div className='mt-3'>
			<MaxPostsModal
				open={showMaxPostsModal}
				setOpen={() => setShowMaxPostsModal(false)}
			/>
			{postsWithNewMessages && postsWithNewMessages.length > 0 && (
				<div className='alert alert-info shadow-lg mt-8'>
					<div>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							className='stroke-current flex-shrink-0 w-6 h-6'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
						</svg>
						<span>You have a new message.</span>
						<a
							onClick={() => {
								setOpenChatPaywallId(postsWithNewMessages[0].chatPaywallId)
							}}
							className='cursor-pointer whitespace-nowrap font-medium ml-3'>
							Open
							<span aria-hidden='true'> &rarr;</span>
						</a>
					</div>
				</div>
			)}
			{myPosts && myPosts.length > 0 && messages && messages.length < 1 && (
				<div className='alert alert-success shadow-lg'>
					<div>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='stroke-current flex-shrink-0 h-6 w-6'
							fill='none'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
							/>
						</svg>
						<span>
							{myPosts && myPosts.length > 1
								? 'You have active posts'
								: 'Your post is active'}
						</span>
					</div>
				</div>
			)}

			<input
				readOnly
				checked={showPostModal}
				type='checkbox'
				id='post-modal'
				className='modal-toggle'
			/>
			<Modal
				post={openPost}
				//	open={openId !== null}
				setOpen={() => {
					setShowPostModal(false)
					setOpenId(null)
				}}
				//createPaywall={createPaywall}
				createPaywall={handleInvoicePaid}
				isCreatingPaywall={isCreatingPaywall}
				deletePost={deletePost}
				activeChats={groupedMessages.filter((m) => m.postId === openId)}
				openThisChat={(chatPaywallId: string) => {
					setShowPostModal(false)
					setOpenChatPaywallId(chatPaywallId)
				}}
			/>

			<input
				readOnly
				checked={showNewPostSuccess}
				type='checkbox'
				id='post-success-modal'
				className='modal-toggle'
			/>

			<NewPostSuccessModal
				open={showNewPostSuccess}
				setOpen={() => setShowNewPostSuccess(false)}
			/>

			<input
				readOnly
				checked={showNewPostModal}
				type='checkbox'
				id='new-post-modal'
				className='modal-toggle'
			/>

			<NewPostModal
				close={() => {
					setShowNewPostModal(false)
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

			<div className='md:gap-4 prose max-w-none'>
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
				<div className='flex w-full justify-end'>
					<div className='form-control'>
						<label className='label cursor-pointer'>
							<span className='label-text mr-2'>Show only your posts </span>
							<input
								checked={showOnlyMyPosts}
								onChange={(e) => setShowOnlyMyPosts(e.target.checked)}
								id='comments'
								name='comments'
								type='checkbox'
								className='checkbox checkbox-primary'
							/>
						</label>
					</div>
				</div>
			)}

			{isLoaded && (
				<div style={{ height: '100vh', width: '100%' }}>
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
											setShowPostModal(true)
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
				</div>
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
