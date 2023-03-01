export const getAppUrl = (): string =>
	global.window ? window.location.origin : (process.env.APP_URL as string)
