import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

interface IProps {
	toAddress: string
	fromAddress: string
	body: string
	subject: string
}

const createSendEmailCommand = ({
	toAddress,
	fromAddress,
	body,
	subject
}: IProps) => {
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
					Data: body
				},
				Text: {
					Charset: 'UTF-8',
					Data: 'TEXT_FORMAT_BODY'
				}
			},
			Subject: {
				Charset: 'UTF-8',
				Data: subject
			}
		},
		Source: fromAddress,
		ReplyToAddresses: [
			/* more items */
		]
	})
}

export const sendEmail = async ({
	toAddress,
	fromAddress,
	body,
	subject
}: IProps) => {
	if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
		console.error('No AWS credentials found')
		return
	}

	const sesClient = new SESClient({
		region: 'us-west-2',
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
		}
	})

	const sendEmailCommand = createSendEmailCommand({
		toAddress,
		fromAddress,
		body,
		subject
	})

	const email = await sesClient.send(sendEmailCommand)
	return email
}
