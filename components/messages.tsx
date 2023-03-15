import { Layout } from '../components/layout'
import { GroupedMessage } from '../types/types'
import { getNameFromId, getPostId } from '../utils/utils'
import React from 'react'
import { useSession } from 'next-auth/react'

export function Messages({
	messages,
	setOpenChatPaywallId,
	setLocationProps,
	posts
}: {
	messages: GroupedMessage[]
	setOpenChatPaywallId: (id: string) => void
	setLocationProps: (val: any) => void
	posts: any
}) {
	const session = useSession()
	const user = session?.data?.user?.userId
	return (
		<div>
			<div className='w-full my-8'>
				<div className='sm:flex sm:items-center'>
					<div className='sm:flex-auto'>
						<h1 className='text-md font-semibold text-gray-900'>
							Your Messages
						</h1>
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
												Post ID
											</th>
											<th
												scope='col'
												className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6'>
												Other party
											</th>
											<th
												scope='col'
												className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'>
												Latest message
											</th>
											<th
												scope='col'
												className='px-1 py-3.5 text-left text-sm font-semibold text-gray-900'></th>

											<th
												scope='col'
												className='relative py-3.5 pl-3 pr-4 sm:pr-6'>
												<span className='sr-only'>open</span>
											</th>
										</tr>
									</thead>
									<tbody id='messages' className='bg-white'>
										{messages &&
											messages.map((message, personIdx) => {
												const post = posts?.find(
													(p) => p._id === message.postId
												)
												return (
													<tr
														key={message.chatPaywallId}
														className={
															personIdx % 2 === 0 ? undefined : 'bg-gray-50'
														}>
														<td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6'>
															<a
																onClick={() =>
																	setLocationProps({
																		center: {
																			lat: post?.lat,
																			lng: post?.lng
																		},
																		zoom: 29
																	})
																}
																className='text-indigo-600 hover:text-indigo-900 cursor-pointer'>
																{getPostId(message.postId)}
																<span className='sr-only'></span>
															</a>
														</td>
														<td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate'>
															{message.messages[0].fromUserId === user
																? getNameFromId(message.messages[0].toUserId)
																: getNameFromId(message.messages[0].fromUserId)}
														</td>
														<td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500 truncate'>
															<div className='w-36 truncate relative'>
																{
																	message.messages[message.messages.length - 1]
																		.body
																}
															</div>
														</td>
														<td className='whitespace-nowrap px-1 py-4 text-sm text-gray-500'>
															{!message.hasUnreadMessages ? (
																<></>
															) : (
																<span className=' inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800'>
																	<svg
																		className='-ml-0.5 mr-1.5 h-2 w-2 text-green-400'
																		fill='currentColor'
																		viewBox='0 0 8 8'>
																		<circle cx={4} cy={4} r={3} />
																	</svg>
																	New
																</span>
															)}
														</td>

														<td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6'>
															<a
																onClick={() =>
																	setOpenChatPaywallId(message.chatPaywallId)
																}
																className='text-indigo-600 hover:text-indigo-900 cursor-pointer'>
																Open<span className='sr-only'></span>
															</a>
														</td>
													</tr>
												)
											})}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

Messages.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>
}
