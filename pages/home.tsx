import React from 'react'
import SimpleMap from '@/components/map'
import { Layout } from '@/components/layout'
import { WelcomeModal } from '@/components/WelcomeModal'
import Axios from 'axios'
import { useDatabaseUser } from '@/hooks/useDatabaseUser'
import { getNameFromId } from '@/utils/utils'
import { SuccessAlert } from '@/components/successAlert'
import * as EmailValidator from 'email-validator'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import { getPosts } from './api/get_posts'
import {
	MessageType,
	PaywallRecordType,
	PostType,
	UserType
} from '@/types/types'
import { getMessages } from './api/get_messages'
import { useRouter } from 'next/router'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { getCookie, setCookie } from 'cookies-next'
import { addPgpToUser } from './api/add_pgp_to_user'
import { getUser } from './api/get_user'
import getDistance from 'geolib/es/getDistance'
import { usePosts } from '@/hooks/usePosts'
import { useMessages } from '@/hooks/useMessages'
import { ChatSlideOver } from '@/components/chatSlideOver'
import Modal from '@/components/modal'
import { useQueryClient } from '@tanstack/react-query'
import { rqKeys } from '@/constants'
import axios from 'axios'
import { NewPostSuccessModal } from '@/components/newPostSuccessModal'
import { encryptMessage } from '@/lib/pgp'
import { MaxPostsModal } from '@/components/maxPostsModal'
import NewPostModal from '@/components/newPostModal'
import QrCodeModal from '@/components/qrCodeModal'
import { Messages } from '@/components/messages'
import { MyPosts } from '@/components/myPosts'
import { useText } from '@/hooks/useText'
import { useLocationProps } from '@/hooks/useLocationProps'

interface IProps {
	user: string
	userFromDatabase: UserType
	posts: PostType[]
	messages: MessageType[]
	privateKeyPassphrase: string | undefined
}

export default function Home({
	user,
	posts: initialPosts,
	messages: initialMessages,
	privateKeyPassphrase,
	userFromDatabase: initialUser
}: IProps) {
	console.log('rendering home')

	const router = useRouter()

	const getAllPaywalls = async () => {
		const paywalls = await Axios.post('/api/get_all_paywalls')
		return paywalls.data
	}
	const getAllMessages = async () => {
		const messages = await Axios.post('/api/get_all_messages')
		return messages.data
	}

	const posts = usePosts({ initialPosts })
	const myPosts = posts?.filter((post: PostType) => post.userId === user)
	const { locationProps, setLocationProps } = useLocationProps(myPosts[0])

	const queryClient = useQueryClient()
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
	const [openChatPaywallId, setOpenChatPaywallId] = React.useState<
		string | null
	>(null)
	const [email, setEmail] = React.useState(initialUser?.email || '')
	const [addingEmail, setAddingEmail] = React.useState(false)
	const [passphrase, setPassphrase] = React.useState(privateKeyPassphrase)
	const [openId, setOpenId] = React.useState<string | null>(null)
	const [showEmailSuccess, setShowEmailSuccess] = React.useState(false)
	const [showPaymentSuccess, setShowPaymentSuccess] = React.useState(false)
	const [isCreatingPaywall, setIsCreatingPaywall] = React.useState(false)
	const [showPostModal, setShowPostModal] = React.useState(false)
	const [newPost, setNewPost] = React.useState<PostType | null>(null)
	const [showQr, setShowQr] = React.useState(false)
	const [showNewPostSuccess, setShowNewPostSuccess] = React.useState(false)
	const [showMaxPostsModal, setShowMaxPostsModal] = React.useState(false)
	const [showNewPostModal, setShowNewPostModal] = React.useState(false)
	const [showOnlyMyPosts, setShowOnlyMyPosts] = React.useState(false)

	const t = useText()

	const [showWelcomeModal, setShowWelcomeModal] = React.useState(false)
	React.useEffect(() => {
		//getAllPaywalls()
		//getAllMessages() //todo delete these 2
		if (!user) return
		const processUser = async () => {
			const userFromDb = await Axios.post('/api/get_user', {
				userId: user
			})

			if (!userFromDb.data.seenWelcome) {
				setShowWelcomeModal(true)
				router.push('#welcomemodal')
				await Axios.post('/api/update_user_seen_welcome', {
					userId: user
				})
			}
		}
		processUser()
	}, [user])

	const userFromDatabase = useDatabaseUser({ userId: user })
	//const userEmail = userFromDatabase?.data?.data?.email

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

	const handleInvoicePaid = async () => {
		//	setShowPaymentSuccess(true)
		setShowPostModal(false)
		const paywallRecord: Omit<PaywallRecordType, 'id'> = {
			userId: user,
			postId: openPost?.id,
			recipientUserId: openPost?.userId,
			createdAt: new Date()
		}
		const newPaywallId = await axios.post('/api/create_paywall_record', {
			paywall: paywallRecord
		})
		setOpenId(null)
		setShowQr(false)

		const publicKeyArmored = openPost?.user.pgpPublicKey
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
			postId: openPost?.id,
			fromUserId: user,
			toUserId: openPost?.userId,
			seen: false,
			sentDate: new Date()
		}
		createMessageMutation.mutate(newMessage)

		setOpenChatPaywallId(newPaywallId.data)
		setShowPaymentSuccess(false)
	}

	const saveEmail = async () => {
		await Axios.post('/api/update_user_email', {
			userId: user,
			email
		})
		setShowEmailSuccess(true)
	}

	// const nearbyPosts = React.useMemo(() => {
	// 	if (!userFromDatabase.data) return []
	// 	const { lat, lng } = userFromDatabase.data.data.location
	// 	return posts.filter((post) => {
	// 		const distance = getDistance(
	// 			{ latitude: lat, longitude: lng },
	// 			{ latitude: post.lat, longitude: post.lng }
	// 		)
	// 		return distance < 100000
	// 	})
	// }, [posts])

	React.useEffect(() => {
		if (openId && newPost) {
			setNewPost(null)
		}
	}, [openId, newPost])

	const openMessages =
		messages?.filter((m) => m.chatPaywallId === openChatPaywallId) || []
	const openPost = posts?.find((post: PostType) => post.id === openId)
	const filteredPosts = showOnlyMyPosts ? myPosts : posts

	return (
		<div>
			<WelcomeModal
				open={showWelcomeModal}
				setOpen={() => setShowWelcomeModal(false)}
				handleAddEmail={() => {
					setShowWelcomeModal(false)
				}}
			/>

			<input
				readOnly
				checked={showPostModal}
				type='checkbox'
				id='post-modal'
				className='modal-toggle'
			/>

			<Modal
				post={openPost}
				setOpen={() => {
					setShowPostModal(false)
					setOpenId(null)
				}}
				createPaywall={handleInvoicePaid}
				isCreatingPaywall={isCreatingPaywall}
				deletePost={deletePost}
				activeChats={groupedMessages.filter((m) => m.postId === openId)}
				openThisChat={(chatPaywallId: string) => {
					setShowPostModal(false)
					setOpenChatPaywallId(chatPaywallId)
				}}
			/>

			<MaxPostsModal
				open={showMaxPostsModal}
				setOpen={() => setShowMaxPostsModal(false)}
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
				}}
				open={!!showQr}
			/>

			<div className='prose max-w-none'>
				<h1>
					{t.welcome}, {getNameFromId(user)}
				</h1>

				<p className='mt-2 text-lg  mb-8 max-w-lg'>
					{t.toCreateANewPostToBuyOrSell}
				</p>

				{postsWithNewMessages && postsWithNewMessages.length > 0 && (
					<div className='alert alert-info shadow-lg mt-8 mb-7'>
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
							<span>{t.youHaveANewMessage}.</span>
							<a
								onClick={() => {
									setOpenChatPaywallId(postsWithNewMessages[0].chatPaywallId)
								}}
								className='cursor-pointer whitespace-nowrap font-medium ml-3'>
								{t.open}
								<span aria-hidden='true'> &rarr;</span>
							</a>
						</div>
					</div>
				)}

				{myPosts && myPosts.length > 0 && messages && messages.length < 1 && (
					<div className='alert alert-success shadow-lg mb-7'>
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
									? t.youHaveActivePosts
									: t.yourPostIsActive}
							</span>
						</div>
					</div>
				)}

				<div
					tabIndex={0}
					className='collapse collapse-open border border-base-300 bg-base-100 rounded-box'>
					<div className='collapse-title'>
						<h3 className='text-md font-medium leading-6 '>
							{t.emailSettings}
						</h3>
					</div>
					<div className='collapse-content'>
						<div className='mt-2 max-w-xl text-sm '>
							<p>{t.ifYoudLikeToReceiveAnEmailWhenSomeone}</p>
						</div>
						<div className='mt-5 sm:flex sm:items-center'>
							<div className='w-full sm:max-w-xs'>
								<label htmlFor='email' className='sr-only'>
									{t.emailSettings}
								</label>
								<input
									type='email'
									name='email'
									id='email'
									onChange={(e) => {
										setEmail(e.target.value)
									}}
									className='input input-bordered w-full'
									placeholder={`you@example.com (${t.optional})`}
									value={email}
								/>
							</div>
							<button
								disabled={!EmailValidator.validate(email) && email !== ''}
								onClick={saveEmail}
								className='btn-primary btn  mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent px-4 py-2 font-medium text-white shadow-sm sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'>
								{t.save}
							</button>
						</div>
					</div>
				</div>

				{/* <div className='flex items-center'>
					<label className='label cursor-pointer mr-3'>
						<span className='label-text mr-3'>Email Alerts</span>

						<input
							type='checkbox'
							className='toggle toggle-success'
							checked={addingEmail || !!userEmail}
							onChange={() => {
								setAddingEmail(!addingEmail)
							}}
						/>
					</label>
					<Tippy
						trigger='click'
						content={`If you'd like to receive an email when someone messages you, add an
							email here. Otherwise you can just check back later to see if you have any messages. We will not share your email with anyone.`}>
						<QuestionMarkCircleIcon className='h-5 w-5 cursor-pointer' />
					</Tippy>
				</div>
				{(addingEmail || userEmail) && (
					<div className='mt-1 sm:flex sm:items-center'>
						<div className='w-full sm:max-w-xs'>
							<label htmlFor='email' className='sr-only'>
								Email
							</label>
							<input
								type='email'
								name='email'
								id='email'
								onChange={(e) => {
									setEmail(e.target.value)
								}}
								className='input input-bordered w-full'
								placeholder='you@example.com (optional)'
								defaultValue={userEmail}
							/>
						</div>
						<button
							disabled={!EmailValidator.validate(email) && email !== ''}
							onClick={saveEmail}
							className='btn-primary btn  mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent px-4 py-2 font-medium text-white shadow-sm sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'>
							Save
						</button>
					</div>
				)} */}

				<div
					tabIndex={0}
					className='mt-8 collapse collapse-open border border-base-300 bg-base-100 rounded-box'>
					<div className='collapse-title'>
						<h3 className='text-md font-medium leading-6 '>
							{t.yourMessagesAre}
						</h3>
					</div>
					<div className='collapse-content'>
						{!privateKeyPassphrase && (
							<div className='rounded-md bg-yellow-50 p-4 mb-3'>
								<div className='flex'>
									<div className='flex-shrink-0'>
										<ExclamationTriangleIcon
											className='h-5 w-5 text-yellow-400'
											aria-hidden='true'
										/>
									</div>
									<div className='ml-3'>
										<h3 className='text-sm font-medium text-yellow-800'>
											{t.attentionNeededInOrderToDecrypt}
										</h3>
										<div className='mt-2 text-sm text-yellow-700'>
											<p>
												{t.weHaveARecordOfYourPgp}
												<br />
												{t.getYourPassphraseFromTheFirstDevice}
												<br />
												{t.generateANewKeyPair}
											</p>
											<button
												onClick={async () => {
													await Axios.post('/api/add_pgp_to_user', {
														userId: user
													})
													router.reload() // reload page to make pgp cookie available
												}}
												className='btn-primary btn ml-2'>
												{t.generateNewPgp}
											</button>
										</div>
									</div>
								</div>
							</div>
						)}

						<div className='mt-2 max-w-xl text-sm '>
							<p>{t.belowIsThePassphrase}</p>
						</div>
						<div className='mt-5 sm:flex sm:items-center'>
							<div className='w-full sm:max-w-xs'>
								<label htmlFor='email' className='sr-only'>
									{t.pgpPassphrase}
								</label>
								<input
									type='text'
									name='privateKeyPassphrase'
									id='privateKeyPassphrase'
									onChange={(e) => {
										setPassphrase(e.target.value)
									}}
									value={passphrase}
									className='input input-bordered w-full'
									placeholder={t.yourPgpPassphrase}
									//defaultValue={privateKeyPassphrase}
								/>
							</div>
							<button
								//disabled={passphrase.length < 1}
								onClick={async () => {
									setCookie('privateKeyPassphrase', passphrase, {
										maxAge: 2147483647,
										path: '/'
									})

									router.reload()
								}}
								className='btn-primary btn mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent  px-4 py-2 font-medium text-white shadow-sm  sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'>
								{t.save}
							</button>
						</div>
					</div>
				</div>

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
						const myPublicKeyArmored =
							userFromDatabase?.data?.data?.pgpPublicKey

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
							<span className='label-text mr-2'>{t.showOnlyYourPosts}</span>
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

			<SimpleMap
				user={user}
				posts={filteredPosts}
				messages={messages}
				groupedMessages={groupedMessages}
				createMessageMutation={createMessageMutation}
				handleMapClick={handleMapClick}
				locationProps={locationProps}
				setOpenId={setOpenId}
				setShowPostModal={setShowPostModal}
			/>

			<div
				aria-live='assertive'
				className='pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6'>
				<div className='flex w-full flex-col items-center space-y-4 sm:items-end'>
					<SuccessAlert
						show={showEmailSuccess}
						setShow={() => setShowEmailSuccess(false)}
						title={t.emailUpdated}
						subtitle=''
					/>
				</div>
			</div>
		</div>
	)
}

Home.getLayout = function getLayout(page) {
	return <Layout title='Home'>{page}</Layout>
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
	const userFromDb = await getUser(user)
	if (userFromDb && !userFromDb?.pgpPrivateKeyEncrypted) {
		await addPgpToUser({
			req,
			res,
			userId: user
		})
	}

	const posts = await getPosts()
	const privateKeyPassphrase = getCookie('privateKeyPassphrase', { req, res })
	const messages = await getMessages(user, privateKeyPassphrase)
	return {
		props: {
			user,
			userFromDatabase: JSON.parse(JSON.stringify(userFromDb)),
			posts: JSON.parse(JSON.stringify(posts)),
			messages: JSON.parse(JSON.stringify(messages)),
			privateKeyPassphrase: privateKeyPassphrase || null
		}
	}
}
