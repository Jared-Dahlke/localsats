import clientPromise from '../../lib/mongodb'
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')

const createSendEmailCommand = (toAddress, fromAddress) => {
	return new SendEmailCommand({
		Destination: {
			/* required */
			CcAddresses: [
				/* more items */
			],
			ToAddresses: [
				toAddress
				/* more To-email addresses */
			]
		},
		Message: {
			/* required */
			Body: {
				/* required */
				Html: {
					Charset: 'UTF-8',
					Data: `<div>
										You've received a new message on localsats.org. <a href='https://localsats.org'>Click here to view it</a>
									</div>`
				},
				Text: {
					Charset: 'UTF-8',
					Data: 'TEXT_FORMAT_BODY'
				}
			},
			Subject: {
				Charset: 'UTF-8',
				Data: 'New message received on localsats.org'
			}
		},
		Source: fromAddress,
		ReplyToAddresses: [
			/* more items */
		]
	})
}

export default async function handler(req, res) {
	try {
		const message = req.body.message
		const client = await clientPromise
		const db = client.db(process.env.NEXT_PUBLIC_DATABASE_NAME)
		const result = await db.collection('messages').insertOne(message)
		// send email to toUserId

		const toUser = await db
			.collection('users')
			.findOne({ userId: message.toUserId })
		if (toUser?.email) {
			const sesClient = new SESClient({
				region: 'us-west-2',
				credentials: {
					accessKeyId: process.env.AWS_ACCESS_KEY_ID,
					secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
				}
			})

			const sendEmailCommand = createSendEmailCommand(
				toUser.email,
				'notifications@localsats.org'
			)

			try {
				sesClient.send(sendEmailCommand)
			} catch (err) {
				console.log('Error', err)
			}
		}

		res.json(result)
	} catch (e) {
		console.error(e)
	}
}
