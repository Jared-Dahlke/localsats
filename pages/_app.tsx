import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/react'
import React from 'react'
import Router from 'next/router'
import { LoadingPage } from '@/components/loading'
import { Inter } from 'next/font/google'
import useLocalStorage from 'use-local-storage'
import { ThemeProvider } from 'next-themes'
const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
	const queryClient = new QueryClient()
	const getLayout = Component.getLayout || ((page) => page)
	const [theme, setTheme] = React.useState<'dark' | 'light'>('dark')
	const [loading, setLoading] = React.useState(false)
	React.useEffect(() => {
		const start = () => {
			setLoading(true)
		}
		const end = () => {
			setLoading(false)
		}
		Router.events.on('routeChangeStart', start)
		Router.events.on('routeChangeComplete', end)
		Router.events.on('routeChangeError', end)
		return () => {
			Router.events.off('routeChangeStart', start)
			Router.events.off('routeChangeComplete', end)
			Router.events.off('routeChangeError', end)
		}
	}, [])

	return (
		<SessionProvider session={pageProps.session}>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider defaultTheme='dark'>
					{getLayout(
						<>
							{loading ? (
								<LoadingPage size={64} />
							) : (
								<Component {...pageProps} />
							)}
						</>
					)}
				</ThemeProvider>
				<Analytics />
			</QueryClientProvider>
		</SessionProvider>
	)
}
