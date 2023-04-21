import { lnurlAuthConfig } from '@/lib/lnurlAuthConfig'
import { getOptions } from '@/lib/next-auth-lnurl'
import prisma from '@/lib/prisma'
import { setCookie } from 'cookies-next'
import { StatusCodes } from 'http-status-codes'
import { getAuthKey } from 'lib/lnurl/getAuthKey'
import * as lnurl from 'lnurl'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { LNURLResponse } from 'types/LNURLResponse'

type LNURLAuthResponse = LNURLResponse & {
	token?: string // for breez jwt login https://doc.breez.technology/Adding-a-WebLN-widget-with-LNURL-Auth.html
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<LNURLAuthResponse>
) {
	const session = await getServerSession(req, res, getOptions(lnurlAuthConfig))

	const { k1, sig, key } = req.query

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

	setCookie('privateKeyPassphrase', sig, {
		req,
		res,
		maxAge: 2147483647,
		path: '/'
	})

	await prisma.user.update({
		where: {
			id: session?.user?.userId
		},
		data: {
			seenLightningPgpPrompt: true
		}
	})

	const response: LNURLAuthResponse = {
		status: 'OK'
	}

	return res.status(200).json(response)
}
