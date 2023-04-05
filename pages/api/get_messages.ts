import clientPromise from '../../lib/mongodb'
const openpgp = require('openpgp')

export const getMessages = async (
	userId: string,
	privateKeyPassphrase: string
) => {
	const client = await clientPromise
	const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
	const messages = await db
		.collection('messages')
		.find({
			$or: [{ toUserId: userId }, { fromUserId: userId }]
		})
		.sort({ sentDate: 1 })
		.toArray()

	const user = await db.collection('users').findOne({ userId: userId })
	const pgpPrivateKey = user?.pgpPrivateKeyEncrypted

	try {
		const privateKey = await openpgp.decryptKey({
			privateKey: await openpgp.readPrivateKey({ armoredKey: pgpPrivateKey }),
			passphrase: privateKeyPassphrase
		})
		const finalMessages = []
		for await (const m of messages) {
			if (m.body.includes('---BEGIN PGP MESSAGE---')) {
				try {
					const message = await openpgp.readMessage({
						armoredMessage: m.body // parse armored message
					})

					const { data: decrypted } = await openpgp.decrypt({
						message,
						decryptionKeys: privateKey
					})
					m.body = decrypted
					finalMessages.push(m)
				} catch (err) {
					finalMessages.push(m)
				}
			} else {
				finalMessages.push(m)
			}
		}

		return finalMessages
	} catch (err) {
		if (
			!err.message.includes(
				'Error decrypting private key: Incorrect key passphrase'
			)
		) {
			console.error(err)
		}
		return messages
	}
}

export default async function handler(req, res) {
	try {
		const messages = await getMessages(
			req.body.userId,
			req.body.privateKeyPassphrase
		)

		res.json(messages)
	} catch (e) {
		console.error(e)
	}
}
