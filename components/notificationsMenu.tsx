import { Fragment, ReactElement } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { classNames } from '../utils/utils'

export const NotificationsMenu = ({ children }: { children: ReactElement }) => {
	return (
		<Popover className='relative'>
			{({ open }) => (
				<>
					<Popover.Button
						className={classNames(
							open ? 'text-gray-900' : 'text-gray-500',
							'   hover:text-gray-900'
						)}>
						{children}
					</Popover.Button>

					<Transition
						as={Fragment}
						enter='transition ease-out duration-200'
						enterFrom='opacity-0 translate-y-1'
						enterTo='opacity-100 translate-y-0'
						leave='transition ease-in duration-150'
						leaveFrom='opacity-100 translate-y-0'
						leaveTo='opacity-0 translate-y-1'>
						<Popover.Panel className='absolute left-1/2 z-10 mt-3 w-screen max-w-xs -translate-x-1/2 transform px-2 sm:px-0'>
							<div className='overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5'>
								<div className='relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8'>
									You have no unread messages
								</div>
							</div>
						</Popover.Panel>
					</Transition>
				</>
			)}
		</Popover>
	)
}
