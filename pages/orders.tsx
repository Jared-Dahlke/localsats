import { useText } from '@/hooks/useText'
import { getServerSession } from 'next-auth'
import React from 'react'
import { Layout } from '@/components/layout'
import { PostType } from '@/types/types'
import { usePosts } from '@/hooks/usePosts'
import axios from 'axios'
import { getOptions } from '@/lib/next-auth-lnurl'
import { lnurlAuthConfig } from '@/lib/lnurlAuthConfig'
import { getPosts } from './api/get_posts'
import { useQueryClient } from '@tanstack/react-query'
import { DeletePostConfirmationModal } from '@/components/deletePostConfirmationModal'
import { CalendarDaysIcon } from '@heroicons/react/20/solid'
import { getCalendarDate, getPostId } from '@/utils/utils'
import {
	IdentificationIcon,
	MapIcon,
	PlusIcon,
	UserIcon,
	XMarkIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface IProps {
	user: string
	posts: PostType[]
}

export default function Orders({ user, posts: initialPosts }: IProps) {
	const posts = usePosts({ initialPosts })
	const allMyPosts = posts?.filter((p) => p.userId === user)
	const queryClient = useQueryClient()
	const deletePost = async (id: string) => {
		await axios.post('/api/delete_post', {
			id
		})

		queryClient.invalidateQueries()
	}

	const [deleteConfirmationId, setDeleteConfirmationId] = React.useState<
		string | null
	>(null)

	const t = useText()

	return (
		<div className=' my-8'>
			<DeletePostConfirmationModal
				open={!!deleteConfirmationId}
				setOpen={() => setDeleteConfirmationId(null)}
				handleDelete={() => {
					if (deleteConfirmationId) {
						deletePost(deleteConfirmationId)
					}
					setDeleteConfirmationId(null)
				}}
			/>
			{allMyPosts?.length === 0 ? (
				<div className='text-center'>
					<h3 className='mt-2 text-sm font-semibold '>No order</h3>
					<p className='mt-1 text-sm text-gray-500'>
						Get started by creating a new order on the{' '}
						<Link className='link' href={'/home'}>
							home page
						</Link>
					</p>
				</div>
			) : (
				<div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
					{allMyPosts &&
						allMyPosts.map((post, index) => (
							<Post
								post={post}
								key={index}
								setDeleteConfirmationId={setDeleteConfirmationId}
							/>
						))}
				</div>
			)}
		</div>
	)
}
Orders.getLayout = function getLayout(page) {
	return <Layout title='My Order'>{page}</Layout>
}

export const getServerSideProps = async function ({ req, res }) {
	const session = await getServerSession(req, res, getOptions(lnurlAuthConfig))
	const user = session?.user?.userId
	if (!user) {
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		}
	}
	const posts = await getPosts()

	return {
		props: { user, posts: JSON.parse(JSON.stringify(posts)) }
	}
}

const Post = ({
	post,
	setDeleteConfirmationId
}: {
	post: PostType
	setDeleteConfirmationId: (val: string | null) => void
}) => {
	const t = useText()
	return (
		<div className='card shadow-xl bg-base-100'>
			<div className='card-body'>
				<div className='card-title flex justify-between'>
					<div className='capitalize'>
						{post.type} {post.amount} &#8383;
					</div>
				</div>

				<div className='mt-4 flex w-full flex-none gap-x-4'>
					<dt className='flex-none'>
						<span className='sr-only'>Due date</span>
						<IdentificationIcon
							className='h-6 w-5 text-gray-400'
							aria-hidden='true'
						/>
					</dt>
					<dd className='text-sm leading-6 text-gray-500'>
						Order ID: {getPostId(post.id)}
					</dd>
				</div>

				<div className='mt-0 flex w-full flex-none gap-x-4'>
					<dt className='flex-none'>
						<span className='sr-only'>Due date</span>
						<CalendarDaysIcon
							className='h-6 w-5 text-gray-400'
							aria-hidden='true'
						/>
					</dt>
					<dd className='text-sm leading-6 text-gray-500'>
						<time dateTime='2023-01-31'>
							Created {getCalendarDate(post?.postedAt)}
						</time>
					</dd>
				</div>

				<div className='mt-0 flex w-full flex-none gap-x-4'>
					<dt className='flex-none'>
						<span className='sr-only'>Due date</span>
						<MapIcon className='h-6 w-5 text-gray-400' aria-hidden='true' />
					</dt>
					<dd className='text-sm leading-6 text-gray-500'>
						<time dateTime='2023-01-31'>
							Lat: {post.lat.toFixed(2)} Lng: {post.lng.toFixed(2)}
						</time>
					</dd>
				</div>

				<div className='mt-0 flex w-full flex-none gap-x-4'>
					<dt className='flex-none'>
						<span className='sr-only'>Due date</span>
						<UserIcon className='h-6 w-5 text-gray-400' aria-hidden='true' />
					</dt>
					<dd className='text-sm leading-6 text-gray-500'>
						<time dateTime='2023-01-31'>
							Chats: {post?.chatPaywalls?.length || 0}
						</time>
					</dd>
				</div>

				<div className='card-actions justify-end'>
					<button
						onClick={() => setDeleteConfirmationId(post.id)}
						className='btn btn-error btn-outline'>
						{t.delete}
						<span className='sr-only'>, {post.type}</span>
					</button>
				</div>
			</div>
		</div>
	)
}
