import { LightningQRCode } from 'components/LightningQRCode'
import { defaultFetcher } from 'lib/swr'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import useSWR, { SWRConfiguration } from 'swr'
import useSWRImmutable from 'swr/immutable'
import { LnurlAuthLoginInfo } from 'types/LnurlAuthLoginInfo'
import { LnurlAuthStatus } from 'types/LnurlAuthStatus'

const useLnurlStatusConfig: SWRConfiguration = { refreshInterval: 1000 }

type LnurlAuthSignInProps = {
	callbackUrl?: string
}

export default function LnurlAuthSignIn({ callbackUrl }: LnurlAuthSignInProps) {
	const router = useRouter()
	const session = useSession()
	const [isRedirecting, setRedirecting] = React.useState(false)
	const callbackUrlWithFallback =
		callbackUrl || (router.query['callbackUrl'] as string) || '/dashboard'
	// only retrieve the qr code once
	const { data: lnurlAuthLoginInfo, mutate: fetchNewQR } =
		useSWRImmutable<LnurlAuthLoginInfo>(
			`/api/auth/lnurl/generate-secret`,
			defaultFetcher
		)

	const { data: status } = useSWR<LnurlAuthStatus>(
		lnurlAuthLoginInfo
			? `/api/auth/lnurl/status?k1=${lnurlAuthLoginInfo.k1}`
			: null,
		defaultFetcher,
		useLnurlStatusConfig
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
				<p>loading</p>
			)}
		</>
	)
}
