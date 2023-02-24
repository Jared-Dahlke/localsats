import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Head from 'next/head'
import 'tippy.js/dist/tippy.css'

export default function App({ Component, pageProps }: AppProps) {
	const queryClient = new QueryClient()

	const getLayout = Component.getLayout || ((page) => page)

	const meta = {
		title: 'localsats.org',
		description: `buy and sell Bitcoin in person`,
		image: 'https://i.postimg.cc/tg8zkHtK/shareimage.png',
		type: 'website'
	}

	return (
		<QueryClientProvider client={queryClient}>
			<Head>
				{/* <link href='/static/favicons/favicon.ico' rel='shortcut icon' />
				<link href='/site.webmanifest' rel='manifest' />
				<link
					href='/static/favicons/apple-touch-icon.png'
					rel='apple-touch-icon'
					sizes='180x180'
				/>
				<link
					href='/static/favicons/favicon-32x32.png'
					rel='icon'
					sizes='32x32'
					type='image/png'
				/>
				<link
					href='/static/favicons/favicon-16x16.png'
					rel='icon'
					sizes='16x16'
					type='image/png'
				/>
				<link
					color='#4a9885'
					href='/static/favicons/safari-pinned-tab.svg'
					rel='mask-icon'
				/> */}
				<title>{meta.title}</title>
				<meta name='robots' content='follow, index' />
				<meta content={meta.description} name='description' />
				<meta property='og:type' content={meta.type} />
				<meta property='og:site_name' content='localsats.org' />
				<meta property='og:description' content={meta.description} />
				<meta property='og:title' content={meta.title} />
				<meta property='og:image' content={meta.image} />
				<meta name='twitter:card' content='summary_large_image' />
				<meta name='twitter:site' content='@localsatsorg' />
				<meta name='twitter:title' content={meta.title} />
				<meta name='twitter:description' content={meta.description} />
				<meta name='twitter:image' content={meta.image} />

				<meta content='#ffffff' name='theme-color' />
				<meta content='#ffffff' name='msapplication-TileColor' />
				<meta
					content='/static/favicons/browserconfig.xml'
					name='msapplication-config'
				/>
			</Head>
			{getLayout(<Component {...pageProps} />)}
		</QueryClientProvider>
	)
}
