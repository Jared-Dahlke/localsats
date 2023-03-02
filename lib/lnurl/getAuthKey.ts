import { sub } from 'date-fns'
import clientPromise from '../mongodb'

export async function getAuthKey(k1: string) {
	const client = await clientPromise
	const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
	const result = await db.collection('lnurlAuthKey').deleteMany({
		created: {
			$lt: sub(new Date(), {
				minutes: 5
			})
		}
	})

	const authKey = await db.collection('lnurlAuthKey').findOne({
		k1: k1 as string
	})

	if (!authKey) {
		return null
	}
	return authKey
}
