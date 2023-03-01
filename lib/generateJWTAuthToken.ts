import jwt from 'jsonwebtoken'

export function generateJWTAuthToken(twoFactorAuthToken: any) {
	if (!process.env.NEXTAUTH_SECRET) {
		throw new Error('No NEXTAUTH_SECRET set')
	}
	return jwt.sign(twoFactorAuthToken, process.env.NEXTAUTH_SECRET, {
		expiresIn: 30 + ' days'
	})
}
