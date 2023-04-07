import React from 'react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import mapPic from '../public/buysellmap.jpg'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Footer } from '@/components/footer'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import { useText } from '@/hooks/useText'

export default function WelcomePage() {
	const router = useRouter()
	const handleLogin = () => {
		router.push('/login')
	}
	const t = useText()

	return (
		<div className='relative isolate overflow-hidden bg-white'>
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
					<h2 className='text-7xl'>⚡️</h2>
					<div className='mt-24 sm:mt-32 lg:mt-16'>
						<a
							href='https://github.com/Jared-Dahlke/localsats'
							className='inline-flex space-x-6'>
							<span className='rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10'>
								{t.whatsNew}
							</span>
							<span className='inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600'>
								<span>{t.justShipped}</span>
								<ChevronRightIcon
									className='h-5 w-5 text-gray-400'
									aria-hidden='true'
								/>
							</span>
						</a>
					</div>
					<h1 className='mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
						{t.buyAndSellBitcoinInPerson}
					</h1>

					<p className='mt-6 text-lg leading-8 text-gray-600'>
						{t.createAnAnonymousPostAt}
					</p>
					<div className='mt-10 flex items-center gap-x-6'>
						<a onClick={handleLogin} className='btn btn-primary'>
							{t.loginWithLightning}
						</a>
						<a
							href='https://twitter.com/localsatsorg'
							className='btn btn-ghost '>
							{t.learnMore} <span aria-hidden='true'>→</span>
						</a>
					</div>
				</div>
				<div className='mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32'>
					<div className='max-w-3xl flex-none sm:max-w-5xl lg:max-w-none'>
						<div className='-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
							<Image
								src={mapPic}
								alt='App screenshot'
								className='w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10'
							/>
						</div>
					</div>
				</div>
			</div>

			<Footer />
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
	return {
		props: { nothing: '' }
	}
}
