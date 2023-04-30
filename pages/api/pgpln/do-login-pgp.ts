import { generateJWTAuthToken } from '@/lib/generateJWTAuthToken'
import { lnurlAuthConfig } from '@/lib/lnurlAuthConfig'
import { getOptions } from '@/lib/next-auth-lnurl'
import { getAppUrl } from '@/lib/utils'
import { addPgpToUser } from '@/pages/api/add_pgp_to_user'
import axios from 'axios'
import { setCookie } from 'cookies-next'
import * as lnurl from 'lnurl'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { signIn } from 'next-auth/react'
import { LNURLResponse } from 'types/LNURLResponse'
import { addPgpToUserLn } from './add_pgp_to_userln'

type LNURLAuthResponse = LNURLResponse & {
	token?: string // for breez jwt login https://doc.breez.technology/Adding-a-WebLN-widget-with-LNURL-Auth.html
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<LNURLAuthResponse>
) {
	const { k1, sig, key } = req.query
	console.log('req.query', req.query)
	if (
		!lnurl.verifyAuthorizationSignature(
			sig as string,
			k1 as string,
			key as string
		)
	) {
		return res.json({ status: 'ERROR', reason: 'Invalid signature' })
	}

	//console.log('sig', sig)
	//console.log('key', key)
	console.log('here')
	//res.writeHead(302, { Location: '/' })
	//	res.end()
	//return res.redirect(200, '/home')
	// await addPgpToUserLn({
	// 	req,
	// 	res,
	// 	userId: key,
	// 	privateKeyPassphrase: sig
	// })

	//console.log('about to set cookie')
	//	localStorage.setItem('test', '123')
	setCookie('test', 'test12345', {
		req,
		res,
		maxAge: 34000,
		path: '/',
		sameSite: 'lax'
	})

	// res.setHeader(
	// 	'Set-Cookie',
	// 	serialize('privateKeyPassphraseLn', 'token_cookie_value', {
	// 		path: '/',
	// 		sameSite: 'lax'
	// 	})
	// )

	const response: LNURLAuthResponse = {
		status: 'OK'
	}
	response.token = generateJWTAuthToken({
		userId: key as string,
		callbackUrl: `${getAppUrl()}/about`
	})
	return res.status(200).json(response)
}
