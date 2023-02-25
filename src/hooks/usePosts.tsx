import { useQuery } from '@tanstack/react-query'
import Axios from 'axios'
import { rqKeys } from '../constants'
import { PostType } from '../types/types'

export const usePosts = ({ initialPosts }: { initialPosts: PostType[] }) => {
	const postsQuery = useQuery<PostType[]>(
		rqKeys.postsKey(),
		() => Axios.get('/api/get_posts'),
		{
			refetchInterval: 20000,
			initialData: initialPosts
		}
	)

	return postsQuery?.data?.data
}
