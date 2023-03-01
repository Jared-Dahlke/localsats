import { getAuthKey } from 'lib/lnurl/getAuthKey'
import type { NextApiRequest, NextApiResponse } from 'next'
import { LnurlAuthStatus } from 'types/LnurlAuthStatus'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<LnurlAuthStatus>
) {
	const { k1 } = req.query
	console.log('herekey', k1)
	const authKey = await getAuthKey(k1 as string)
	console.log('here pas key', authKey)
	res.json({ verified: !!authKey?.key, used: !authKey })
}
