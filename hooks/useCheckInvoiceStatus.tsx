import { MessageType } from '@/types/types'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Axios from 'axios'
import React from 'react'

export const useCheckInvoiceStatus = ({
	paywallId,
	paymentHash
}: {
	paywallId: string
	paymentHash: string
}) => {
	const statusQuery = useQuery(
		['checkInvoiceStatus', paywallId, paymentHash],
		() => {
			return axios.post('/api/get_paywall_status_from_lnbits', {
				paywallId,
				paymentHash
			})
		},
		{
			enabled: !!paywallId && !!paymentHash,
			refetchInterval: 2000
		}
	)

	return statusQuery
}
