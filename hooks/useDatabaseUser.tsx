import { MessageType } from '@//types/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { GroupedMessage } from '@/types/types'
import { rqKeys } from '@/constants'

export const useDatabaseUser = ({ userId }: { userId: string }) => {
	const userQuery = useQuery(
		['databaseUser', userId],
		() => {
			return axios.post('/api/get_user', {
				userId
			})
		},
		{
			enabled: !!userId
		}
	)

	return userQuery
}
