import { useQuery } from '@tanstack/react-query'
import Axios from 'axios'
import { rqKeys } from '../constants'
import { PostType } from '../types/types'

const getPosts = async () => {
	const posts = await Axios.get<PostType[]>('/api/get_posts')
	return posts.data
}

export const usePosts = ({ initialPosts }: { initialPosts: PostType[] }) => {
	const postsQuery = useQuery(rqKeys.postsKey(), () => getPosts(), {
		refetchInterval: 20000,
		initialData: initialPosts
	})
	return postsQuery?.data
}
