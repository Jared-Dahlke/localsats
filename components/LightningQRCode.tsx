import React from 'react'
import QRCode, { QRCodeProps } from 'react-qr-code'

type LightningQRCodeProps = QRCodeProps

export function LightningQRCode(props: LightningQRCodeProps) {
	return (
		<QRCode
			{...(props as any)}
			size={256}
			style={{
				height: 'auto',
				maxWidth: '100%',
				width: '100%'
			}}
			viewBox={`0 0 256 256`}></QRCode>
	)
}
