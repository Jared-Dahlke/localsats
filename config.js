const config = {
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: true,
		ca: process.env.CERT
	}
}
exports.config = config
