export type UserType = {
	userId: string
	createDate: Date
	seenWelcome: boolean
	pgpPrivateKeyEncrypted?: string
	pgpPublicKey?: string
	updatedPrivateKeysDate?: Date
	email?: string
}

export type PostType = {
	_id: string
	type: string
	amount: number
	postedAt: string
	lat: number
	lng: number
	userId: string
}

export type MessageType = {
	_id: string
	postId: string
	fromUserId: string
	toUserId: string
	body: string
	sentDate: Date
	seen: boolean
	chatPaywallId: string
}

export type GroupedMessage = {
	postId: string
	chatPaywallId: string
	hasUnreadMessages: boolean
	messages: MessageType[]
}

export type PaywallRecordType = {
	_id: string
	userId: string
	recipientUserId: string
	postId: string
	createdAt: Date
}
