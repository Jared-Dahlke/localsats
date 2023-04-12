import LnurlAuthSignIn from './auth/signin/lnurl'
import { getEncoded } from './api/auth/lnurl/generate-secret'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import { useText } from '@/hooks/useText'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { transition } from '@/utils/utils'
import React from 'react'
import { useRouter } from 'next/router'
import { getSelectorsByUserAgent } from 'react-device-detect'
export default function Login({ lnurlAuthLoginInfo, isMobile }: any) {
	const t = useText()
	const [showingHelpModal, setShowingHelpModal] = React.useState(false)
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
				</div>
			</div>
			<div className='w-full flex justify-center mt-6'>
				{/* <button className='btn btn-link text-black w-[256px]'>
					Show me how to do this
				</button> */}
				<label htmlFor='my-modal-3' className='btn btn-outline'>
					{t.showMeHow}
				</label>
				<input
					type='checkbox'
					onChange={() => setShowingHelpModal((prev) => !prev)}
					checked={showingHelpModal}
					id='my-modal-3'
					className='modal-toggle'
				/>
				<HelpModal
					showingHelpModal={showingHelpModal}
					isMobile={isMobile}
					lnurlAuthLoginInfo={lnurlAuthLoginInfo}
				/>
			</div>
		</div>
	)
}

const HelpModal = ({ showingHelpModal, isMobile, lnurlAuthLoginInfo }: any) => {
	return (
		<div className='modal'>
			<div className='modal-box relative'>
				<label
					htmlFor='my-modal-3'
					className='btn btn-sm btn-circle absolute right-2 top-2'>
					✕
				</label>

				<div className='py-4'>
					<Carousel
						showingHelpModal={showingHelpModal}
						isMobile={isMobile}
						lnurlAuthLoginInfo={lnurlAuthLoginInfo}
					/>
				</div>
			</div>
		</div>
	)
}

const wallets = [
	{
		name: 'Wallet of Satoshi',
		image: '/../public/mobileWallets/walletOfSatoshi2.webp'
	},
	{
		name: 'Breez',
		image: '/../public/mobileWallets/breez.webp'
	},
	{
		name: 'Phoenix',
		image: '/../public/mobileWallets/phoenix.webp'
	}
]

const Carousel = ({ showingHelpModal, isMobile, lnurlAuthLoginInfo }: any) => {
	const t = useText()
	const [showAll, setShowAll] = React.useState(false)
	const [activeTab, setActiveTab] = React.useState(1)
	const walletsToShow = showAll ? wallets : wallets.slice(0, 1)
	return (
		<div className='carousel w-full'>
			<div
				style={{ height: '70vh' }}
				id='slide1'
				className='carousel-item relative  w-full flex-col items-center'>
				<h3 className='text-lg font-bold w-full text-left mb-4'>
					{t.step1Install}{' '}
					<span className='text-slate-400  font-extrabold'>Breez Wallet</span>{' '}
					{t.onYourPhone}
				</h3>

				<div className='flex flex-col gap-5'>
					<motion.div
						className='p-4 shadow-xl rounded-xl'
						initial={{ y: 200, opacity: 0 }}
						animate={
							showingHelpModal ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }
						}
						transition={{ ...transition }}>
						<Image
							src='/mobileWallets/breez.webp'
							width={200}
							height={434}
							alt='Breez'
						/>
					</motion.div>

					<motion.div className='flex flex-col gap-2 p-4'>
						<motion.a
							target='_blank'
							rel='noopener noreferrer'
							href='https://apps.apple.com/us/app/breez-lightning-client-pos/id1463604142'
							initial={{ x: 200, opacity: 0 }}
							animate={
								showingHelpModal ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }
							}
							transition={{ ...transition, delay: 0.1 }}>
							<Image
								src={'/mobileWallets/apple_download.png'}
								width={200}
								height={50}
								alt={'apple download'}
								className='bg-white cursor-pointer transition-all hover:scale-105  '
							/>
						</motion.a>
						<motion.a
							target='_blank'
							rel='noopener noreferrer'
							href='https://play.google.com/store/apps/details?id=com.breez.client&hl=en_US&gl=US'
							initial={{ x: -200, opacity: 0 }}
							animate={
								showingHelpModal
									? { x: 0, opacity: 1 }
									: { x: -100, opacity: 0 }
							}
							transition={{ ...transition, delay: 0.2 }}>
							<Image
								src={'/mobileWallets/google-download.png'}
								width={200}
								height={50}
								alt={'android download'}
								className='bg-white cursor-pointer transition-all hover:scale-105   mt-2'
							/>
						</motion.a>
					</motion.div>
				</div>

				<div className='absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2 z-50'>
					<a href='#slide4' className='btn btn-circle'>
						❮
					</a>

					<a
						href='#slide2'
						onClick={() => setActiveTab(2)}
						className='btn btn-circle'>
						❯
					</a>
				</div>
			</div>
			<div
				id='slide2'
				style={{ height: '70vh' }}
				className='carousel-item relative w-full flex-col items-center'>
				<h3 className='text-lg font-bold w-full text-left mb-4'>
					{t.step2Open}{' '}
					<span className='text-slate-400  font-extrabold'>Breez</span>{' '}
					{t.onYourPhoneAndClick}{' '}
					<span className='text-slate-400  font-extrabold'>Let`s Breez!</span>{' '}
					{t.thenComeBack}
				</h3>
				<div className='relative'>
					<svg
						className='animate-bounce absolute w-24 h-24 top-56 right-14 fill-white'
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 384 512'>
						<path d='M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z' />
					</svg>

					<Image
						className='rounded-lg shadow-xl'
						src='/mobileWallets/letsbreez.jpg'
						width={200}
						height={434}
						alt='Wallet of Satoshi'
					/>
				</div>

				<div className='absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2  z-50'>
					<a href='#slide1' className='btn btn-circle'>
						❮
					</a>
					<a href='#slide3' className='btn btn-circle'>
						❯
					</a>
				</div>
			</div>
			<div
				id='slide3'
				className='carousel-item relative w-full flex-col items-center'>
				{isMobile ? (
					<div className='flex flex-col justify-between  h-full'>
						<h3 className='text-lg font-bold w-full text-left '>{t.step3}</h3>
						<div className='w-full flex justify-center'>
							<div className='scale-75 card shadow-lg p-4 z-50'>
								<LnurlAuthSignIn
									callbackUrl={'/home'}
									lnurlAuthLoginInfo={lnurlAuthLoginInfo}
								/>
							</div>
						</div>
						<h3 className='text-lg font-bold w-full text-left '>{t.step4}</h3>
					</div>
				) : (
					<div className='flex flex-col justify-start  h-full'>
						<h3 className='text-lg font-bold w-full text-left '>
							{t.step3Scan}{' '}
							<span className='text-slate-400  font-extrabold'>Breez</span>,{' '}
							{t.acceptTheLogin}{' '}
							<span className='text-slate-400  font-extrabold'>Breez</span>.{' '}
							{t.youWillBeRedirected}
						</h3>
						<div className='w-full scale-75 flex justify-center items-center mt-24'>
							<div className='card shadow-lg p-4'>
								<LnurlAuthSignIn
									callbackUrl={'/home'}
									lnurlAuthLoginInfo={lnurlAuthLoginInfo}
								/>
							</div>
						</div>
					</div>
				)}

				<div className='absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2  z-50'>
					<a href='#slide2' className='btn btn-circle'>
						❮
					</a>
					{/* <a href='#slide4' className='btn btn-circle'>
						❯
					</a> */}
				</div>
			</div>

			{/* <div id='slide4' className='carousel-item relative w-full'>
				<img
					src='/images/stock/photo-1665553365602-b2fb8e5d1707.jpg'
					className='w-full'
				/>
				<div className='absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2  z-50'>
					<a href='#slide3' className='btn btn-circle'>
						❮
					</a>
					<a href='#slide1' className='btn btn-circle'>
						❯
					</a>
				</div>
			</div> */}
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
	const userAgent = req.headers['user-agent'] || ''
	const { isMobile } = getSelectorsByUserAgent(userAgent)

	const lnurlAuthLoginInfo = await getEncoded()

	return {
		props: { lnurlAuthLoginInfo, isMobile }
	}
}

{
	/* <div className=' carousel carousel-vertical carousel-center rounded-box gap-3'>
					{walletsToShow.map((wallet, i) => {
						return (
							<motion.div
								initial={{ y: 200, opacity: 0 }}
								animate={
									showingHelpModal
										? { y: 0, opacity: 1 }
										: { y: 100, opacity: 0 }
								}
								transition={{ ...transition, delay: i * 0.1 }}
								className='carousel-item'>
								<div
									key={i}
									className='card w-96 bg-base-100 shadow-xl image-full'>
									<figure>
										<Image
											src={wallet.image}
											fill
											alt={wallet.name}
											className='rounded-lg'
										/>
									</figure>
									<div className='card-body'>
										<div className='card-title justify-center'>
											{wallet.name}
										</div>

										<div className='card-actions justify-end'>
											<button className='btn gap-2 bg-white text-black outline-none'>
												<svg
													className='w-6 h-6 fill-base'
													xmlns='http://www.w3.org/2000/svg'
													viewBox='0 0 512 512'>
													<path d='M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z' />
												</svg>
												Google
											</button>
											<button className='btn gap-2 bg-white text-black outline-none'>
												<svg
													className='w-6 h-6 fill-base'
													xmlns='http://www.w3.org/2000/svg'
													viewBox='0 0 512 512'>
													<path d='M255.9 120.9l9.1-15.7c5.6-9.8 18.1-13.1 27.9-7.5 9.8 5.6 13.1 18.1 7.5 27.9l-87.5 151.5h63.3c20.5 0 32 24.1 23.1 40.8H113.8c-11.3 0-20.4-9.1-20.4-20.4 0-11.3 9.1-20.4 20.4-20.4h52l66.6-115.4-20.8-36.1c-5.6-9.8-2.3-22.2 7.5-27.9 9.8-5.6 22.2-2.3 27.9 7.5l8.9 15.7zm-78.7 218l-19.6 34c-5.6 9.8-18.1 13.1-27.9 7.5-9.8-5.6-13.1-18.1-7.5-27.9l14.6-25.2c16.4-5.1 29.8-1.2 40.4 11.6zm168.9-61.7h53.1c11.3 0 20.4 9.1 20.4 20.4 0 11.3-9.1 20.4-20.4 20.4h-29.5l19.9 34.5c5.6 9.8 2.3 22.2-7.5 27.9-9.8 5.6-22.2 2.3-27.9-7.5-33.5-58.1-58.7-101.6-75.4-130.6-17.1-29.5-4.9-59.1 7.2-69.1 13.4 23 33.4 57.7 60.1 104zM256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm216 248c0 118.7-96.1 216-216 216-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216z' />
												</svg>
												App Store
											</button>
										
										</div>
									</div>
								</div>
							</motion.div>
						)
					})}
				</div> */
}

{
	/* <button className='btn gap-2 bg-white text-black outline-none'>
							<svg
								className='w-6 h-6 fill-base'
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 512 512'>
								<path d='M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z' />
							</svg>
							Google
						</button>
						<button className='btn gap-2 bg-white text-black outline-none'>
							<svg
								className='w-6 h-6 fill-base'
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 512 512'>
								<path d='M255.9 120.9l9.1-15.7c5.6-9.8 18.1-13.1 27.9-7.5 9.8 5.6 13.1 18.1 7.5 27.9l-87.5 151.5h63.3c20.5 0 32 24.1 23.1 40.8H113.8c-11.3 0-20.4-9.1-20.4-20.4 0-11.3 9.1-20.4 20.4-20.4h52l66.6-115.4-20.8-36.1c-5.6-9.8-2.3-22.2 7.5-27.9 9.8-5.6 22.2-2.3 27.9 7.5l8.9 15.7zm-78.7 218l-19.6 34c-5.6 9.8-18.1 13.1-27.9 7.5-9.8-5.6-13.1-18.1-7.5-27.9l14.6-25.2c16.4-5.1 29.8-1.2 40.4 11.6zm168.9-61.7h53.1c11.3 0 20.4 9.1 20.4 20.4 0 11.3-9.1 20.4-20.4 20.4h-29.5l19.9 34.5c5.6 9.8 2.3 22.2-7.5 27.9-9.8 5.6-22.2 2.3-27.9-7.5-33.5-58.1-58.7-101.6-75.4-130.6-17.1-29.5-4.9-59.1 7.2-69.1 13.4 23 33.4 57.7 60.1 104zM256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm216 248c0 118.7-96.1 216-216 216-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216z' />
							</svg>
							App Store
						</button> */
}
