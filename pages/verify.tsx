import { useText } from '@/hooks/useText'
import { getServerSession } from 'next-auth'
import React from 'react'
import { Layout } from '@/components/layout'
import { handleLogout } from '@/utils/utils'
import { getOptions } from '@/lib/next-auth-lnurl'
import { lnurlAuthConfig } from '@/lib/lnurlAuthConfig'
import { LightningPassphraseModal } from '@/components/LightningPassphraseModal'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

export default function Profile({ user }) {
	const { data: passphraseCookie, isFetched: passphraseCookieIsFetched } =
		useQuery<string>(
			['status-cookie'],
			() =>
				axios.get(`/api/pgpln/get_passphrase_cookie`).then((data) => data.data),
			{
				refetchInterval: 5000,
				refetchIntervalInBackground: true
			}
		)

	console.log('passphraseCookie', passphraseCookie)

	const t = useText()
	return (
		<div className='h-screen flex items-center flex-col gap-16 break-all text-center'>
			Verify
			<input
				readOnly
				checked={!!!passphraseCookie}
				type='checkbox'
				id='passphrase-modal'
				className='modal-toggle'
			/>
			<LightningPassphraseModal />
		</div>
	)
}
Profile.getLayout = function getLayout(page) {
	return <Layout title='Profile'>{page}</Layout>
}

export const getServerSideProps = async function ({ req, res }) {
	const session = await getServerSession(req, res, getOptions(lnurlAuthConfig))
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
