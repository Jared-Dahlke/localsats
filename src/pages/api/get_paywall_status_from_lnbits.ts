// get paywall status from lnbits
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
	paywalls: any
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const status = await axios.post(
		`https://legend.lnbits.com/paywall/api/v1/paywalls/check_invoice/${req.body.paywallId}`,

		{
			payment_hash: req.body.paymentHash
		}
	)
	res.status(200).json(status.data)
}
