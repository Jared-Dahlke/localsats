import { getServerSession } from 'next-auth'
const openpgp = require('openpgp')
import dayjs from 'dayjs'
import prisma from '@/lib/prisma'
import { getOptions } from '@/lib/next-auth-lnurl'
import { lnurlAuthConfig } from '@/lib/lnurlAuthConfig'

export const addPgpToUser = async ({
	userId,
	password
}: {
	userId: string
	password: string
}) => {
	const { privateKey, publicKey } = await openpgp.generateKey({
		type: 'ecc', // Type of the key, defaults to ECC
		curve: 'curve25519', // ECC curve name, defaults to curve25519
		userIDs: [{ name: 'Jon Smith', email: 'jon@example.com' }], // you can pass multiple user IDs
		passphrase: password, // protects the private key
		format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
	})

	const user = await prisma.user.update({
		where: {
			userId: userId
		},
		data: {
			pgpPublicKey: publicKey,
			pgpPrivateKeyEncrypted: privateKey,
			updatedPrivateKeysDate: dayjs().format()
		}
	})

	return user
}

export default async function handler(req, res) {
	try {
		const session = await getServerSession(
			req,
			res,
			getOptions(lnurlAuthConfig)
		)

		if (!session) {
			res.status(401).json({ error: 'Not authenticated' })
			return
		}
		if (req.body.userId !== session?.user?.userId) {
			res.status(401).json({ error: 'Not authorized' })
			return
		}

		const user = await addPgpToUser({
			userId: req.body.userId,
			password: req.body.password
		})

		res.json(user)
	} catch (e) {
		console.log('error in add_pgp_to_user.ts')
		console.error(e)
	}
}
