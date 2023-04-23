import { lnurlAuthConfig } from '@/lib/lnurlAuthConfig'
import { getOptions } from '@/lib/next-auth-lnurl'
import { addPgpToUser } from '@/pages/api/add_pgp_to_user'
import axios from 'axios'
import { setCookie } from 'cookies-next'
import * as lnurl from 'lnurl'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
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

	console.log('sig', sig)
	console.log('key', key)

	// await addPgpToUserLn({
	// 	req,
	// 	res,
	// 	userId: key,
	// 	privateKeyPassphrase: sig
	// })

	console.log('about to set cookie')
	//	localStorage.setItem('test', '123')
	setCookie('privateKeyPassphraseLn', 'test12345', {
		req,
		res,
		maxAge: 2147483647,
		path: '/'
	})

	const response: LNURLAuthResponse = {
		status: 'OK'
	}

	return res.status(200).json(response)
}
