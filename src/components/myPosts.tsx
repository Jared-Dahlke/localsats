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
		<div className='md:max-w-md sm:max-w-full my-8'>
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
					<h1 className='text-md font-semibold text-gray-900'>Your Posts</h1>
				</div>
			</div>
			<div className='mt-3 flex flex-col'>
				<div className='overflow-x-auto sm:-mx-6 lg:-mx-8'>
					<div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
						<div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
							<table className='min-w-full divide-y divide-gray-300'>
								<thead className='bg-gray-50'>
									<tr>
										<th
											scope='col'
											className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'>
											Type
										</th>
										<th
											scope='col'
											className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
											Amount
										</th>
										<th
											scope='col'
											className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
											Posted At
										</th>

										<th
											scope='col'
											className='relative py-3.5 pl-3 pr-4 sm:pr-6'>
											<span className='sr-only'>Delete</span>
										</th>
									</tr>
								</thead>
								<tbody className='bg-white'>
									{posts &&
										posts.map((post, personIdx) => (
											<tr
												key={post._id}
												className={
													personIdx % 2 === 0 ? undefined : 'bg-gray-50'
												}>
												<td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
													{post.type}
												</td>
												<td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
													{post.amount}{' '}
													<span className='text-gray-500 sm:text-sm'>
														&#8383;
													</span>
												</td>
												<td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
													{dayjs(post.postedAt).format('MMM D, YYYY')}
												</td>

												<td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
													<a
														onClick={() => setDeleteConfirmationId(post._id)}
														className='text-indigo-600 hover:text-indigo-900 cursor-pointer'>
														Delete<span className='sr-only'>, {post.type}</span>
													</a>
												</td>
											</tr>
										))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
