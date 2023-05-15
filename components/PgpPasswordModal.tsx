import { useEffect, useState } from 'react'
import { usePgpPassword } from '@/hooks/usePgpPassword'
import axios from 'axios'
import { PasswordStatuses } from '@/types/types'

export function PgpPasswordModal({
	user,
	status
}: {
	user: string
	status: PasswordStatuses
}) {
	const [password, setPassword] = useState('')
	const { setPgpPassword } = usePgpPassword()
	const handleSave = async () => {
		setPgpPassword(password)

		await axios.post('/api/add_pgp_to_user', {
			userId: user,
			password
		})

		window.location.reload()
	}
	return (
		<div id='pgpPassword-modal' className='modal modal-bottom sm:modal-middle'>
			<div className='modal-box'>
				<h3 className='font-bold text-lg'>
					Please enter a password for e2e encrypted messaging
				</h3>
				<p className='py-4'>
					We will save this in your browser in your local storage. Remember this
					password incase you clear your local storage, or in case you want to
					use localsats.org on another device.
				</p>
				<input
					type='text'
					placeholder='Type here'
					className='input input-bordered w-full max-w-xs'
					value={password}
					onChange={(e) => {
						setPassword(e.target.value)
					}}
				/>

				<div className='modal-action'>
					<button
						disabled={password.length < 1}
						onClick={handleSave}
						className='btn'>
						Save
					</button>
				</div>
			</div>
		</div>
	)
}
