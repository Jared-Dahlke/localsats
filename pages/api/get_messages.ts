import prisma from '@/lib/prisma'
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
			]
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
					finalMessages.push({ ...m, body: '---BEGIN PGP MESSAGE---....' })
				}
			} else {
				finalMessages.push(m)
			}
		}

		return finalMessages
	} catch (err) {
		console.log('err', err)
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
