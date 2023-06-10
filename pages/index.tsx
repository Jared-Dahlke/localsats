import React from 'react'
import mapPic from '@/public/buysellmap.jpg'
import Image from 'next/image'
import { Footer } from '@/components/footer'
import { getServerSession } from 'next-auth'
import { useText } from '@/hooks/useText'
import Head from 'next/head'
import LnurlAuthSignIn from './auth/signin/lnurl'
import { getSelectorsByUserAgent } from 'react-device-detect'
import { motion } from 'framer-motion'
import { transition } from '@/utils/utils'
import { getEncoded } from './api/auth/lnurl/generate-secret'
import { LnurlAuthLoginInfo } from '@/types/LnurlAuthLoginInfo'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { getOptions } from '@/lib/next-auth-lnurl'
import { lnurlAuthConfig } from '@/lib/lnurlAuthConfig'
export default function WelcomePage({
	lnurlAuthLoginInfo,
	isMobile
}: {
	lnurlAuthLoginInfo: LnurlAuthLoginInfo
	isMobile: boolean
}) {
	const [showingHelpModal, setShowingHelpModal] = React.useState(false)
	const [showLightningQr, setShowLightningQr] = React.useState(false)

	const t = useText()
	return (
		<div className='relative isolate overflow-hidden'>
			<Head>
				<title>{'localsats.org'}</title>
			</Head>

			<div className='absolute top-0 right-0'>
				<ThemeSwitcher />
			</div>
			<svg
				className='absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]'
				aria-hidden='true'>
				<defs>
					<pattern
						id='0787a7c5-978c-4f66-83c7-11c213f99cb7'
						width={200}
						height={200}
						x='50%'
						y={-1}
						patternUnits='userSpaceOnUse'>
						<path d='M.5 200V.5H200' fill='none' />
					</pattern>
				</defs>
				<rect
					width='100%'
					height='100%'
					strokeWidth={0}
					fill='url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)'
				/>
			</svg>
			<div className='mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:py-40 lg:px-8'>
				<div className='mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8'>
					<h2 className='text-7xl '>⚡️</h2>

					<h1 className='text-4xl font-bold tracking-tight  sm:text-6xl mt-24 sm:mt-32 lg:mt-16'>
						{t.buyAndSellBitcoinInPerson}
					</h1>

					<p className='mt-6 text-lg leading-8 '>{t.createAnAnonymousPostAt}</p>
					<div className='mt-10 flex justify-start items-center gap-x-6'>
						<div>
							{!showingHelpModal && (
								<>
									{isMobile ? (
										<LnurlAuthSignIn
											callbackUrl={'/home'}
											lnurlAuthLoginInfo={lnurlAuthLoginInfo}
											isMobile={true}
										/>
									) : (
										<a
											onClick={() => setShowLightningQr(true)}
											className='btn btn-primary'>
											{t.loginWithLightning}
										</a>
									)}
								</>
							)}
						</div>
						<label htmlFor='my-modal-3' className='btn btn-outline'>
							{t.showMeHow}
							<span className='ml-2' aria-hidden='true'>
								→
							</span>
						</label>

						{/* <a href='https://github.com/Jared-Dahlke/localsats'>
							<svg
								className='h-12'
								fill='grey'
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 448 512'>
								<path d='M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM277.3 415.7c-8.4 1.5-11.5-3.7-11.5-8 0-5.4.2-33 .2-55.3 0-15.6-5.2-25.5-11.3-30.7 37-4.1 76-9.2 76-73.1 0-18.2-6.5-27.3-17.1-39 1.7-4.3 7.4-22-1.7-45-13.9-4.3-45.7 17.9-45.7 17.9-13.2-3.7-27.5-5.6-41.6-5.6-14.1 0-28.4 1.9-41.6 5.6 0 0-31.8-22.2-45.7-17.9-9.1 22.9-3.5 40.6-1.7 45-10.6 11.7-15.6 20.8-15.6 39 0 63.6 37.3 69 74.3 73.1-4.8 4.3-9.1 11.7-10.6 22.3-9.5 4.3-33.8 11.7-48.3-13.9-9.1-15.8-25.5-17.1-25.5-17.1-16.2-.2-1.1 10.2-1.1 10.2 10.8 5 18.4 24.2 18.4 24.2 9.7 29.7 56.1 19.7 56.1 19.7 0 13.9.2 36.5.2 40.6 0 4.3-3 9.5-11.5 8-66-22.1-112.2-84.9-112.2-158.3 0-91.8 70.2-161.5 162-161.5S388 165.6 388 257.4c.1 73.4-44.7 136.3-110.7 158.3zm-98.1-61.1c-1.9.4-3.7-.4-3.9-1.7-.2-1.5 1.1-2.8 3-3.2 1.9-.2 3.7.6 3.9 1.9.3 1.3-1 2.6-3 3zm-9.5-.9c0 1.3-1.5 2.4-3.5 2.4-2.2.2-3.7-.9-3.7-2.4 0-1.3 1.5-2.4 3.5-2.4 1.9-.2 3.7.9 3.7 2.4zm-13.7-1.1c-.4 1.3-2.4 1.9-4.1 1.3-1.9-.4-3.2-1.9-2.8-3.2.4-1.3 2.4-1.9 4.1-1.5 2 .6 3.3 2.1 2.8 3.4zm-12.3-5.4c-.9 1.1-2.8.9-4.3-.6-1.5-1.3-1.9-3.2-.9-4.1.9-1.1 2.8-.9 4.3.6 1.3 1.3 1.8 3.3.9 4.1zm-9.1-9.1c-.9.6-2.6 0-3.7-1.5s-1.1-3.2 0-3.9c1.1-.9 2.8-.2 3.7 1.3 1.1 1.5 1.1 3.3 0 4.1zm-6.5-9.7c-.9.9-2.4.4-3.5-.6-1.1-1.3-1.3-2.8-.4-3.5.9-.9 2.4-.4 3.5.6 1.1 1.3 1.3 2.8.4 3.5zm-6.7-7.4c-.4.9-1.7 1.1-2.8.4-1.3-.6-1.9-1.7-1.5-2.6.4-.6 1.5-.9 2.8-.4 1.3.7 1.9 1.8 1.5 2.6z' />
							</svg>
						</a> */}
					</div>
				</div>
				<div className='mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32'>
					<div className='max-w-3xl flex-none sm:max-w-5xl lg:max-w-none'>
						<div className='-m-2 rounded-xl   bg-base-300/70  p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
							<Image
								priority
								src={mapPic}
								alt='App screenshot'
								className='w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10'
							/>
						</div>
					</div>
				</div>
			</div>

			<div className='w-full flex justify-center mt-6'>
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

				<input
					type='checkbox'
					onChange={() => setShowLightningQr((prev) => !prev)}
					checked={showLightningQr}
					id='qr-modal'
					className='modal-toggle'
				/>
				<LightningQrModal
					lnurlAuthLoginInfo={lnurlAuthLoginInfo}
					showLightningQr={showLightningQr}
				/>
			</div>

			<Footer />
		</div>
	)
}

export const getServerSideProps = async function ({ req, res }) {
	const session = await getServerSession(req, res, getOptions(lnurlAuthConfig))
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

const LightningQrModal = ({
	lnurlAuthLoginInfo,
	showLightningQr
}: {
	lnurlAuthLoginInfo: LnurlAuthLoginInfo
	showLightningQr: boolean
}) => {
	const t = useText()
	return (
		<div className='modal'>
			<div className='modal-box relative max-w-fit bg-white'>
				<label
					htmlFor='qr-modal'
					className='btn btn-sm btn-circle absolute right-2 top-2'>
					✕
				</label>

				<div className='py-4 text-lg font-bold text-center flex gap-2 flex-col'>
					{t.clickOrScan}
					{showLightningQr && (
						<LnurlAuthSignIn
							callbackUrl={'/home'}
							lnurlAuthLoginInfo={lnurlAuthLoginInfo}
							isMobile={false}
						/>
					)}
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

const Carousel = ({
	showingHelpModal,
	isMobile,
	lnurlAuthLoginInfo,
	showLightningQr
}: any) => {
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
							className='rounded-xl'
						/>
					</motion.div>

					<motion.div className='flex flex-col gap-2 p-4'>
						<motion.a
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
								className=' cursor-pointer transition-all hover:scale-105  '
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
								className=' cursor-pointer transition-all hover:scale-105   mt-2'
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
					<div className='flex flex-col justify-start gap-24  h-full'>
						<h3 className='text-lg font-bold w-full text-left '>{t.step3}</h3>
						<div className='w-full flex justify-center'>
							<div className='z-50 mb-12 -mt-8'>
								{showingHelpModal && (
									<LnurlAuthSignIn
										callbackUrl={'/home'}
										lnurlAuthLoginInfo={lnurlAuthLoginInfo}
										isMobile={isMobile}
									/>
								)}
							</div>
						</div>
						<h3 className='text-lg font-bold w-full text-left mt-auto'>
							{t.step4}
						</h3>
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
							<div className='card shadow-lg p-4 bg-white'>
								{showingHelpModal && (
									<LnurlAuthSignIn
										callbackUrl={'/home'}
										lnurlAuthLoginInfo={lnurlAuthLoginInfo}
									/>
								)}
							</div>
						</div>
					</div>
				)}

				<div className='absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2  z-50 w-5'>
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
