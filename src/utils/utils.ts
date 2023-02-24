import Axios from 'axios'

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
	Axios({
		method: 'GET',
		withCredentials: true,
		url: '/logout'
	}).then(() => (window.location.href = '/'))
}

export const getRoboHash = (userId: string) => {
	return `https://robohash.org/${userId}.png?size=500x500`
}
