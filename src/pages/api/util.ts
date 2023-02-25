export const database =
	process.env.NODE_ENV !== 'production'
		? 'BuySellBitcoinInPersonDev'
		: 'BuySellBitcoinInPerson'
