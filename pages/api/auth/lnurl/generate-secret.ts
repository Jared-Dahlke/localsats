import clientPromise from '@/lib/mongodb'
import { randomBytes } from 'crypto'
import * as lnurl from 'lnurl'
import type { NextApiRequest, NextApiResponse } from 'next'
import { LnurlAuthLoginInfo } from 'types/LnurlAuthLoginInfo'
import { getServerSession, unstable_getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { StatusCodes } from 'http-status-codes'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<LnurlAuthLoginInfo>
) {
	if (!req.headers.host) {
		throw new Error('No host in request headers')
	}

	const k1 = generateSecret()

	// store the random secret in the DB so it can only be used once
	const client = await clientPromise
	const db = client.db('authtest')
	await db.collection('lnurlAuthKey').insertOne({
		k1
	})

	const params = new URLSearchParams({
		k1,
		tag: 'login'
	})

	const callbackUrl = `${
		process.env.APP_URL
	}/api/auth/lnurl/do-login?${params.toString()}`

	const encoded = lnurl.encode(callbackUrl).toUpperCase()

	res.json({
		lnurl_auth: encoded,
		k1
	})
}

const generateSecret = function () {
	const numBytes = 32
	const encoding = 'hex'
	return randomBytes(numBytes).toString(encoding)
}
