import React from 'react'
import QRCode, { QRCodeProps } from 'react-qr-code'

type LightningQRCodeProps = QRCodeProps

function calculateLogoSize(
	value: string,
	height: string | number | undefined
): number {
	const isLargeUrl = value.startsWith('lnurl')
	return (
		(((typeof height === 'string'
			? height.indexOf('%') < 0
				? parseInt(height)
				: 0
			: height) ?? 0) /
			(isLargeUrl ? 64 : 32)) *
		(isLargeUrl ? 7.04 : 4.78)
	)
}

export function LightningQRCode(props: LightningQRCodeProps) {
	const [logoSize, setLogoSize] = React.useState(
		calculateLogoSize(props.value, props.height)
	)

	const wrapperRef = React.useRef<HTMLDivElement>(null)
	React.useEffect(() => {
		if (!props.height && wrapperRef.current?.offsetHeight) {
			setLogoSize(
				calculateLogoSize(
					props.value,
					Math.min(
						wrapperRef.current?.offsetWidth,
						wrapperRef.current?.offsetHeight
					)
				)
			)
		}
	}, [props.height, props.value])

	return (
		<QRCode
			// FIXME: qr code props
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
