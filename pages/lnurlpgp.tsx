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
	isMobile?: boolean
}

export default function LnurlAuthPgp({ isMobile }: LnurlAuthSignInProps) {
	const [isRedirecting, setRedirecting] = React.useState(false)

	const { data: lnurlAuthLoginInfo, refetch: fetchNewQR } = useQuery(
		['generate-secret-pgp'],
		() => axios.get(`/api/pgpln/generate-secret-pgp`).then((data) => data.data),
		{
			refetchOnWindowFocus: false
		}
	)

	console.log('lnurlAuthLoginInfo', lnurlAuthLoginInfo)

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
