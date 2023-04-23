import { NextRequest, NextResponse } from 'next/server'

const NodeGeocoder = require('node-geocoder')

const options = {
	provider: 'google',
	apiKey: process.env.GOOGLE_GEOCODE_API_KEY, // for Mapquest, OpenCage, Google Premier
	formatter: null // 'gpx', 'string', ...
}

const geocoder = NodeGeocoder(options)

export default async function handler(req: NextRequest, res: NextResponse) {
	try {
		if (!req?.body || !req.body.address) return null
		const result = await geocoder.geocode(req.body.address)
		res.json(result)
	} catch (e) {
		console.error(e)
	}
}
