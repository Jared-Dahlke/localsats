import React, { ReactNode } from 'react'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { classNames, getNameFromId, handleLogout } from '@/utils/utils'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useText } from '@/hooks/useText'
import Head from 'next/head'

export function Layout({
	children,
	title
}: {
	children: ReactNode
	title: string
}) {
	const router = useRouter()
	const t = useText()
	const session = useSession()
	const user = session?.data?.user?.userId

	const navigation = [
		{
			name: t.home,
			handleClick: () => router.push('/home')
		},
		{
			name: t.about,
			handleClick: () => router.push('/about')
		},
		{
			name: t.profile,
			handleClick: () => router.push('/profile')
		}
	]

	const userNavigation = [
		{ name: t.signOut, handleClick: () => handleLogout() }
	]

	return (
		<div>
			<Head>
				<title>{title}</title>
			</Head>
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
														item.name === title
															? 'bg-gray-900 text-white'
															: 'text-gray-300 hover:bg-gray-700 hover:text-white',
														'px-3 py-2 rounded-md text-sm font-medium cursor-pointer'
													)}
													aria-current={
														item.name === title ? 'page' : undefined
													}>
													{item.name}
												</div>
											))}
										</div>
									</div>
								</div>
								<div className='hidden md:block'>
									<div className='ml-4 flex items-center md:ml-6'>
										{/* Profile dropdown */}

										<div className=' dropdown dropdown-end'>
											<label tabIndex={0} className=''>
												<img
													className='h-8 w-8 rounded-full cursor-pointer'
													src={`https://robohash.org/${user}.png?size=500x500`}
													alt=''
													style={{
														background: 'white'
													}}
												/>
											</label>
											<ul
												tabIndex={0}
												className='dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52'>
												<li>
													<a onClick={handleLogout}>{t.signOut}</a>
												</li>
											</ul>
										</div>
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
										onClick={item.handleClick}
										className={classNames(
											item.name === title
												? 'bg-gray-900 text-white'
												: 'text-gray-300 hover:bg-gray-700 hover:text-white',
											'block px-3 py-2 rounded-md text-base font-medium'
										)}
										aria-current={item.name === title ? 'page' : undefined}>
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

			<header className='bg-base shadow-sm'>
				<div className='mx-auto max-w-7xl py-4 px-4 sm:px-6 lg:px-8'>
					<h1 className='text-lg font-semibold leading-6 '>{title}</h1>
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
