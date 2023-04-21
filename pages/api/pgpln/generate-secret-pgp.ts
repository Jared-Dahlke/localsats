import * as lnurl from 'lnurl'
import type { NextApiRequest, NextApiResponse } from 'next'
import { LnurlAuthLoginInfo } from 'types/LnurlAuthLoginInfo'

export const getEncoded = async () => {
	const k1 = 'c06b89a3f643b20f3cdd047f7a3593ab0f3aa37cf85b8ac24d88ed9408242ea2'

	const params = new URLSearchParams({
		k1,
		tag: 'login'
	})

	const callbackUrl = `${
		process.env.NEXT_PUBLIC_APP_URL
	}/api/do-login-pgp?${params.toString()}`

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
