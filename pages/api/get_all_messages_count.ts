import clientPromise from '@/../lib/mongodb'

export const getMessagesCount = async () => {
	const client = await clientPromise
	const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
	const messages = await db.collection('messages').find().toArray()
	return messages?.length
}

export default async function handler(req, res) {
	try {
		const messagesCount = await getMessagesCount()
		res.json(messagesCount)
	} catch (e) {
		console.error(e)
	}
}
