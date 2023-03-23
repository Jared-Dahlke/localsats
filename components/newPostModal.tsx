import React, { Fragment, useState } from 'react'
import { Dialog, RadioGroup, Transition } from '@headlessui/react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
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
}: {
	open: boolean
	close: any
	lat: number
	lng: number
	userId: string
	handleSuccess: any
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
		await queryClient.invalidateQueries(rqKeys.postsKey())
		handleSuccess()
	}

	return (
		<div id='new-post-modal' className='modal'>
			<div className='modal-box relative'>
				<button
					onClick={close}
					className='btn btn-sm btn-circle btn-outline absolute right-2 top-2'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-6 w-6'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							d='M6 18L18 6M6 6l12 12'
						/>
					</svg>
				</button>
				<h3 className='font-bold text-lg'>Create a new post</h3>
				<div className='py-4'>
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
								<span className='text-gray-500 sm:text-sm'>&#8383;</span>
							</div>
							<input
								type='number'
								name='price'
								id='price'
								onChange={(e) => setAmount(Number(e.target.value))}
								className='input input-bordered w-full pl-7  '
								placeholder='0.00'
								aria-describedby='price-currency'
								step='0.000001'
								min='0'
								max='21000000'
							/>
							<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
								<span className='text-gray-500 sm:text-sm' id='price-currency'>
									{/* B */}
								</span>
							</div>
						</div>

						<div className='mt-2'>
							and meet at latitude {lat}, longitude {lng}
						</div>
					</div>
				</div>
				<div className='modal-action' onClick={createPost}>
					<label
						htmlFor='my-modal'
						className='btn btn-primary w-full'
						onClick={close}>
						Create
					</label>
				</div>
			</div>
		</div>
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
								//	option.value === 'buy' ? 'btn-success' : 'btn-error',

								checked ? 'btn btn-primary ' : 'btn btn-primary btn-outline '
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
