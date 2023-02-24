import Axios from 'axios'
import React from 'react'

export const useUser = () => {
	const [user, setUser] = React.useState<string | null>(null)
	React.useEffect(() => {
		Axios({
			method: 'GET',
			withCredentials: true,
			url: '/user'
		}).then((res) => {
			res.data.id ? setUser(res.data.id) : null
		})
	}, [])
	return user
}
