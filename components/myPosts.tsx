import { PostType } from '@/types/types'
import React from 'react'
import { DeletePostConfirmationModal } from './deletePostConfirmationModal'
const dayjs = require('dayjs')

interface IProps {
	posts: PostType[]
	deletePost: (id: string) => void
}

export function MyPosts({ posts, deletePost }: IProps) {
	const [deleteConfirmationId, setDeleteConfirmationId] = React.useState<
		string | null
	>(null)

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
			<div className='sm:flex sm:items-center'>
				<div className='sm:flex-auto'>
					<h2>Your Posts</h2>
				</div>
			</div>

			<div className='overflow-x-auto shadow rounded-lg ring-1 ring-black ring-opacity-5'>
				<table className='table table-normal min-w-full mt-0 mb-0'>
					<thead>
						<tr>
							<th className='!z-0'>Type</th>
							<th>Amount</th>
							<th>Posted At</th>

							<th>
								<span className='sr-only'>Delete</span>
							</th>
						</tr>
					</thead>
					<tbody className=''>
						{posts &&
							posts.map((post, personIdx) => (
								<tr key={post._id}>
									<td>{post.type}</td>
									<td>
										{post.amount}{' '}
										<span className='text-gray-500 sm:text-sm'>&#8383;</span>
									</td>
									<td>{dayjs(post.postedAt).format('MMM D, YYYY')}</td>

									<td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
										<button
											onClick={() => setDeleteConfirmationId(post._id)}
											className='btn btn-primary btn-link '>
											Delete<span className='sr-only'>, {post.type}</span>
										</button>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
