import LnurlAuthSignIn from './auth/signin/lnurl'
import { getEncoded } from './api/auth/lnurl/generate-secret'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import { useText } from '@/hooks/useText'

export default function Login({ lnurlAuthLoginInfo }: any) {
	const t = useText()
	return (
		<div className='flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md'>
				<img
					className='mx-auto h-12 w-auto'
					src='./bitcoin.svg'
					alt='Your Company'
				/>
				<h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
					{t.signIntoYourAccount}
				</h2>
				<p className='mt-2 text-center text-sm text-gray-600'>
					<a
						href='https://github.com/fiatjaf/lnurl-rfc/blob/master/lnurl-auth.md'
						className='font-medium text-indigo-600 hover:text-indigo-500'>
						{t.learnMoreAboutLightningLogin}
					</a>
				</p>
			</div>

			<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
				<div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
					<section className='space-y-6 justify-center flex flex-col items-center'>
						<LnurlAuthSignIn
							callbackUrl={'/home'}
							lnurlAuthLoginInfo={lnurlAuthLoginInfo}
						/>
					</section>

					<div className='mt-6'>
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-gray-300' />
							</div>
							<div className='relative flex justify-center text-sm'>
								<span className='bg-white px-2 text-gray-500'>
									{t.noWalletTry}
								</span>
							</div>
						</div>

						<div className='mt-6 grid grid-cols-3 gap-3'>
							<div>
								<a
									href='https://breez.technology/mobile/'
									className='text-sm inline-flex w-full justify-center rounded-md bg-white py-2 px-4 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'>
									Breeze
								</a>
							</div>

							<div>
								<a
									href='https://phoenix.acinq.co/'
									className='text-sm inline-flex w-full justify-center rounded-md bg-white py-2 px-4 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'>
									Phoenix
								</a>
							</div>

							<div>
								<a
									href='https://getalby.com/'
									className='text-sm inline-flex w-full justify-center rounded-md bg-white py-2 px-4 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'>
									Alby
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export const getServerSideProps = async function ({ req, res }) {
	const session = await getServerSession(req, res, authOptions)
	if (session) {
		return {
			redirect: {
				destination: '/home',
				permanent: false
			}
		}
	}
	const lnurlAuthLoginInfo = await getEncoded()

	return {
		props: { lnurlAuthLoginInfo }
	}
}
