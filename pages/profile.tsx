import { getServerSession } from 'next-auth'
import React from 'react'
import { Layout } from '../components/layout'
import { handleLogout } from '../utils/utils'
import { authOptions } from './api/auth/[...nextauth]'

export default function Profile({ user }) {
	return (
		<div className='bg-white flex justify-center items-center flex-col gap-16 break-all text-center'>
			<div
				className='inline-block h-60 w-60 flex-shrink-0 overflow-hidden rounded-full'
				aria-hidden='true'>
				<img
					className='h-full w-full rounded-full'
					src={`https://robohash.org/${user}.png?size=500x500`}
					alt=''
				/>
			</div>
			<div>
				<p>Your User ID from LNURL-auth:</p>
				{user}
			</div>
			<button
				type='button'
				className='inline-flex w-64 justify-center rounded-md border border-transparent bg-slate-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm'
				onClick={handleLogout}>
				Logout
			</button>
		</div>
	)
}
Profile.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>
}

export const getServerSideProps = async function ({ req, res }) {
	const session = await getServerSession(req, res, authOptions)
	const user = session?.user?.userId
	if (!user) {
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		}
	}
	return {
		props: { user }
	}
}
