import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
	ChatBubbleLeftIcon,
	EnvelopeIcon,
	MegaphoneIcon,
	NewspaperIcon
} from '@heroicons/react/24/outline'
import { getNameFromId } from '../utils/utils'
import { FingerPrintIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'

const features = [
	{
		name: 'Create a post',
		description:
			'To create a new post to buy or sell Bitcoin, just click on the map where you would like to meet.',
		icon: MegaphoneIcon
	},
	{
		name: 'Respond to a post',
		description:
			'To see other peoples posts and respond to them, click on the icons on the map.',
		icon: ChatBubbleLeftIcon
	},
	{
		name: 'Receive Messages',
		description:
			'When others respond to your post, you will receive a message. You can also optionally choose to receive an email.',
		icon: EnvelopeIcon
	},
	{
		name: 'Be safe',
		description:
			'Make sure to meet in a crowded public place. Do not give out your personal information.',
		icon: FingerPrintIcon
	},
	{
		name: 'This is new!',
		description:
			'There are not many posts yet because this site is brand new, it was just shipped February 2023. Please, create a post and help us grow! Be patient.',
		icon: NewspaperIcon
	}
]

export function WelcomeModal({
	open,
	setOpen,
	handleAddEmail
}: {
	open: boolean
	setOpen: any
	handleAddEmail: () => void
}) {
	const session = useSession()
	const user = session?.data?.user?.userId

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog
				as='div'
				id='dialogtest'
				className='relative z-10'
				onClose={setOpen}>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'>
					<div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
				</Transition.Child>

				<div className='fixed inset-0 z-10 overflow-y-auto'>
					<div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
							enterTo='opacity-100 translate-y-0 sm:scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 translate-y-0 sm:scale-100'
							leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
							<Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6'>
								<div id='welcomemodal'>
									<div className='bg-white py-12'>
										<div className='mx-auto max-w-7xl px-6 lg:px-8'>
											<div className='mx-auto max-w-2xl lg:text-center'>
												<p className='mt-2 text-3xl font-bold tracking-tight  sm:text-4xl'>
													Welcome, {getNameFromId(user)}
												</p>
												<p className='mt-6 text-lg leading-8 text-gray-600'>
													Here are some quick tips to get you started:
												</p>
											</div>
											<div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl'>
												<dl className='grid max-w-xl grid-cols-1 gap-y-10 gap-x-8 lg:max-w-none lg:grid-cols-2 lg:gap-y-16'>
													{features.map((feature) => (
														<div key={feature.name} className='relative pl-16'>
															<dt className='text-base font-semibold leading-7 '>
																<div className='absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600'>
																	<feature.icon
																		className='h-6 w-6 text-white'
																		aria-hidden='true'
																	/>
																</div>
																{feature.name}
															</dt>
															<dd className='mt-2 text-base leading-7 text-gray-600'>
																{feature.description}
															</dd>
														</div>
													))}
												</dl>
											</div>
										</div>
									</div>
								</div>

								<div className='mt-5 sm:mt-6 flex gap-3'>
									<button
										type='button'
										className='inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm'
										onClick={handleAddEmail}>
										Ok
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}
