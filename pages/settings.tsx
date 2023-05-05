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
import { getCookie, setCookie } from 'cookies-next'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface IProps {
	user: string
	privateKeyPassphrase: string
}

export default function Settings({ user, privateKeyPassphrase }: IProps) {
	const userFromDatabase = useDatabaseUser({ userId: user })

	console.log('userFromDatabase', userFromDatabase?.data?.data)
	const router = useRouter()
	const [email, setEmail] = React.useState('')
	const [showEmailSuccess, setShowEmailSuccess] = React.useState(false)
	const [passphrase, setPassphrase] = React.useState(privateKeyPassphrase)

	const saveEmail = async () => {
		await axios.post('/api/update_user_email', {
			userId: user,
			email
		})
		setShowEmailSuccess(true)
	}
	const t = useText()
	return (
		<div className='h-screen flex items-center flex-col gap-8 '>
			<div className='card shadow-xl bg-base-300'>
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

			<div className='card shadow-xl bg-base-300'>
				<div className='card-body'>
					<div className='card-title'>{t.yourMessagesAre}</div>
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
												await axios.post('/api/add_pgp_to_user', {
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
							<label htmlFor='pgpPassphrase' className='sr-only'>
								{t.pgpPassphrase}
							</label>
							<input
								type='text'
								name='privateKeyPassphrase'
								id='privateKeyPassphrase'
								onChange={(e) => {
									setPassphrase(e.target.value)
								}}
								//value={passphrase}
								className='input input-bordered w-full'
								placeholder={t.yourPgpPassphrase}
								defaultValue={privateKeyPassphrase}
							/>
						</div>
						<button
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

	const privateKeyPassphrase = getCookie('privateKeyPassphrase', { req, res })

	return {
		props: { user, privateKeyPassphrase: privateKeyPassphrase || null }
	}
}
