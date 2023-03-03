import { LightningQRCode } from 'components/LightningQRCode'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { LnurlAuthStatus } from 'types/LnurlAuthStatus'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type LnurlAuthSignInProps = {
	callbackUrl?: string
	lnurlAuthLoginInfo?: any
}

export default function LnurlAuthSignIn({
	callbackUrl,
	lnurlAuthLoginInfo: initialLoginInfo
}: LnurlAuthSignInProps) {
	const router = useRouter()
	const session = useSession()
	const [isRedirecting, setRedirecting] = React.useState(false)
	const callbackUrlWithFallback =
		callbackUrl || (router.query['callbackUrl'] as string) || '/home'
	// only retrieve the qr code once
	const { data: lnurlAuthLoginInfo, refetch: fetchNewQR } = useQuery(
		['generate-secret'],
		() =>
			axios.get(`/api/auth/lnurl/generate-secret`).then((data) => data.data),
		{
			refetchOnWindowFocus: false,
			initialData: initialLoginInfo
		}
	)

	const { data: status, refetch: statusMutate } = useQuery<LnurlAuthStatus>(
		['status'],
		() =>
			axios
				.get(`/api/auth/lnurl/status?k1=${lnurlAuthLoginInfo?.k1}`)
				.then((data) => data.data),
		{
			refetchInterval: 1000
		}
	)

	React.useEffect(() => {
		if (status?.used && !status.verified && !isRedirecting) {
			fetchNewQR()
		}
	}, [fetchNewQR, isRedirecting, status?.used, status?.verified])

	React.useEffect(() => {
		if (lnurlAuthLoginInfo && status?.verified) {
			setRedirecting(true)
			;(async () => {
				try {
					const result = await signIn('lnurl', {
						k1: lnurlAuthLoginInfo.k1,
						callbackUrl: callbackUrlWithFallback,
						locale: router.locale || 'en',
						redirect: false
					})

					statusMutate()

					if (result && result.ok && result.url) {
						router.push(result.url)
					} else {
						throw new Error('Unexpected login result: ' + result?.error)
					}
				} catch (error) {
					console.error(error)
				}
			})()
		}
	}, [callbackUrlWithFallback, lnurlAuthLoginInfo, router, status])

	// if logged in, redirect to dashboard
	React.useEffect(() => {
		if (session.status === 'authenticated' && !isRedirecting) {
			router.push(callbackUrlWithFallback)
		}
	}, [callbackUrlWithFallback, router, status, session])

	const url = `lightning:${lnurlAuthLoginInfo?.lnurl_auth}`
	return (
		<>
			{lnurlAuthLoginInfo ? (
				<Link href={url}>
					<LightningQRCode value={url} />
				</Link>
			) : (
				<p>Loading...</p>
			)}
		</>
	)
}
