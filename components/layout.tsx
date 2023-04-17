import React, { ReactNode } from 'react'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { classNames, getNameFromId, handleLogout } from '@/utils/utils'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useText } from '@/hooks/useText'
import Head from 'next/head'
import { ThemeSwitcher } from './ThemeSwitcher'

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
		// {
		// 	name: 'Messages',
		// 	handleClick: () => router.push('/messages')
		// },
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
			<Disclosure as='nav' className='bg-base-300'>
				{({ open }) => (
					<>
						<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
							<div className='flex h-16 items-center justify-between'>
								<div className='flex items-center'>
									<div className='flex-shrink-0'>
										<Link
											href='/'
											className={
												'cursor-pointer pr-3 py-2 rounded-md text-lg font-medium'
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
															? 'btn btn-primary'
															: 'btn btn-ghost',
														'normal-case'
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
										<ThemeSwitcher />
										<div className=' dropdown dropdown-end ml-3'>
											<label tabIndex={0} className='btn btn-ghost'>
												<img
													className='h-9 w-9 rounded-full cursor-pointer bg-base-100'
													src={`https://robohash.org/${user}.png?size=500x500`}
													alt=''
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
								<div className='flex md:hidden'>
									{/* Mobile menu button */}

									<Disclosure.Button className='btn btn-ghost bg-base-100'>
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
							<div className='space-y-1 px-2 pt-2 pb-3 sm:px-3 flex flex-col'>
								{navigation.map((item) => (
									<Disclosure.Button
										key={item.name}
										onClick={item.handleClick}
										className={classNames(
											item.name === title ? 'btn btn-primary' : 'btn btn-ghost',
											'normal-case'
										)}
										aria-current={item.name === title ? 'page' : undefined}>
										{item.name}
									</Disclosure.Button>
								))}
							</div>

							<div className='border-t border-gray-700 pt-4 pb-3  px-2  sm:px-3 flex flex-col mt-3'>
								<div className='flex items-center mt-3'>
									<div className='flex-shrink-0 btn btn-ghost'>
										<img
											className='h-8 w-8 rounded-full bg-base-100'
											src={`https://robohash.org/${user}.png?size=500x500`}
											alt=''
										/>
									</div>
									<div className='ml-3'>
										<div className='text-base font-medium'>
											{getNameFromId(user)}
										</div>
									</div>
								</div>
								<div className='flex justify-between mt-5'>
									<ThemeSwitcher />
									{userNavigation.map((item) => (
										<Disclosure.Button
											key={item.name}
											onClick={item.handleClick}
											className='btn btn-outline'>
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
