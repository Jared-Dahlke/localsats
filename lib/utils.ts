export const getAppUrl = (): string =>
	global.window
		? window.location.origin
		: (process.env.NEXT_PUBLIC_APP_URL as string)
