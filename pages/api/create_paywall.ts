// creates paywall in lnbits
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { CHAT_PAYWALL_SATOSHIS } from '@/constants'

type Data = {
	paywallId: string
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const newPaywall = await axios.post(
		'https://legend.lnbits.com/paywall/api/v1/paywalls',

		{
			amount: CHAT_PAYWALL_SATOSHIS,
			description: 'This payment is required to prevent spam',
			memo: `Please pay ${CHAT_PAYWALL_SATOSHIS} sats to chat with this user`,
			remembers: true,
			url: `http://localhost:3000/registerChat?recipientUserId=${req.body.recipientUserId}&userId=${req.body.userId}&postId=${req.body.postId}`
		},
		{
			headers: { 'X-Api-Key': process.env.LNBITS_API_KEY }
		}
	)
	res.status(200).json({ paywallId: newPaywall.data.id })
}
