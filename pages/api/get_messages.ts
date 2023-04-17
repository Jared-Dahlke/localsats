import prisma from '@/lib/prisma'
import { Console } from 'console'
const openpgp = require('openpgp')

export const getMessages = async (
	userId: string,
	privateKeyPassphrase: string
) => {
	const messages = await prisma.message.findMany({
		where: {
			OR: [
				{
					toUserId: userId
				},
				{
					fromUserId: userId
				}
			],
			deletedDate: null
		},
		orderBy: {
			sentDate: 'asc'
		}
	})

	const user = await prisma.user.findUnique({
		where: {
			userId: userId
		}
	})
	console.log('user', user)
	const pgpPrivateKey = user?.pgpPrivateKeyEncrypted

	try {
		console.log('before', pgpPrivateKey, privateKeyPassphrase)
		const privateKey = await openpgp.decryptKey({
			privateKey: await openpgp.readPrivateKey({ armoredKey: pgpPrivateKey }),
			passphrase: privateKeyPassphrase
		})
		console.log('made it here', messages)

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
			console.log('here 1')
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
		console.log('here 2')
		console.error(e)
	}
}
