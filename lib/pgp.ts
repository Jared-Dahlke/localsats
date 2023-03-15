const openpgp = require('openpgp')

export const encryptMessage = async ({
	publicKey1,
	publicKey2,
	message
}: {
	publicKey1: string
	publicKey2: string
	message: string
}) => {
	const publicKey = await openpgp.readKey({
		armoredKey: publicKey1
	})
	const myPublicKey = await openpgp.readKey({
		armoredKey: publicKey2
	})
	const encryptedMessage = await openpgp.encrypt({
		message: await openpgp.createMessage({ text: message }),
		encryptionKeys: [publicKey, myPublicKey]
	})

	return encryptedMessage
}
