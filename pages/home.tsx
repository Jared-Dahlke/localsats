import React from 'react'
import SimpleMap from '@/components/map'
import { Layout } from '@/components/layout'
import { WelcomeModal } from '@/components/WelcomeModal'
import Axios from 'axios'
import { useDatabaseUser } from '@/hooks/useDatabaseUser'
import { classNames, getNameFromId, transition } from '@/utils/utils'
import { getServerSession } from 'next-auth'
import { getPosts } from './api/get_posts'
import {
	MessageType,
	PaywallRecordType,
	PostType,
	UserType
} from '@/types/types'
import { getMessages } from './api/get_messages'
import { useRouter } from 'next/router'
import { getCookie } from 'cookies-next'
import { addPgpToUser } from './api/add_pgp_to_user'
import { getUser } from './api/get_user'
import getDistance from 'geolib/es/getDistance'
import { usePosts } from '@/hooks/usePosts'
import { useMessages } from '@/hooks/useMessages'
import Modal from '@/components/modal'
import { useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { NewPostSuccessModal } from '@/components/newPostSuccessModal'
import { encryptMessage } from '@/lib/pgp'
import { MaxPostsModal } from '@/components/maxPostsModal'
import NewPostModal from '@/components/newPostModal'
import QrCodeModal from '@/components/qrCodeModal'
import { useText } from '@/hooks/useText'
import { useLocationProps } from '@/hooks/useLocationProps'
import { motion } from 'framer-motion'
import { getOptions } from '@/lib/next-auth-lnurl'
import { lnurlAuthConfig } from '@/lib/lnurlAuthConfig'

const stats = [
	{ name: 'Posted Date', value: '12/31/ 2022' },
	{ name: 'Average deploy time', value: '3.65', unit: 'mins' },
	{ name: 'Number of Chats', value: '3' },
	{ name: 'Success rate', value: '98.5%' }
]

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
	messages: initialMessages
}: IProps) {
	const router = useRouter()

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
	const hasUnreadMessages = messages?.some(
		(message) => !message.seen && message.toUserId === user
	)

	const [openId, setOpenId] = React.useState<string | null>(null)
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

	const deletePost = async (id: string) => {
		setShowPostModal(false)

		await axios.post('/api/delete_post', {
			id
		})
		setOpenId(null)
		queryClient.invalidateQueries()
	}

	const handleMapClick = (e: any) => {
		const lat = e.latLng.lat()
		const lng = e.latLng.lng()
		if (myPosts?.length > 0) {
			setShowMaxPostsModal(true)
			return
		}
		setNewPost({ lat, lng })
		setShowNewPostModal(true)
	}

	const createPaywall = async () => {
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

		let finalMessage = 'Hello, I am interested in your order.'
		try {
			const encryptedMessage = await encryptMessage({
				publicKey1: publicKeyArmored,
				publicKey2: myPublicKeyArmored,
				message: 'Hello, I am interested in your order.'
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

		router.push(`/chats/${newPaywallId.data}`)
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
				createPaywall={createPaywall}
				isCreatingPaywall={isCreatingPaywall}
				deletePost={deletePost}
				activeChats={groupedMessages.filter((m) => m.postId === openId)}
				openThisChat={(chatPaywallId: string) => {
					router.push(`/chats/${chatPaywallId}`)
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

				{hasUnreadMessages && (
					<motion.div
						initial={{ y: 100, opacity: 0 }}
						viewport={{ once: true }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ ...transition }}
						className='alert alert-info shadow-lg mt-8 mb-7'>
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
									router.push('/chats')
								}}
								className='text-info-content cursor-pointer whitespace-nowrap font-medium ml-3'>
								{t.open}
								<span aria-hidden='true'> &rarr;</span>
							</a>
						</div>
					</motion.div>
				)}
			</div>

			{/* <div className='my-5'>
				<PostCard />
			</div> */}

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
		</div>
	)
}

Home.getLayout = function getLayout(page) {
	return <Layout title='Home'>{page}</Layout>
}

export const getServerSideProps = async function ({ req, res }) {
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
			posts: JSON.parse(JSON.stringify(posts)),
			messages: JSON.parse(JSON.stringify(messages))
		}
	}
}

const PostCard = () => {
	return (
		<div className='rounded-lg shadow-xl bg-base-300 '>
			<div className=' flex flex-col items-start justify-between gap-x-8 gap-y-4  px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8'>
				<div>
					<div className='flex items-center gap-x-3'>
						<div className='flex-none rounded-full bg-green-400/10 p-1 text-green-400'>
							<div className='h-2 w-2 rounded-full bg-current' />
						</div>
						<h1 className='flex gap-x-3 text-base leading-7'>
							<span className='font-semibold text-accent-content'>
								My Active Post
							</span>
							{/* <span className='text-gray-600'>/</span>
							<span className='font-semibold text-accent-content'>
								Buy Order
							</span> */}
						</h1>
					</div>
					<p className='mt-2 text-xs leading-6 text-base-content'>
						Deploys from GitHub via main branch
					</p>
				</div>
				<div className='badge badge-accent'>Buy</div>
			</div>

			{/* Stats */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
				{stats.map((stat, statIdx) => (
					<div
						key={stat.name}
						className={classNames(
							statIdx % 2 === 1
								? 'sm:border-l'
								: statIdx === 2
								? 'lg:border-l'
								: '',
							'border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8'
						)}>
						<p className='text-sm font-medium leading-6 text-gray-400'>
							{stat.name}
						</p>
						<p className='mt-2 flex items-baseline gap-x-2'>
							<span className='text-4xl font-semibold tracking-tight text-accent-content'>
								{stat.value}
							</span>
							{stat.unit ? (
								<span className='text-sm text-gray-400'>{stat.unit}</span>
							) : null}
						</p>
					</div>
				))}
			</div>
		</div>
	)
}
