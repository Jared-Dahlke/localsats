import { PostType } from '@/types/types'
import { useQuery } from '@tanstack/react-query'
import Axios from 'axios'
import { rqKeys } from '@/constants'

export const usePosts = ({ initialPosts }: { initialPosts: PostType[] }) => {
	const { data } = useQuery(
		rqKeys.postsKey(),
		() => Axios.get('/api/get_posts').then((data) => data.data),
		{
			refetchInterval: 20000,
			initialData: initialPosts
		}
	)

	return data
}
