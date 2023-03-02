// get paywalls from lnbits
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
	paywalls: any
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const paywalls = await axios.get(
		'https://legend.lnbits.com/paywall/api/v1/paywalls',
		{
			headers: { 'X-Api-Key': process.env.LNBITS_INVOICE_READ_KEY }
		}
	)
	res.status(200).json(paywalls.data)
}
