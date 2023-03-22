import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'

export function NewPostSuccessModal({
	open,
	setOpen
}: {
	open: boolean
	setOpen: any
}) {
	return (
		<div className='modal'>
			<div className='modal-box'>
				<section className='py-4'>
					<div>
						<div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
							<CheckIcon
								className='h-6 w-6 text-green-600'
								aria-hidden='true'
							/>
						</div>
						<div className='mt-3 text-center sm:mt-5'>
							<h3 className='text-lg font-medium leading-6 '>Post created</h3>
							<div className='mt-2'>
								<p className='text-sm text-gray-500'>
									Check back later to see if anyone has messaged you about your
									post.
								</p>
							</div>
						</div>
					</div>
				</section>
				<div className='modal-action'>
					<button
						type='button'
						className='btn btn-primary btn-block'
						onClick={() => setOpen(false)}>
						Ok
					</button>
				</div>
			</div>
		</div>
	)
}
