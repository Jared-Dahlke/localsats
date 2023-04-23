// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { setCookie } from 'cookies-next'

// This function can be marked `async` if using `await` inside
export function middleware(req: NextRequest) {
	console.log('in mid')
	if (req.nextUrl.pathname.includes('do-login-pgp')) {
		console.log('setting cooki in middleware')
		// setCookie('privateKeyPassphraseLn', 'test12345', {
		// 	req,
		// 	res,
		// 	maxAge: 2147483647,
		// 	path: '/',
		// 	sameSite: 'lax'
		// })
		const sig = req.nextUrl.searchParams.get('sig')
		console.log(sig)
		const url = req.nextUrl.clone()
		//	url.pathname = '/home'
		const response = NextResponse.redirect(url)

		if (!!!response.cookies.get('privateKeyPassphraseLn')) {
			response.cookies.set('privateKeyPassphraseLn', sig!)
			return response
		}
	}
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: '/api/:path*'
}