import { getServerSession } from 'next-auth'
import clientPromise from '../../lib/mongodb'
import { authOptions } from './auth/[...nextauth]'
import { setCookie } from 'cookies-next'
const openpgp = require('openpgp')
import dayjs from 'dayjs'
var crypto = require('crypto')

export const addPgpToUser = async ({ req, res, userId }) => {
	const privateKeyPassphrase = crypto.randomBytes(20).toString('hex')

	const { privateKey, publicKey } = await openpgp.generateKey({
		type: 'ecc', // Type of the key, defaults to ECC
		curve: 'curve25519', // ECC curve name, defaults to curve25519
		userIDs: [{ name: 'Jon Smith', email: 'jon@example.com' }], // you can pass multiple user IDs
		passphrase: privateKeyPassphrase, // protects the private key
		format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
	})

	setCookie('privateKeyPassphrase', privateKeyPassphrase, {
		req,
		res,
		maxAge: 2147483647,
		path: '/'
	})

	const client = await clientPromise
	const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
	const user = await db.collection('users').updateOne(
		{ userId },
		{
			$set: {
				pgpPublicKey: publicKey,
				pgpPrivateKeyEncrypted: privateKey,
				updatedPrivateKeysDate: dayjs().format()
			}
		}
	)
	return user
}

export default async function handler(req, res) {
	try {
		const session = await getServerSession(req, res, authOptions)

		if (!session) {
			res.status(401).json({ error: 'Not authenticated' })
			return
		}
		if (req.body.userId !== session?.user?.userId) {
			res.status(401).json({ error: 'Not authorized' })
			return
		}

		const user = await addPgpToUser({ req, res, userId: req.body.userId })

		res.json(user)
	} catch (e) {
		console.error(e)
	}
}
