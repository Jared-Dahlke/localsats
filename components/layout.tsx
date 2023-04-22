import React, { ReactNode } from 'react'
import { Disclosure } from '@headlessui/react'
import {
	Bars3Icon,
	ChatBubbleLeftIcon,
	CogIcon,
	HomeIcon,
	InformationCircleIcon,
	PaperClipIcon
} from '@heroicons/react/24/outline'
import { classNames, handleLogout } from '@/utils/utils'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useText } from '@/hooks/useText'
import Head from 'next/head'
import { ThemeSwitcher } from './ThemeSwitcher'

export function Layout({
	children,
	title,
	breadCrumbs
}: {
	children: ReactNode
	title: string
	breadCrumbs?: { name: string; href: string }[]
}) {
	const router = useRouter()
	const t = useText()
	const session = useSession()
	const user = session?.data?.user?.userId
	const [drawerIsOpen, setDrawerIsOpen] = React.useState(false)

	const navigation = [
		{
			name: t.home,
			handleClick: () => {
				setDrawerIsOpen(false)
				router.push('/home')
			},
			icon: <HomeIcon className='h-6 w-6' />
		},
		{
			name: 'Chats',
			handleClick: () => {
				setDrawerIsOpen(false)
				router.push('/chats')
			},
			icon: <ChatBubbleLeftIcon className='h-6 w-6' />
		},
		{
			name: 'My Orders',
			handleClick: () => {
				setDrawerIsOpen(false)
				router.push('/orders')
			},
			icon: <PaperClipIcon className='h-6 w-6' />
		},
		{
			name: t.about,
			handleClick: () => {
				setDrawerIsOpen(false)
				router.push('/about')
			},
			icon: <InformationCircleIcon className='h-6 w-6' />
		},
		// {
		// 	name: t.profile,
		// 	handleClick: () => router.push('/profile')
		// },
		{
			name: 'Settings',
			handleClick: () => {
				setDrawerIsOpen(false)
				router.push('/settings')
			},
			icon: <CogIcon className='h-6 w-6' />
		}
	]

	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>

			<div className='drawer'>
				<input
					id='my-drawer-3'
					type='checkbox'
					className='drawer-toggle'
					checked={drawerIsOpen}
					onChange={() => setDrawerIsOpen((prev) => !prev)}
				/>
				<div className='drawer-content flex flex-col'>
					{/* page start */}
					<div className='w-full flex items-center lg:justify-between sm:px-8 px-1  bg-base-300 h-14'>
						<div className='flex-none lg:hidden mr-3'>
							<label htmlFor='my-drawer-3' className='btn btn-square btn-ghost'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
									className='inline-block w-6 h-6 stroke-current'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='2'
										d='M4 6h16M4 12h16M4 18h16'></path>
								</svg>
							</label>
						</div>
						<div className='flex-none w-1/5'>
							<Link
								href='/'
								className={'cursor-pointer pr-3 py-2 rounded-md  text-xl'}>
								localsats.org
							</Link>
						</div>
						<div className='flex-none hidden lg:block  w-3/5'>
							<div className='flex gap-2 items-center justify-center'>
								<div className='tabs h-14'>
									{navigation.map((item, index) => (
										<button
											key={item.name}
											className={classNames(
												item.name.includes(title)
													? 'tab tab-bordered tab-active'
													: 'tab tab-bordered',
												''
											)}
											onClick={item.handleClick}
											aria-current={item.name === title ? 'page' : undefined}>
											{item.name}
										</button>
									))}
								</div>
							</div>
						</div>
						<div className='flex-none hidden lg:flex justify-end  w-1/5'>
							<div className='flex gap-0'>
								<ThemeSwitcher />
								<div className=' dropdown dropdown-end'>
									<label tabIndex={0} className='btn btn-ghost'>
										<img
											className='h-7 w-7 rounded-full cursor-pointer bg-base-100'
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
					</div>
					<header className='sm:px-8 px-4 bg-base shadow-base-300 shadow-sm h-12 flex justify-start items-center'>
						<div className='flex gap-5'>
							<div className='prose'>
								<h3 className='font-normal'>{title}</h3>
							</div>
							{breadCrumbs && (
								<div className='text-sm breadcrumbs'>
									<ul>
										{breadCrumbs.map((item, index) => (
											<li key={index}>
												<a href={item.href}>{item.name}</a>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</header>
					<main className='flex-1 overflow-auto sm:p-8 p-4 '>{children}</main>
					{/* page end */}
				</div>

				<div className='drawer-side'>
					<label htmlFor='my-drawer-3' className='drawer-overlay'></label>
					<div className='menu p-4 w-80 bg-base-100'>
						<div className='w-full justify-start flex pl-4'>
							<img
								className='h-7 w-7 rounded-full cursor-pointer bg-base-300'
								src={`https://robohash.org/${user}.png?size=500x500`}
								alt=''
							/>
						</div>

						<ul className='p-4 bg-base-100 flex flex-col gap-10 mt-8'>
							{navigation.map((item, index) => (
								<a
									key={item.name}
									className={classNames(
										item.name.includes(title)
											? 'text-accent-content font-bold'
											: '',
										'flex items-center gap-6 w-full '
									)}
									onClick={item.handleClick}
									aria-current={item.name === title ? 'page' : undefined}>
									{item.icon}
									{item.name}
								</a>
							))}
						</ul>
						<div className='flex justify-between w-full mt-auto'>
							<ThemeSwitcher />
							<button
								onClick={handleLogout}
								className='btn btn-ghost bg-base-300 text-accent-content'>
								{t.signOut}
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

/*
	<Disclosure as='nav' className='bg-base-300  justify-between h-16'>
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
											{navigation.map((item, index) => (
												<div
													key={item.name}
													onClick={item.handleClick}
													className={classNames(
														item.name.includes(title)
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
										
										<ThemeSwitcher />
										<div className=' dropdown dropdown-end ml-3'>
											<label tabIndex={0} className='btn btn-ghost'>
												<img
													className='h-7 w-7 rounded-full cursor-pointer bg-base-100'
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

						<Disclosure.Panel className='md:hidden !bg-red-500 !z-50'>
							<div className='space-y-1 px-2 pt-2 pb-3 sm:px-3 flex flex-col '>
								{navigation.map((item, index) => (
									<Disclosure.Button
										key={item.name}
										onClick={item.handleClick}
										className={classNames(
											item.name.includes(title)
												? 'btn btn-primary'
												: 'btn btn-ghost',
											'normal-case !'
										)}
										aria-current={item.name === title ? 'page' : undefined}>
										{item.name} + {'mobile'}
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
											{item.name} + 'test'
										</Disclosure.Button>
									))}
								</div>
							</div>
						</Disclosure.Panel>
					</>
				)}
			</Disclosure>

*/
