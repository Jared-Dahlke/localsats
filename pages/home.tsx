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
import { parseCookies, setCookie } from 'nookies'
import nookies from 'nookies'

interface IProps {
	user: string
	posts: PostType[]
	messages: GroupedMessage[]
}

export default function Home({ user, posts, messages }: IProps) {
	const [email, setEmail] = React.useState('')
	const [passphrase, setPassphrase] = React.useState('')

	const [showEmailSuccess, setShowEmailSuccess] = React.useState(false)
	const router = useRouter()
	const cookies = parseCookies()

	const [showWelcomeModal, setShowWelcomeModal] = React.useState(false)
	React.useEffect(() => {
		if (!user) return
		const processUser = async () => {
			const userFromDb = await Axios.post('/api/get_user', {
				userId: user
			})
			if (!userFromDb.data) {
				// log error
				return
			}
			//if no pgp private key in db, then add one
			if (userFromDb && !userFromDb?.data?.pgpPrivateKeyEncrypted) {
				await Axios.post('/api/add_pgp_to_user', {
					userId: user
				})
			}
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

			<h3 className=' font-medium leading-6 text-gray-900'>
				Welcome, {getNameFromId(user)}
			</h3>
			<p className='mt-2 text-sm text-gray-500 mb-3'>
				To create a new post to buy or sell bitcoin, just click anywhere on the
				map. To see other peoples posts, click on the icons on the map.
			</p>

			<div className='bg-white shadow sm:rounded-lg'>
				<div className='px-4 py-5 sm:p-6'>
					<h3 className='text-md font-medium leading-6 text-gray-900'>
						Add an email?
					</h3>
					<div className='mt-2 max-w-xl text-sm text-gray-500'>
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
								className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
								placeholder='you@example.com (optional)'
								defaultValue={userEmail}
							/>
						</div>
						<button
							disabled={!EmailValidator.validate(email) && email !== ''}
							onClick={saveEmail}
							className='disabled:opacity-50 disabled:cursor-not-allowed mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'>
							Save
						</button>
					</div>
				</div>
			</div>

			<div className='bg-white shadow sm:rounded-lg mt-3'>
				<div className='px-4 py-5 sm:p-6'>
					<h3 className='text-md font-medium leading-6 text-gray-900'>
						Your Messages are end-to-end encrypted using PGP
					</h3>
					<div className='mt-2 max-w-xl text-sm text-gray-500'>
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
								className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
								placeholder='your PGP passphrase...'
								defaultValue={cookies.privateKeyPassphrase}
							/>
						</div>
						<button
							disabled={passphrase.length < 1}
							onClick={async () => {
								setCookie(null, 'privateKeyPassphrase', passphrase, {
									maxAge: 2147483647,
									path: '/'
								})
								router.reload()
							}}
							className='disabled:opacity-50 disabled:cursor-not-allowed mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'>
							Save
						</button>
					</div>
					{/* {userFromDatabase?.data?.data?.pgpPublicKey && (
						<Prism  language='tsx'>
							{userFromDatabase?.data?.data?.pgpPublicKey}
						</Prism>
					)}
					{cookies?.pgpPrivateKey && (
						<Prism hidden language='tsx'>
							{cookies?.pgpPrivateKey}
						</Prism>
					)} */}
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
	const cookies = nookies.get({ req })
	const user = session?.user?.userId
	if (!user) {
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		}
	}

	const posts = await getPosts()
	const messages = await getMessages(user, cookies.privateKeyPassphrase)

	return {
		props: {
			user,
			posts: JSON.parse(JSON.stringify(posts)),
			messages: JSON.parse(JSON.stringify(messages))
		}
	}
}
