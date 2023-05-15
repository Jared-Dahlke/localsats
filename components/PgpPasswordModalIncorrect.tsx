import { useEffect, useState } from 'react'
import { usePgpPassword } from '@/hooks/usePgpPassword'
import axios from 'axios'
import { PasswordStatuses } from '@/types/types'

export function PgpPasswordModalIncorrect({
	user,
	status
}: {
	user: string
	status: PasswordStatuses
}) {
	const [password, setPassword] = useState('')
	const [havePassword, setHavePassword] = useState<boolean | null>(null)
	const { setPgpPassword } = usePgpPassword()
	const handleSave = async () => {
		setPgpPassword(password)

		window.location.reload()
	}
	const handleGenerateNew = async () => {
		setPgpPassword(password)

		await axios.post('/api/add_pgp_to_user', {
			userId: user,
			password
		})

		window.location.reload()
	}
	return (
		<div
			id='pgpPasswordincorrect-modal'
			className='modal modal-bottom sm:modal-middle'>
			<div className='modal-box'>
				<h3 className='font-bold text-lg'>
					{status === 'incorrect'
						? 'Incorrect password for your PGP keys'
						: 'Missing password for your PGP keys'}
				</h3>

				<div className='card flex gap-3 p-4'>
					{havePassword === null ? (
						<div className='card flex gap-3 p-4'>
							<button onClick={() => setHavePassword(true)} className='btn'>
								I know my PGP password
							</button>
							<button onClick={() => setHavePassword(false)} className='btn'>
								I do not know my PGP password
							</button>
						</div>
					) : havePassword === true ? (
						<div className='flex flex-col'>
							<input
								type='text'
								placeholder='Enter your password here'
								className='input input-bordered w-full  my-8'
								value={password}
								onChange={(e) => {
									setPassword(e.target.value)
								}}
							/>
							<button onClick={handleSave} className='btn'>
								Submit
							</button>
						</div>
					) : (
						<div className='flex flex-col'>
							<div>
								No problem, we will now generate a new key pair for you, please
								enter in a password. Remember this password in case you want to
								access localsats.org on another device. Any messages you have
								already received will not be readable, but any new messages you
								receive will be readable.
							</div>
							<input
								type='text'
								placeholder='Enter password here'
								className='w-full input input-bordered   my-8'
								value={password}
								onChange={(e) => {
									setPassword(e.target.value)
								}}
							/>
							<button onClick={handleGenerateNew} className='btn'>
								Submit
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
