import clientPromise from '@/lib/mongodb'
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

	const client = await clientPromise
	const db = client.db('authtest')

	const response: LNURLAuthResponse = {
		status: 'OK'
	}
	if (jwt === 'true') {
		response.token = generateJWTAuthToken({
			lnurlPublicKey: key as string,
			callbackUrl: `${getAppUrl()}/dashboard`
		})
		// we have a JWT, no need to keep the authkey now.
		// user will use the 2fa auth method with the jwt token.
		await db.collection('lnurlAuthKey').deleteMany({
			k1: authKey.k1
		})
	} else {
		await db
			.collection('lnurlAuthKey')
			.updateOne({ k1: authKey.k1 }, { $set: { key: key as string } })
	}

	return res.status(200).json(response)
}
