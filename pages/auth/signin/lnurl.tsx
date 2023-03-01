import { LightningQRCode } from 'components/LightningQRCode'
import { NextLink } from 'components/NextLink'
import { PageRoutes } from 'lib/PageRoutes'
import { defaultFetcher } from 'lib/swr'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import useSWR, { SWRConfiguration } from 'swr'
import useSWRImmutable from 'swr/immutable'
import { LnurlAuthLoginInfo } from 'types/LnurlAuthLoginInfo'
import { LnurlAuthStatus } from 'types/LnurlAuthStatus'

const useLnurlStatusConfig: SWRConfiguration = { refreshInterval: 1000 }

type LnurlAuthSignInProps = {
	callbackUrl?: string
	isPreview?: boolean
}

export default function LnurlAuthSignIn({
	callbackUrl,
	isPreview
}: LnurlAuthSignInProps) {
	const router = useRouter()
	const linkExistingAccount = router.query['link'] === 'true'
	const [isRedirecting, setRedirecting] = React.useState(false)
	const callbackUrlWithFallback =
		callbackUrl ||
		(router.query['callbackUrl'] as string) ||
		PageRoutes.dashboard
	// only retrieve the qr code once
	const { data: lnurlAuthLoginInfo, mutate: fetchNewQR } =
		useSWRImmutable<LnurlAuthLoginInfo>(
			`/api/auth/lnurl/generate-secret?linkExistingAccount=${linkExistingAccount}&isPreview=${isPreview}}`,
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
		if (status?.used && !status.verified && !isRedirecting && !isPreview) {
			// toast.error("Generating new QR code");
			fetchNewQR()
		}
	}, [fetchNewQR, isRedirecting, status?.used, status?.verified, isPreview])

	React.useEffect(() => {
		console.log('useeffect')
		if (lnurlAuthLoginInfo && status?.verified) {
			setRedirecting(true)
			;(async () => {
				try {
					console.log('lnurlAuthLoginInfo && status?.verified')
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
					//  toast.error("login failed");
				}
			})()
		}
	}, [callbackUrlWithFallback, isPreview, lnurlAuthLoginInfo, router, status])

	return (
		<>
			{lnurlAuthLoginInfo ? (
				<NextLink href={`lightning:${lnurlAuthLoginInfo.lnurl_auth}`}>
					<LightningQRCode value={lnurlAuthLoginInfo.lnurl_auth} />
				</NextLink>
			) : (
				<p>loading</p>
			)}
		</>
	)
}
