import { getServerSession } from 'next-auth'
import { getToken } from 'next-auth/jwt'
import { authOptions } from './pages/api/auth/[...nextauth]'

// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
	const token = await getToken({ req })
	if (!token) {
		const url = new URL(`/`, req.url)
		return NextResponse.redirect(url)
	}
	return NextResponse.next()
}

export const config = {
	matcher: ['/home/:path*', '/about/:path*', '/profile/:path*']
}
