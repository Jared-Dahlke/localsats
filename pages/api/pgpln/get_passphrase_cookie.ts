import { getCookie } from 'cookies-next'

export default async function handler(req, res) {
	try {
		const passphrase = getCookie('privateKeyPassphraseLn', { req, res })
		res.json(passphrase)
	} catch (e) {
		console.error(e)
	}
}
