import React from 'react'
import QRCode, { QRCodeProps } from 'react-qr-code'

type LightningQRCodeProps = QRCodeProps

export function LightningQRCode(props: LightningQRCodeProps) {
	return <QRCode {...(props as any)}></QRCode>
}
