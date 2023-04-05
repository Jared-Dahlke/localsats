import { ObjectId } from 'mongodb'

export default class User {
	constructor(
		userId: string,
		createDate: Date,
		seenWelcome: boolean,
		pgpPrivateKeyEncrypted?: string,
		pgpPublicKey?: string,
		updatedPrivateKeysDate?: Date,
		email?: string
	) {}
}
