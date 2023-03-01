import { useTranslation } from 'next-i18next'
import EmailSignIn from 'pages/auth/signin/email'
import LnurlAuthSignIn from 'pages/auth/signin/lnurl'
import PhoneSignIn from 'pages/auth/signin/phone'
import React, { useState } from 'react'
import { LoginMethod, loginMethods } from 'types/LoginMethod'

type LoginProps = {
	instructionsText?(loginMethod: LoginMethod): string
	submitText?: string
	callbackUrl?: string
	tipId?: string
	defaultLoginMethod: LoginMethod
	allowedLoginMethods?: LoginMethod[]
	isPreview?: boolean
}

export function Login({
	submitText,
	callbackUrl,
	instructionsText,
	tipId,
	defaultLoginMethod,
	allowedLoginMethods,
	isPreview
}: LoginProps) {
	return <LnurlAuthSignIn callbackUrl={callbackUrl} isPreview={isPreview} />
}
