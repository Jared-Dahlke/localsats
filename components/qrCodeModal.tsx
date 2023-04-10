import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import dayjs from 'dayjs'
import { getNameFromId, getPostId } from '@/utils/utils'
import QRCode from 'react-qr-code'
import { CHAT_PAYWALL_SATOSHIS } from '@/constants'

export default function QrCodeModal({
	open,
	setOpen,
	code
}: {
	open: boolean
	setOpen: any
	code: string
}) {
	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as='div' className='relative z-10' onClose={setOpen}>
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
							<Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6'>
								<div>
									<div className='text-center flex flex-col items-center justify-center'>
										<Dialog.Title
											as='h3'
											className='text-lg font-medium leading-6 '>
											Pay Lightning Invoice
										</Dialog.Title>
										<div className='text-sm text-gray-500 mt-3'>
											{`Please pay ${CHAT_PAYWALL_SATOSHIS} sats to chat with this
											user. This helps to prevent spam.`}
										</div>

										<span className='mt-3 inline-flex items-center rounded-full bg-yellow-100 px-3 py-0.5 text-sm font-medium text-yellow-800'>
											Awaiting payment...
										</span>

										<div className='text-sm text-gray-500 mt-3'>
											{code && (
												<a href={'lightning:' + code}>
													<QRCode
														className='cursor-pointer'
														value={'lightning:' + code}
													/>
												</a>
											)}
										</div>
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}
