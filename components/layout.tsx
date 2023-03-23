import React, { Fragment, ReactNode } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { classNames, getNameFromId, handleLogout } from '../utils/utils'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { browser } from 'process'

export function Layout({ children }: { children: ReactNode }) {
	const router = useRouter()

	const session = useSession()
	const user = session?.data?.user?.userId

	const navigation = [
		{
			name: 'Home',
			handleClick: () => router.push('/home'),
			current: router.pathname.includes('home')
		},
		{
			name: 'About',
			handleClick: () => router.push('/about'),
			current: router.pathname.includes('about')
		},
		{
			name: 'Profile',
			handleClick: () => router.push('/profile'),
			current: router.pathname.includes('profile')
		}
	]

	const currentNavItem = navigation?.find((item) => item.current)

	const userNavigation = [
		{ name: 'Sign out', handleClick: () => handleLogout() }
	]

	const [theme, setTheme] = React.useState<'dark' | 'light'>('light')

	React.useEffect(() => {
		if (typeof window !== 'undefined') {
			const doc = document.querySelector('html')
			doc && doc.setAttribute('data-theme', theme)
		}
	}, [theme])

	return (
		<div>
			<Disclosure as='nav' className='bg-primary'>
				{({ open }) => (
					<>
						<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
							<div className='flex h-16 items-center justify-between'>
								<div className='flex items-center'>
									<div className='flex-shrink-0'>
										<Link
											href='/'
											className={
												'text-gray-100 cursor-pointer pr-3 py-2 rounded-md text-lg font-medium'
											}>
											localsats.org
										</Link>
									</div>
									<div className='hidden md:block'>
										<div className='ml-10 flex items-baseline space-x-4'>
											{navigation.map((item) => (
												<div
													key={item.name}
													onClick={item.handleClick}
													className={classNames(
														item.current
															? 'bg-gray-900 text-white'
															: 'text-gray-300 hover:bg-gray-700 hover:text-white',
														'px-3 py-2 rounded-md text-sm font-medium cursor-pointer'
													)}
													aria-current={item.current ? 'page' : undefined}>
													{item.name}
												</div>
											))}
										</div>
									</div>
								</div>
								<div className='hidden md:block'>
									<div className='ml-4 flex items-center md:ml-6'>
										{/* Profile dropdown */}

										<label className='swap swap-rotate text-base-200 mr-3'>
											<input
												onChange={() => {
													setTheme((prev) =>
														prev === 'dark' ? 'light' : 'dark'
													)
												}}
												checked={theme === 'light'}
												className='hidden'
												type='checkbox'
											/>

											<svg
												className='swap-on fill-white w-6 h-6'
												xmlns='http://www.w3.org/2000/svg'
												viewBox='0 0 24 24'>
												<path d='M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z' />
											</svg>

											<svg
												className='swap-off fill-white w-6 h-6'
												xmlns='http://www.w3.org/2000/svg'
												viewBox='0 0 24 24'>
												<path d='M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z' />
											</svg>
										</label>

										<Menu as='div' className='relative ml-3'>
											<div>
												<Menu.Button className='flex max-w-xs items-center rounded-full bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
													<span className='sr-only'>Open user menu</span>
													<img
														className='h-8 w-8 rounded-full'
														src={`https://robohash.org/${user}.png?size=500x500`}
														alt=''
														style={{
															background: 'white'
														}}
													/>
												</Menu.Button>
											</div>
											<Transition
												as={Fragment}
												enter='transition ease-out duration-100'
												enterFrom='transform opacity-0 scale-95'
												enterTo='transform opacity-100 scale-100'
												leave='transition ease-in duration-75'
												leaveFrom='transform opacity-100 scale-100'
												leaveTo='transform opacity-0 scale-95'>
												<Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
													{userNavigation.map((item) => (
														<Menu.Item key={item.name}>
															{({ active }) => (
																<a
																	onClick={item.handleClick}
																	className={classNames(
																		active ? 'bg-gray-100' : '',
																		'block px-4 py-2 text-sm text-gray-700 cursor-pointer'
																	)}>
																	{item.name}
																</a>
															)}
														</Menu.Item>
													))}
												</Menu.Items>
											</Transition>
										</Menu>
									</div>
								</div>
								<div className='-mr-2 flex md:hidden'>
									{/* Mobile menu button */}
									<Disclosure.Button className='inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
										<span className='sr-only'>Open main menu</span>
										{open ? (
											<XMarkIcon className='block h-6 w-6' aria-hidden='true' />
										) : (
											<Bars3Icon className='block h-6 w-6' aria-hidden='true' />
										)}
									</Disclosure.Button>
								</div>
							</div>
						</div>

						<Disclosure.Panel className='md:hidden'>
							<div className='space-y-1 px-2 pt-2 pb-3 sm:px-3'>
								{navigation.map((item) => (
									<Disclosure.Button
										key={item.name}
										//		as='a'
										onClick={item.handleClick}
										///		href={item.href}
										className={classNames(
											item.current
												? 'bg-gray-900 text-white'
												: 'text-gray-300 hover:bg-gray-700 hover:text-white',
											'block px-3 py-2 rounded-md text-base font-medium'
										)}
										aria-current={item.current ? 'page' : undefined}>
										{item.name}
									</Disclosure.Button>
								))}
							</div>

							<div className='border-t border-gray-700 pt-4 pb-3'>
								<label className='swap swap-rotate text-base-200 ml-6 mb-3'>
									<input
										onChange={() => {
											setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
										}}
										checked={theme === 'light'}
										className='hidden'
										type='checkbox'
									/>

									<svg
										className='swap-on fill-white w-6 h-6'
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 24 24'>
										<path d='M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z' />
									</svg>

									<svg
										className='swap-off fill-white w-6 h-6'
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 24 24'>
										<path d='M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z' />
									</svg>
								</label>

								<div className='flex items-center px-5'>
									<div className='flex-shrink-0'>
										<img
											className='h-8 w-8 rounded-full'
											src={`https://robohash.org/${user}.png?size=500x500`}
											alt=''
											style={{
												background: 'white'
											}}
										/>
									</div>
									<div className='ml-3'>
										<div className='text-base font-medium text-white'>
											{getNameFromId(user)}
										</div>
										{/* <div className='text-sm font-medium text-gray-400'>
											{user.email}
										</div> */}
									</div>
									{/* <NotificationsMenu>
										<button
											type='button'
											className='ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
											<span className='sr-only'>View notifications</span>
											<BellIcon className='h-6 w-6' aria-hidden='true' />
										</button>
									</NotificationsMenu> */}
								</div>
								<div className='mt-3 space-y-1 px-2'>
									{userNavigation.map((item) => (
										<Disclosure.Button
											key={item.name}
											//	as='a'
											onClick={item.handleClick}
											// href={item.href}
											className='block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white'>
											{item.name}
										</Disclosure.Button>
									))}
								</div>
							</div>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>

			<header className='bg-base shadow-sm'>
				<div className='mx-auto max-w-7xl py-4 px-4 sm:px-6 lg:px-8'>
					<h1 className='text-lg font-semibold leading-6 '>
						{currentNavItem?.name}
					</h1>
				</div>
			</header>
			<main>
				<div className='mx-auto max-w-7xl py-4 px-4 sm:px-6 lg:px-8'>
					{/* Replace with your content */}
					{children}
					{/* /End replace */}
				</div>
			</main>
		</div>
	)
}
