import clientPromise from '@/../lib/mongodb'

export const getUsers = async () => {
	const client = await clientPromise
	const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
	const users = await db.collection('users').find().toArray()
	return users
}

export default async function handler(req, res) {
	try {
		const users = await getUsers()
		res.json(users)
	} catch (e) {
		console.error(e)
	}
}
