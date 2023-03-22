import { getServerSession } from 'next-auth'
import React from 'react'
import { Layout } from '../components/layout'
import { handleLogout } from '../utils/utils'
import { authOptions } from './api/auth/[...nextauth]'

export default function Profile({ user }) {
	return (
		<div className='h-screen flex items-center flex-col gap-16 break-all text-center'>
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
				className='btn-primary btn btn-wide'
				onClick={handleLogout}>
				Sign Out
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
