import useLocalStorage from 'use-local-storage'

export const usePgpPassword = () => {
	const [pgpPassword, setPgpPassword] = useLocalStorage('pgpPassword', '')

	return {
		pgpPassword,
		setPgpPassword: (password: string) => {
			setPgpPassword(password)
		}
	}
}
