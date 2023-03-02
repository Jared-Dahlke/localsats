import React from 'react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import mapPic from '../public/buysellmap.jpg'
import Image from 'next/image'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'

export default function WelcomePage() {
	const router = useRouter()
	const handleLogin = () => {
		router.push('/login')
	}

	const navigation = {
		social: [
			{
				name: 'Twitter',
				href: 'https://twitter.com/localsatsorg',
				icon: (props) => (
					<svg fill='currentColor' viewBox='0 0 24 24' {...props}>
						<path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
					</svg>
				)
			},
			{
				name: 'GitHub',
				href: 'https://github.com/Jared-Dahlke/localsats',
				icon: (props) => (
					<svg fill='currentColor' viewBox='0 0 24 24' {...props}>
						<path
							fillRule='evenodd'
							d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
							clipRule='evenodd'
						/>
					</svg>
				)
			}
		]
	}

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
								What's new
							</span>
							<span className='inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600'>
								<span>Just shipped v1.0</span>
								<ChevronRightIcon
									className='h-5 w-5 text-gray-400'
									aria-hidden='true'
								/>
							</span>
						</a>
					</div>
					<h1 className='mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
						Buy and Sell Bitcoin in person
					</h1>

					<p className='mt-6 text-lg leading-8 text-gray-600'>
						Create an anonymous post at the location you want to meet. Once
						someone responds to your post, meet up and complete the transaction
						in person.
					</p>
					<div className='mt-10 flex items-center gap-x-6'>
						<a
							onClick={handleLogin}
							className='cursor-pointer rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
							Login with Lightning
						</a>
						<a
							href='https://twitter.com/localsatsorg'
							className='text-base font-semibold leading-7 text-gray-900'>
							Learn more <span aria-hidden='true'>→</span>
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

			<footer className='bg-white' aria-labelledby='footer-heading'>
				<h2 id='footer-heading' className='sr-only'>
					Footer
				</h2>
				<div className='mx-auto max-w-7xl px-6 pb-8  lg:px-8 '>
					<div className=' border-t border-gray-900/10 pt-8  md:flex md:items-center md:justify-between '>
						<div className='flex space-x-6 md:order-2'>
							<a
								key={'tips'}
								href={'https://tippin.me/@sndbtc'}
								className='text-gray-400 hover:text-gray-500'>
								<span className='sr-only'>{'Tip me'}</span>
								Tips
								{/* <item.icon className='h-6 w-6' aria-hidden='true' /> */}
							</a>
							{navigation.social.map((item) => (
								<a
									key={item.name}
									href={item.href}
									className='text-gray-400 hover:text-gray-500'>
									<span className='sr-only'>{item.name}</span>
									<item.icon className='h-6 w-6' aria-hidden='true' />
								</a>
							))}
						</div>
						<p className='mt-8 text-xs leading-5 text-gray-500 md:order-1 md:mt-0'>
							&copy; {dayjs().year()} localsats.org, All rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</div>
	)
}

export const getServerSideProps = async function ({ req, res }) {
	const user = req?.session?.passport?.user
	if (user) {
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
