import { usePosts } from '@/hooks/usePosts'
import { PostType } from '@/types/types'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import dayjs from 'dayjs'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { Layout } from '@/components/layout'
import { getPosts } from './api/get_posts'
import { getUsers } from './api/get_users'
import CountUp from 'react-countup'
import { useText } from '@/hooks/useText'
import { getOptions } from '@/lib/next-auth-lnurl'
import { lnurlAuthConfig } from '@/lib/lnurlAuthConfig'

export default function About({
	posts: initialPosts,
	users: initialUsers
}: {
	posts: PostType[]
	users: any
}) {
	const t = useText()
	const faqs = [
		{
			question: t.whatIsThis,
			answer: t.itIsAnEasyWayToBuy
		},
		{
			question: t.howLongDoYouKeepOrders,
			answer: t.weKeepOrders
		},
		{
			question: t.whatDataDoYouStore,
			answer: (
				<div>
					<div>{t.weStoreTheEncrypted}</div>
					<div className='mt-4'>
						{t.dumpAllOfTheSite}
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
							{t.download}
						</button>
					</div>
				</div>
			)
		},

		{
			question: t.whatIsTheTechStack,
			answer: <div>{t.loginUsesLnurlAuth}</div>
		},
		{
			question: t.howDoIContribute,
			answer: (
				<div>
					{t.IdeasContributorsAreWelcome}{' '}
					<Link
						className='text-blue-500 underline'
						href={'https://github.com/Jared-Dahlke/localsats'}>
						https://github.com/Jared-Dahlke/localsats
					</Link>
					{'. '}
					{t.feelFreeTomakeAPr}
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
	const { data: messagesCount } = useQuery(
		['allMessagesCount'],
		() => axios.get('/api/get_all_messages_count').then((res) => res.data),
		{
			refetchInterval: 8000
		}
	)
	const stats = [
		{
			id: 1,
			name: t.daysLive,
			value: <CountUp end={daysLive} />
		},
		{ id: 2, name: t.totalPosts, value: <CountUp end={posts?.length} /> },
		{ id: 3, name: t.totalUsers, value: <CountUp end={users?.length} /> }
	]
	const stats2 = [
		{
			id: 4,
			name: t.totalMessages,
			value: <CountUp end={messagesCount} />
		}
	]

	return (
		<div>
			<div className=' pt-24 pb-12'>
				<div className='mx-auto max-w-7xl px-6 lg:px-8'>
					<dl className='grid grid-cols-1 gap-y-16 gap-x-8 text-center lg:grid-cols-3'>
						{stats.map((stat) => (
							<div
								key={stat.id}
								className='mx-auto flex max-w-xs flex-col gap-y-4'>
								<dt className='leading-7'>{stat.name}</dt>
								<dd className='order-first text-3xl font-semibold tracking-tight  sm:text-5xl'>
									{stat.value}
								</dd>
							</div>
						))}
					</dl>
				</div>
			</div>

			<div className=' pt-12 pb-12'>
				<div className='mx-auto max-w-7xl px-6 lg:px-8'>
					<dl className='grid grid-cols-1 gap-y-16 gap-x-8 text-center'>
						{stats2.map((stat) => (
							<div
								key={stat.id}
								className='mx-auto flex max-w-xs flex-col gap-y-4'>
								<dt className='leading-7'>{stat.name}</dt>
								<dd className='order-first text-3xl font-semibold tracking-tight  sm:text-5xl'>
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
						<h2 className='text-2xl font-bold leading-10 tracking-tight '>
							{t.frequentlyAskedQ}
						</h2>
						<p className='mt-4  leading-7 '>
							{t.cantFindTheAnswer}{' '}
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
									<dt className='text-base font-semibold leading-7 '>
										{faq.question}
									</dt>
									<dd className='mt-2 text-base leading-7 '>{faq.answer}</dd>
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
	return <Layout title='About'>{page}</Layout>
}

export const getServerSideProps = async function ({ req, res }) {
	const session = await getServerSession(req, res, getOptions(lnurlAuthConfig))
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
