import { PostType } from '@/types/types'
import { useRouter } from 'next/router'
import React from 'react'

export const useLocationProps = (firstPost: PostType) => {
	const { locale } = useRouter()

	const getCoordinatesBasedOffLocale = () => {
		switch (locale) {
			case 'en':
				return [39.7837304, -100.4458825]
			case 'es':
				return [40.4168, -3.7038]
			case 'fr':
				return [48.8566, 2.3522]
			case 'de':
				return [52.52, 13.405]
			case 'it':
				return [41.9028, 12.4964]
			case 'pt':
				return [38.7072, -9.1355]
			case 'ru':
				return [55.7558, 37.6173]
			case 'zh':
				return [39.9042, 116.4074]
			case 'ja':
				return [35.6762, 139.6503]
			default:
				return [51.5074, 0.1278]
		}
	}
	const [locationProps, setLocationProps] = React.useState({
		center: {
			lat: getCoordinatesBasedOffLocale()[0],
			lng: getCoordinatesBasedOffLocale()[1]
		},
		zoom: 3
	})

	React.useEffect(() => {
		if (firstPost) {
			setLocationProps({
				center: {
					lat: firstPost.lat,
					lng: firstPost.lng
				},
				zoom: 4
			})
		}
	}, [firstPost])

	return { locationProps, setLocationProps }
}
