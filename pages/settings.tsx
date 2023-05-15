import { useText } from '@/hooks/useText'
import { getServerSession } from 'next-auth'
import React, { useEffect } from 'react'
import { Layout } from '@/components/layout'
import axios from 'axios'
import * as EmailValidator from 'email-validator'
import { useDatabaseUser } from '@/hooks/useDatabaseUser'
import { getOptions } from '@/lib/next-auth-lnurl'
import { lnurlAuthConfig } from '@/lib/lnurlAuthConfig'
import { SuccessAlert } from '@/components/successAlert'
import { useRouter } from 'next/router'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { usePgpPassword } from '@/hooks/usePgpPassword'
import { PasswordStatuses } from '@/types/types'
import { LoadingPage } from '@/components/loading'

interface IProps {
	user: string
}

export default function Settings({ user }: IProps) {
	const userFromDatabase = useDatabaseUser({ userId: user })
	const { pgpPassword, setPgpPassword } = usePgpPassword()

	const [initialPassword, setInitialPassword] = React.useState('')
	const [hasMessagesSentToOldKeys, setHasMessagesSentToOldKeys] =
		React.useState(false)
	const [pgpPasswordStatus, setPgpPasswordStatus] =
		React.useState<PasswordStatuses>('loading')

	const router = useRouter()
	const [email, setEmail] = React.useState('')
	const [showEmailSuccess, setShowEmailSuccess] = React.useState(false)
	const [passphrase, setPassphrase] = React.useState('')
	const [loaded, setLoaded] = React.useState(false)
	useEffect(() => {
		if (typeof window !== 'undefined') {
			// You can safely use localStorage here
			setInitialPassword(pgpPassword)
			setPassphrase(pgpPassword)
			setLoaded(true)

			const handlePgpStatus = async () => {
				const res = await axios.post('/api/get_pgppassword_status', {
					userId: user,
					password: pgpPassword
				})

				setHasMessagesSentToOldKeys(res.data.hasMessagesSentToOldKeys)
				setPgpPasswordStatus(res.data.status)
			}
			handlePgpStatus()
		}
	}, [])

	const saveEmail = async () => {
		await axios.post('/api/update_user_email', {
			userId: user,
			email
		})
		setShowEmailSuccess(true)
	}
	const t = useText()

	if (pgpPasswordStatus === 'loading') {
		return (
			<div>
				<LoadingPage size={64} />
			</div>
		)
	}
	return (
		<div className='h-screen flex items-center flex-col gap-8 '>
			<div className='card shadow-xl bg-base-300 w-full'>
				<div className='card-body'>
					<div className='card-title'>
						<h3 className='text-md font-medium leading-6 '>
							{t.emailSettings}
						</h3>
					</div>

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
								className='input  w-full'
								placeholder={`you@example.com (${t.optional})`}
								defaultValue={userFromDatabase?.data?.data?.email}
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

			<div className='card shadow-xl bg-base-300 w-full'>
				<div className='card-body'>
					<div className='card-title'>{t.yourMessagesAre}</div>

					{pgpPasswordStatus === 'correct' && (
						<div className='alert alert-success shadow-lg my-4'>
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
									Your messages are e2e encrypted, your PGP keys are good to go.
									{hasMessagesSentToOldKeys && (
										<>
											{' '}
											However, some of your old messages may not be readable
											since they were generated with your old pgp keys{' '}
										</>
									)}
								</span>
							</div>
						</div>
					)}

					<div className='mt-2 max-w-xl text-sm '>
						<p>{t.belowIsThePassphrase}</p>
					</div>
					<div className='mt-5 sm:flex flex-col gap-8 justify-start w-full items-start '>
						<div className='w-full  flex flex-col'>
							<label htmlFor='pgpPassphrase' className='sr-only'>
								{t.pgpPassphrase}
							</label>
							<input
								type='text'
								name='privateKeyPassphrase'
								id='privateKeyPassphrase'
								disabled
								className='input input-bordered w-full'
								placeholder={t.yourPgpPassphrase}
								value={passphrase}
							/>
						</div>
						<button
							onClick={async () => {
								setPgpPassword('')

								router.reload()
							}}
							className='btn-primary btn mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent  px-4 py-2 font-medium text-white shadow-sm  sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'>
							Edit my password
						</button>
					</div>
				</div>
			</div>

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
Settings.getLayout = function getLayout(page) {
	return <Layout title='Settings'>{page}</Layout>
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

	return {
		props: { user }
	}
}
