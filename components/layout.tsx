import React, { ReactNode } from 'react'
import {
	ChatBubbleLeftIcon,
	CogIcon,
	HomeIcon,
	InformationCircleIcon,
	PaperClipIcon
} from '@heroicons/react/24/outline'
import { classNames, getNameFromId, handleLogout } from '@/utils/utils'
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
					<div className='w-full flex items-center lg:justify-between sm:px-8 px-1  bg-base-300 h-16'>
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
								<div className='tabs h-16'>
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
										<li className='w-full flex mr-auto'>
											<label tabIndex={0} className='btn btn-ghost'>
												<img
													className='h-7 w-7 rounded-full cursor-pointer bg-base-100'
													src={`https://robohash.org/${user}.png?size=500x500`}
													alt=''
												/>

												<a onClick={handleLogout}>{getNameFromId(user)}</a>
											</label>
										</li>
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
