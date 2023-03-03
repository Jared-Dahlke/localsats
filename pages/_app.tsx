import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }: AppProps) {
	const queryClient = new QueryClient()
	const getLayout = Component.getLayout || ((page) => page)
	return (
		<SessionProvider session={pageProps.session}>
			<QueryClientProvider client={queryClient}>
				{getLayout(<Component {...pageProps} />)}
				<Analytics />
			</QueryClientProvider>
		</SessionProvider>
	)
}
