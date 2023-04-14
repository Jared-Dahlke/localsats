import { LightningQRCode } from 'components/LightningQRCode'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { LnurlAuthStatus } from 'types/LnurlAuthStatus'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useText } from '@/hooks/useText'
import { LnurlAuthLoginInfo } from '@/types/LnurlAuthLoginInfo'
import { LoadingSpinner } from '@/components/loading'
import { classNames } from '@/utils/utils'

type LnurlAuthSignInProps = {
	callbackUrl?: string
	lnurlAuthLoginInfo?: LnurlAuthLoginInfo
	isMobile?: boolean
}

export default function LnurlAuthSignIn({
	callbackUrl,
	lnurlAuthLoginInfo: initialLoginInfo,
	isMobile
}: LnurlAuthSignInProps) {
	const router = useRouter()
	const [isRedirecting, setRedirecting] = React.useState(false)
	const callbackUrlWithFallback =
		callbackUrl || (router.query['callbackUrl'] as string) || '/home'
	const { data: lnurlAuthLoginInfo, refetch: fetchNewQR } = useQuery(
		['generate-secret'],
		() =>
			axios.get(`/api/auth/lnurl/generate-secret`).then((data) => data.data),
		{
			refetchOnWindowFocus: false,
			initialData: initialLoginInfo
		}
	)

	const { data: status } = useQuery<LnurlAuthStatus>(
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
		if (lnurlAuthLoginInfo && status?.verified && !isRedirecting) {
			setRedirecting(true)
			;(async () => {
				try {
					const result = await signIn('lnurl', {
						k1: lnurlAuthLoginInfo.k1,
						callbackUrl: callbackUrlWithFallback,
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

	const t = useText()
	const url = `lightning:${lnurlAuthLoginInfo?.lnurl_auth}`

	return (
		<div className='relative'>
			{isMobile === true ? (
				<Link
					aria-disabled={true}
					className={classNames(
						'btn btn-primary',
						isRedirecting ? 'loading' : ''
					)}
					href={url}>
					{t.loginWithLightning}
				</Link>
			) : (
				<div className='relative'>
					<Link href={isRedirecting ? '' : url}>
						<LightningQRCode value={url} />
					</Link>
					{isRedirecting && !isMobile && (
						<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
							<LoadingSpinner size={64} />
						</div>
					)}
				</div>
			)}
		</div>
	)
}
