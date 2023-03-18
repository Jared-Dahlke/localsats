import { usePosts } from '@/hooks/usePosts'
import { PostType } from '@/types/types'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import dayjs from 'dayjs'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { Layout } from '../components/layout'
import { authOptions } from './api/auth/[...nextauth]'
import { getPosts } from './api/get_posts'
import { getUsers } from './api/get_users'
import CountUp from 'react-countup'

export default function About({
	posts: initialPosts,
	users: initialUsers
}: {
	posts: PostType[]
	users: any
}) {
	const faqs = [
		{
			question: 'What is this?',
			answer: `It is an easy way to buy and sell bitcoin locally. Just create a post to either buy or sell bitcoin, 
				then wait for someone to respond. Once someone responds, you will see their message on the home page. Additionally, you can add an email address to receive an email when someone responds to your post.
				We will never share your email with anyone. From there, you can use the chat to arrange a time to meet and buy/sell your bitcoin.`
		},
		{
			question: 'What data do you store?',
			answer: (
				<div>
					<div>
						We store the encrypted messages and posts associated with your
						LNURL-Auth address. If you choose to add an email address for
						notifications, we will store that as well. When you delete a post,
						that post and all of its associated messages are permanently deleted
						as well. If you choose to remove your email, that is permanently
						deleted as well.
					</div>
					<div className='mt-4'>
						Dump all of the site data (except emails and messages) into a JSON
						file:
						<br />
						<button
							className='inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150'
							onClick={async () => {
								const res = await axios.post('/api/dump_data')
								const blob = new Blob([JSON.stringify(res.data)], {
									type: 'application/json'
								})
								const url = window.URL.createObjectURL(blob)
								const a = document.createElement('a')
								a.href = url
								a.download = `localsats_data_dump_${dayjs().format(
									'YYYY-MM-DDTHH:mm:ss'
								)}.json`
								document.body.appendChild(a)
								a.click()
								a.remove()
							}}>
							Download
						</button>
					</div>
				</div>
			)
		},

		{
			question: 'What is the tech stack for this?',
			answer: (
				<div>
					Login uses LNURL-auth. The frontend is built with Next.js and Tailwind
					CSS. The database is MongoDB. The email service is hosted on AWS. The
					site is hosted on Vercel.
				</div>
			)
		},
		{
			question: 'How do I contribute?',
			answer: (
				<div>
					Ideas / Contributors / contributions are welcome! Here is the github:{' '}
					<Link
						className='text-blue-500 underline'
						href={'https://github.com/Jared-Dahlke/localsats'}>
						https://github.com/Jared-Dahlke/localsats
					</Link>
					{'. '}
					Feel free to make a PR or open an issue. My email is
					jared.dahlke@protonmail.com if you have any questions.
				</div>
			)
		}
		// More questions...
	]

	const daysLive = dayjs().diff(dayjs('2023-03-01'), 'day')
	const posts = usePosts({ initialPosts: initialPosts })

	const { data: users } = useQuery(
		['allUsers'],
		() => axios.get('/api/get_users').then((res) => res.data),
		{
			initialData: initialUsers,
			refetchInterval: 8000
		}
	)
	console.log('users', users)
	const stats = [
		{
			id: 1,
			name: 'Days LocalSats.org has been Live',
			value: <CountUp end={daysLive} />
		},
		{ id: 2, name: 'Total Posts', value: <CountUp end={posts?.length} /> },
		{ id: 3, name: ' Total Users', value: <CountUp end={users?.length} /> }
	]

	return (
		<div className='bg-white'>
			<div className='bg-white pt-24 pb-12'>
				<div className='mx-auto max-w-7xl px-6 lg:px-8'>
					<dl className='grid grid-cols-1 gap-y-16 gap-x-8 text-center lg:grid-cols-3'>
						{stats.map((stat) => (
							<div
								key={stat.id}
								className='mx-auto flex max-w-xs flex-col gap-y-4'>
								<dt className='text-base leading-7 text-gray-600'>
									{stat.name}
								</dt>
								<dd className='order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl'>
									{stat.value}
								</dd>
							</div>
						))}
					</dl>
				</div>
			</div>

			<div className='mx-auto max-w-7xl px-6 py-24 sm:pt-32 lg:py-40 lg:px-8'>
				<div className='lg:grid lg:grid-cols-12 lg:gap-8'>
					<div className='lg:col-span-5'>
						<h2 className='text-2xl font-bold leading-10 tracking-tight text-gray-900'>
							Frequently asked questions
						</h2>
						<p className='mt-4 text-base leading-7 text-gray-600'>
							Can’t find the answer you’re looking for? Reach out to{' '}
							<a
								href='https://twitter.com/LocalSatsOrg'
								className='font-semibold text-indigo-600 hover:text-indigo-500'>
								https://twitter.com/LocalSatsOrg
							</a>{' '}
						</p>
					</div>
					<div className='mt-10 lg:col-span-7 lg:mt-0'>
						<dl className='space-y-10'>
							{faqs.map((faq) => (
								<div key={faq.question}>
									<dt className='text-base font-semibold leading-7 text-gray-900'>
										{faq.question}
									</dt>
									<dd className='mt-2 text-base leading-7 text-gray-600'>
										{faq.answer}
									</dd>
								</div>
							))}
						</dl>
					</div>
				</div>
			</div>
		</div>
	)
}
About.getLayout = function getLayout(page) {
	return <Layout>{page}</Layout>
}

export const getServerSideProps = async function ({ req, res }) {
	const session = await getServerSession(req, res, authOptions)
	const user = session?.user?.userId
	if (!user) {
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		}
	}
	const posts = await getPosts()
	const users = await getUsers()
	return {
		props: {
			posts: JSON.parse(JSON.stringify(posts)),
			users: JSON.parse(JSON.stringify(users)),
			user
		}
	}
}
