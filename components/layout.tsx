import React, { Fragment, ReactNode } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { classNames, getNameFromId, handleLogout } from '../utils/utils'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

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
										<a
											href='/'
											className={
												'text-gray-100 cursor-pointer pr-3 py-2 rounded-md text-lg font-medium'
											}>
											localsats.org
										</a>
										{/* <svg
											className='h-8 w-8'
											xmlns='http://www.w3.org/2000/svg'
											//	xml:space='preserve'
											width='100%'
											height='100%'
											version='1.1'
											shape-rendering='geometricPrecision'
											text-rendering='geometricPrecision'
											image-rendering='optimizeQuality'
											fill-rule='evenodd'
											clip-rule='evenodd'
											viewBox='0 0 4091.27 4091.73'
											//xmlns:xlink='http://www.w3.org/1999/xlink'
											//xmlns:xodm='http://www.corel.com/coreldraw/odm/2003'
										>
											<g id='Layer_x0020_1'>
												<metadata id='CorelCorpID_0Corel-Layer' />
												<g id='_1421344023328'>
													<path
														fill='#F7931A'
														fill-rule='nonzero'
														d='M4030.06 2540.77c-273.24,1096.01 -1383.32,1763.02 -2479.46,1489.71 -1095.68,-273.24 -1762.69,-1383.39 -1489.33,-2479.31 273.12,-1096.13 1383.2,-1763.19 2479,-1489.95 1096.06,273.24 1763.03,1383.51 1489.76,2479.57l0.02 -0.02z'
													/>
													<path
														fill='white'
														fill-rule='nonzero'
														d='M2947.77 1754.38c40.72,-272.26 -166.56,-418.61 -450,-516.24l91.95 -368.8 -224.5 -55.94 -89.51 359.09c-59.02,-14.72 -119.63,-28.59 -179.87,-42.34l90.16 -361.46 -224.36 -55.94 -92 368.68c-48.84,-11.12 -96.81,-22.11 -143.35,-33.69l0.26 -1.16 -309.59 -77.31 -59.72 239.78c0,0 166.56,38.18 163.05,40.53 90.91,22.69 107.35,82.87 104.62,130.57l-104.74 420.15c6.26,1.59 14.38,3.89 23.34,7.49 -7.49,-1.86 -15.46,-3.89 -23.73,-5.87l-146.81 588.57c-11.11,27.62 -39.31,69.07 -102.87,53.33 2.25,3.26 -163.17,-40.72 -163.17,-40.72l-111.46 256.98 292.15 72.83c54.35,13.63 107.61,27.89 160.06,41.3l-92.9 373.03 224.24 55.94 92 -369.07c61.26,16.63 120.71,31.97 178.91,46.43l-91.69 367.33 224.51 55.94 92.89 -372.33c382.82,72.45 670.67,43.24 791.83,-303.02 97.63,-278.78 -4.86,-439.58 -206.26,-544.44 146.69,-33.83 257.18,-130.31 286.64,-329.61l-0.07 -0.05zm-512.93 719.26c-69.38,278.78 -538.76,128.08 -690.94,90.29l123.28 -494.2c152.17,37.99 640.17,113.17 567.67,403.91zm69.43 -723.3c-63.29,253.58 -453.96,124.75 -580.69,93.16l111.77 -448.21c126.73,31.59 534.85,90.55 468.94,355.05l-0.02 0z'
													/>
												</g>
											</g>
										</svg> */}
									</div>
									<div className='hidden md:block'>
										<div className='ml-10 flex items-baseline space-x-4'>
											{navigation.map((item) => (
												<a
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
												</a>
											))}
										</div>
									</div>
								</div>
								<div className='hidden md:block'>
									<div className='ml-4 flex items-center md:ml-6'>
										{/* <NotificationsMenu>
											<button
												type='button'
												className='relative rounded-full bg-gray-800 p-1 mt-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
												<span className='sr-only'>View notifications</span>
												<BellIcon className='h-6 w-6' aria-hidden='true' />
												{postsWithNewMessagesCount > 0 && (
													<div className='h-2 w-2 rounded-full bg-green-400 absolute right-1 top-1' />
												)}
											</button>
										</NotificationsMenu> */}

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
