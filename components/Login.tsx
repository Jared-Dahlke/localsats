import LnurlAuthSignIn from 'pages/auth/signin/lnurl'
import React from 'react'

type LoginProps = {
	callbackUrl?: string
	isPreview?: boolean
}

export function Login({ callbackUrl, isPreview }: LoginProps) {
	return <LnurlAuthSignIn callbackUrl={callbackUrl} isPreview={isPreview} />
}
