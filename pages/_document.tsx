import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
	const meta = {
		title: 'localsats.org',
		description: `buy and sell Bitcoin in person`,
		image: 'https://i.postimg.cc/tg8zkHtK/shareimage.png',
		type: 'website'
	}

	return (
		<Html>
			<Head>
				<link rel='icon' href='/bitcoin.svg' />
				<meta
					name='keywords'
					content='buy bitcoin anonymously, buy bitcoin near me'
				/>
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
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
