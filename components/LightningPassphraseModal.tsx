import { classNames, getCalendarDate, getNameFromId } from '@/utils/utils'
import { GroupedMessage } from '@/types/types'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useText } from '@/hooks/useText'
import LnurlAuthPgp from '@/pages/lnurlpgp'
export function LightningPassphraseModal() {
	return (
		<div id='passphrase-modal' className='modal'>
			<div className='modal-box relative max-w-fit'>
				<section className='pt-6'>
					<div className='text-center prose'>
						<h3 className='justify-center'>
							Localsats.org uses PGP to encrypt messages
						</h3>
						<p>
							But we need to use a secret passphrase when creating the PGP keys
							so that your messages are encrypted in the database and cannot be
							compromised. We will sign a static string with your wallet which
							will produce a unique signature. We will then save that signature
							in your cookies. This allows you to easily use localsats.org on
							multiple devices, with all of your messages end to end encrypted
							using PGP.
						</p>
					</div>
				</section>

				<div className='mt-5 sm:mt-6 justify-center flex text-center bg-white p-4 rounded-lg'>
					<LnurlAuthPgp />
				</div>
			</div>
		</div>
	)
}
