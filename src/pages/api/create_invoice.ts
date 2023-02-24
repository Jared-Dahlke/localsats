// creates invoice for a paywall in lnbits
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { CHAT_PAYWALL_SATOSHIS } from '../../constants'

type Data = {
	invoice: string
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const invoice = await axios.post(
		`https://legend.lnbits.com/paywall/api/v1/paywalls/invoice/${req.body.paywallId}`,

		{
			amount: CHAT_PAYWALL_SATOSHIS
		}
	)
	res.status(200).json({ invoice: invoice.data })
}
