import prisma from '@/lib/prisma'
import { randomBytes } from 'crypto'
import * as lnurl from 'lnurl'
import type { NextApiRequest, NextApiResponse } from 'next'
import { LnurlAuthLoginInfo } from 'types/LnurlAuthLoginInfo'

// make a random string (we call it k1), add it to db, return  lnurl encoded callbackurl + random string
export const getEncoded = async () => {
	const k1 = generateSecret()

	// store the random secret in the DB so it can only be used once

	await prisma.lnurlAuthKey.create({
		data: {
			k1: k1
		}
	})

	const params = new URLSearchParams({
		k1,
		tag: 'login'
	})

	const callbackUrl = `${
		process.env.NEXT_PUBLIC_APP_URL
	}/api/auth/lnurl/do-login?${params.toString()}`

	const encoded = lnurl.encode(callbackUrl).toUpperCase()
	return {
		lnurl_auth: encoded,
		k1
	}
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<LnurlAuthLoginInfo>
) {
	if (!req.headers.host) {
		throw new Error('No host in request headers')
	}

	const result = await getEncoded()

	res.json(result)
}

const generateSecret = function () {
	const numBytes = 32
	const encoding = 'hex'
	return randomBytes(numBytes).toString(encoding)
}
