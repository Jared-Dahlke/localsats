import React, { Fragment, useState } from 'react'
import { Dialog, RadioGroup, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { classNames } from '../utils/utils'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { rqKeys } from '../constants'

export default function NewPostModal({
	open,
	close,
	lat,
	lng,
	userId,
	handleSuccess
}: //	post,
//	createPaywall
{
	open: boolean
	close: any
	lat: number
	lng: number
	userId: string
	handleSuccess: any
	//	post: any
	//	createPaywall: any
}) {
	const queryClient = useQueryClient()
	const [type, setType] = React.useState('buy')
	const [amount, setAmount] = React.useState<number | null>(null)
	const createPost = async () => {
		const res = await axios
			.post('/api/create_post', {
				post: {
					lat,
					lng,
					type,
					amount,
					userId,
					postedAt: new Date()
				}
			})
			.catch((err) => {
				//user should never see this, but just in case
				alert('You can only have 3 active posts at any given time.')
				return
			})
		//console.log('res', res)
		await queryClient.invalidateQueries(rqKeys.postsKey())
		handleSuccess()
	}

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as='div' className='relative z-10' onClose={close}>
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
								<div className='text-center '>
									<Dialog.Title
										as='h3'
										className='text-lg font-medium leading-6 text-gray-900'>
										Create a new post
									</Dialog.Title>
									<div className='mt-2'>
										<BuySellToggle
											value={type}
											setValue={(v: string) => {
												setType(v)
											}}
										/>
									</div>
									<div className='mt-4'>
										<div className='relative rounded-md shadow-sm'>
											<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
												<span className='text-gray-500 sm:text-sm'>
													&#8383;
												</span>
											</div>
											<input
												type='number'
												name='price'
												id='price'
												onChange={(e) => setAmount(Number(e.target.value))}
												className='block w-full rounded-md border-gray-300 pl-7  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
												placeholder='0.00'
												aria-describedby='price-currency'
												step='0.000001'
												min='0'
												max='21000000'
											/>
											<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
												<span
													className='text-gray-500 sm:text-sm'
													id='price-currency'>
													{/* B */}
												</span>
											</div>
										</div>

										<div className='mt-2'>
											and meet at latitude {lat}, longitude {lng}
										</div>
										{/* <textarea
												id='about'
												name='about'
												rows={3}
												className='block w-full max-w-lg p-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
												defaultValue={''}
												placeholder='Send them a message...'
											/> */}
									</div>
								</div>

								<div className='mt-5 sm:mt-6'>
									<button
										type='button'
										className='inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm'
										onClick={createPost}>
										Create
									</button>
									{/* <p>You will have to pay 100 sats as a spam blocker!</p> */}
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

const BuySellToggle = ({ value, setValue }) => {
	const values = [
		{
			name: 'Buy',
			value: 'buy'
		},
		{
			name: 'Sell',
			value: 'sell'
		}
	]
	return (
		<RadioGroup value={value} onChange={setValue} className='mt-6 w-full'>
			<RadioGroup.Label className='sr-only'>
				Do you want to buy or sell bitcoin?
			</RadioGroup.Label>
			<div className='grid grid-cols-2 gap-3 '>
				{values.map((option) => (
					<RadioGroup.Option
						key={option.name}
						value={option.value}
						className={({ active, checked }) =>
							classNames(
								option
									? 'cursor-pointer focus:outline-none'
									: 'opacity-25 cursor-not-allowed',
								active ? 'ring-2 ring-offset-2 ring-indigo-500' : '',
								checked
									? 'bg-indigo-600 border-transparent text-white hover:bg-indigo-700'
									: 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50',
								'border rounded-md py-3 px-3 flex items-center justify-center text-sm font-medium uppercase sm:flex-1'
							)
						}
						disabled={false}>
						<RadioGroup.Label as='span'>{option.name}</RadioGroup.Label>
					</RadioGroup.Option>
				))}
			</div>
		</RadioGroup>
	)
}
