import { signOut } from 'next-auth/react'
import dayjs from 'dayjs'
var calendar = require('dayjs/plugin/calendar')
dayjs.extend(calendar)

export function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ')
}

export function getNameFromId(id: string | undefined | null) {
	return id?.slice(-5)
}

export function getPostId(id: string | undefined | null) {
	return id?.slice(-4)
}

export const handleLogout = () => {
	signOut().then(() => (window.location.href = '/'))
}

export const getRoboHash = (userId: string) => {
	return `https://robohash.org/${userId}.png?size=500x500`
}

export const getCalendarDate = (date: string) => dayjs(date).calendar()
