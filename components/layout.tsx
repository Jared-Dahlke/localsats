import React, { ReactNode } from 'react'
import { handleLogout } from '../utils/utils'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { Footer } from './footer'

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

	return (
		<div data-theme='light'>
			<div className='navbar bg-base-300'>
				<div className='navbar-start'>
					<div className='dropdown'>
						<label tabIndex={0} className='btn btn-ghost lg:hidden'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M4 6h16M4 12h8m-8 6h16'
								/>
							</svg>
						</label>
						<ul
							tabIndex={0}
							className='menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52'>
							{navigation.map((item) => (
								<li key={item.name}>
									<a
										className={item.current ? 'bg-base-100' : ''}
										onClick={item.handleClick}>
										{item.name}
									</a>
								</li>
							))}
						</ul>
					</div>
					<a className='btn btn-ghost normal-case text-xl'>LocalSats.org</a>
				</div>
				<div className='navbar-center hidden lg:flex'>
					<ul className='menu menu-horizontal px-1'>
						{navigation.map((item) => (
							<li key={item.name}>
								<a
									className={item.current ? 'bg-base-100' : ''}
									onClick={item.handleClick}>
									{item.name}
								</a>
							</li>
						))}
					</ul>
				</div>
				<div className='navbar-end'>
					<div className='dropdown dropdown-end'>
						<label
							tabIndex={0}
							className='btn btn-ghost btn-circle avatar bg-base-100'>
							<div className='w-10 rounded-full'>
								<img src={`https://robohash.org/${user}.png?size=500x500`} />
							</div>
						</label>
						<ul
							tabIndex={0}
							className='menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52'>
							<li>
								<a onClick={handleLogout}>Logout</a>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<header className=' shadow-sm'>
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

			<Footer />
		</div>
	)
}
