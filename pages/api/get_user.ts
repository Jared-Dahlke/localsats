import clientPromise from '@/../lib/mongodb'

export const getUser = async (userId) => {
	const client = await clientPromise
	const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
	const user = await db.collection('users').findOne({ userId: userId })
	return user
}

export default async function handler(req, res) {
	try {
		const user = await getUser(req.body.userId)
		res.json(user)
	} catch (e) {
		console.error(e)
	}
}
