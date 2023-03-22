import React from 'react'
import SimpleMap from '../components/map'
import { Layout } from '../components/layout'
import { WelcomeModal } from '../components/WelcomeModal'
import Axios from 'axios'
import { useDatabaseUser } from '../hooks/useDatabaseUser'
import { getNameFromId } from '../utils/utils'
import { SuccessAlert } from '../components/successAlert'
import * as EmailValidator from 'email-validator'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import { getPosts } from './api/get_posts'
import { GroupedMessage, PostType } from '@/types/types'
import { getMessages } from './api/get_messages'
import { useRouter } from 'next/router'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { getCookie, setCookie } from 'cookies-next'
import { addPgpToUser } from './api/add_pgp_to_user'
import { getUser } from './api/get_user'

interface IProps {
	user: string
	posts: PostType[]
	messages: GroupedMessage[]
	privateKeyPassphrase: string | undefined
}

export default function Home({
	user,
	posts,
	messages,
	privateKeyPassphrase
}: IProps) {
	const [email, setEmail] = React.useState('')
	const [passphrase, setPassphrase] = React.useState('')

	const [showEmailSuccess, setShowEmailSuccess] = React.useState(false)
	const router = useRouter()

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
	const userEmail = userFromDatabase?.data?.data?.email

	const saveEmail = async () => {
		await Axios.post('/api/update_user_email', {
			userId: user,
			email
		})
		setShowEmailSuccess(true)
	}

	return (
		<div>
			<WelcomeModal
				open={showWelcomeModal}
				setOpen={() => setShowWelcomeModal(false)}
				handleAddEmail={() => {
					setShowWelcomeModal(false)
				}}
			/>
			<div className='prose'>
				<h1>Welcome, {getNameFromId(user)}</h1>

				<p className='mt-2 text-sm  mb-8'>
					To create a new post to buy or sell bitcoin, just click anywhere on
					the map. To see other peoples posts, click on the icons on the map.
				</p>

				<div
					tabIndex={0}
					className='collapse collapse-open border border-base-300 bg-base-100 rounded-box'>
					<div className='collapse-title'>
						<h3 className='text-md font-medium leading-6 '>Email Settings</h3>
					</div>
					<div className='collapse-content'>
						<div className='mt-2 max-w-xl text-sm '>
							<p>
								{`If you'd like to receive an email when someone messages you, add an
							email here. Otherwise you can just check back later to see if you have any messages. We will not share your email with anyone.`}
							</p>
						</div>
						<div className='mt-5 sm:flex sm:items-center'>
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
					</div>
				</div>

				<div
					tabIndex={0}
					className='mt-8 collapse collapse-open border border-base-300 bg-base-100 rounded-box'>
					<div className='collapse-title'>
						<h3 className='text-md font-medium leading-6 '>
							Your Messages are end-to-end encrypted using PGP
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
											Attention needed in order to decrypt future messages
										</h3>
										<div className='mt-2 text-sm text-yellow-700'>
											<p>
												We have a record of your PGP public key, but your
												private key is not found in your cookies. You have 2
												options:
												<br />
												1. (Recommended) Get your private key from the first
												device you logged into with this account and save it in
												the input field below. This will allow you to decrypt
												old messages and future messages.
												<br />
												2. Generate a new keypair, you will be able to read all
												future messages, but this will prevent you from
												decrypting old messages
											</p>
											<button
												onClick={async () => {
													await Axios.post('/api/add_pgp_to_user', {
														userId: user
													})
													router.reload() // reload page to make pgp cookie available
												}}
												className='btn-primary btn ml-2'>
												Generate new PGP key pair
											</button>
										</div>
									</div>
								</div>
							</div>
						)}

						<div className='mt-2 max-w-xl text-sm '>
							<p>
								{`Below is the passphrase to your PGP keys that encrypt your messages. This is stored in your browser as a cookie.  Save it somewhere safe in case you clear your cookies or you want to access your messages from another device.`}
							</p>
						</div>
						<div className='mt-5 sm:flex sm:items-center'>
							<div className='w-full sm:max-w-xs'>
								<label htmlFor='email' className='sr-only'>
									PGP Phassphrase
								</label>
								<input
									type='text'
									name='privateKeyPassphrase'
									id='privateKeyPassphrase'
									onChange={(e) => {
										setPassphrase(e.target.value)
									}}
									className='input input-bordered w-full'
									placeholder='your PGP passphrase...'
									defaultValue={privateKeyPassphrase}
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
								Save
							</button>
						</div>
					</div>
				</div>
			</div>
			<SimpleMap user={user} posts={posts} messages={messages} />

			<div
				aria-live='assertive'
				className='pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6'>
				<div className='flex w-full flex-col items-center space-y-4 sm:items-end'>
					<SuccessAlert
						show={showEmailSuccess}
						setShow={() => setShowEmailSuccess(false)}
						title='Email updated!'
						subtitle=''
					/>
				</div>
			</div>
		</div>
	)
}

Home.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>
}

export const getServerSideProps = async function ({ req, res }) {
	const session = await getServerSession(req, res, authOptions)

	const user = session?.user?.userId
	if (!user) {
		console.log('no user found')
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
			messages: JSON.parse(JSON.stringify(messages)),
			privateKeyPassphrase: privateKeyPassphrase || null
		}
	}
}
