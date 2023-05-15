import prisma from '@/lib/prisma'
const openpgp = require('openpgp')

export const getPgpPasswordStatus = async (
	userId: string,
	password: string
) => {
	const user = await prisma.user.findUnique({
		where: {
			userId: userId
		}
	})
	const pgpPrivateKey = user?.pgpPrivateKeyEncrypted

	if (!pgpPrivateKey) {
		return 'notset'
	}

	try {
		const privateKey = await openpgp.decryptKey({
			privateKey: await openpgp.readPrivateKey({ armoredKey: pgpPrivateKey }),
			passphrase: password
		})
		return 'correct'
	} catch (err) {
		console.error(err)
		return 'incorrect'
	}
}

export default async function handler(req, res) {
	try {
		const status = await getPgpPasswordStatus(
			req.body.userId,
			req.body.password
		)

		const messages = await prisma.message.findMany({
			where: {
				OR: [
					{
						toUserId: req.body.userId
					}
				]
			},
			orderBy: {
				sentDate: 'asc'
			}
		})

		const getHasMessagesSentToOldKeys = async () => {
			const user = await prisma.user.findUnique({
				where: {
					userId: req.body.userId
				}
			})
			const pgpPrivateKey = user?.pgpPrivateKeyEncrypted

			const privateKey = await openpgp.decryptKey({
				privateKey: await openpgp.readPrivateKey({ armoredKey: pgpPrivateKey }),
				passphrase: req.body.password
			})

			for await (const m of messages) {
				if (m.body.includes('---BEGIN PGP MESSAGE---')) {
					try {
						const message = await openpgp.readMessage({
							armoredMessage: m.body // parse armored message
						})

						await openpgp.decrypt({
							message,
							decryptionKeys: privateKey
						})
					} catch (err) {
						return true
					}
				}
			}

			return false
		}

		let hasMessagesSentToOldKeys = false
		if (status === 'correct') {
			hasMessagesSentToOldKeys = await getHasMessagesSentToOldKeys()
		}

		res.json({
			status,
			hasMessagesSentToOldKeys
		})
	} catch (e) {
		console.error(e)
	}
}
