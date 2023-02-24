import { useQuery } from '@tanstack/react-query'
import Axios from 'axios'
import { rqKeys } from '../constants'

export const usePosts = () => {
	const { data } = useQuery(
		rqKeys.postsKey(),
		() => Axios.get('/api/get_posts'),
		{
			refetchInterval: 20000
		}
	)

	return data
}
