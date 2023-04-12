import prisma from '@/lib/prisma'
import { StatusCodes } from 'http-status-codes'
import { generateJWTAuthToken } from 'lib/generateJWTAuthToken'
import { getAuthKey } from 'lib/lnurl/getAuthKey'
import { getAppUrl } from 'lib/utils'
import * as lnurl from 'lnurl'
import type { NextApiRequest, NextApiResponse } from 'next'
import { LNURLResponse } from 'types/LNURLResponse'

type LNURLAuthResponse = LNURLResponse & {
	token?: string // for breez jwt login https://doc.breez.technology/Adding-a-WebLN-widget-with-LNURL-Auth.html
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<LNURLAuthResponse>
) {
	const { k1, sig, key, jwt } = req.query

	const authKey = await getAuthKey(k1 as string)
	if (!authKey) {
		return res.status(StatusCodes.NOT_FOUND).end()
	}

	if (
		!lnurl.verifyAuthorizationSignature(
			sig as string,
			k1 as string,
			key as string
		)
	) {
		return res.json({ status: 'ERROR', reason: 'Invalid signature' })
	}

	const response: LNURLAuthResponse = {
		status: 'OK'
	}
	if (jwt === 'true') {
		// this is old code from lightsats, keeping in case i decide to do jwt login
		// response.token = generateJWTAuthToken({
		// 	userId: key as string,
		// 	callbackUrl: `${getAppUrl()}/dashboard`
		// })
		// we have a JWT, no need to keep the authkey now.
		// user will use the 2fa auth method with the jwt token.
		// await db.collection('lnurlAuthKey').deleteMany({
		// 	k1: authKey.k1
		// })
	} else {
		await prisma.lnurlAuthKey.update({
			where: {
				k1: authKey.k1
			},
			data: {
				key: key
			}
		})
	}

	return res.status(200).json(response)
}
