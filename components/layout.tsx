import React, { Fragment, ReactNode } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { classNames, getNameFromId, handleLogout } from '../utils/utils'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

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

	return (
		<div className='min-h-full'>
			<Disclosure as='nav' className='bg-gray-800'>
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

			<header className='bg-white shadow-sm'>
				<div className='mx-auto max-w-7xl py-4 px-4 sm:px-6 lg:px-8'>
					<h1 className='text-lg font-semibold leading-6 text-gray-900'>
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
