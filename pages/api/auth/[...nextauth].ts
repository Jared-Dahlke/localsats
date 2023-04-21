import NextAuth from 'next-auth'
import { getOptions } from '@/lib/next-auth-lnurl'
import { lnurlAuthConfig } from '@/lib/lnurlAuthConfig'

export default NextAuth(getOptions(lnurlAuthConfig))
