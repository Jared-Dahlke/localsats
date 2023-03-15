import { MessageType } from '..//types/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { GroupedMessage } from '../types/types'
import { rqKeys } from '../constants'
import { parseCookies } from 'nookies'

export const useMessages = ({
	userId,
	initialMessages
}: {
	userId: string
	initialMessages: MessageType[]
}) => {
	const cookies = parseCookies()
	const messagesQuery = useQuery(
		rqKeys.messagesKey(),
		() => {
			return axios
				.post<MessageType[]>('/api/get_messages', {
					userId,
					privateKeyPassphrase: cookies.privateKeyPassphrase
				})
				.then((data) => data.data)
		},
		{
			enabled: !!userId,
			refetchInterval: 10000,
			initialData: initialMessages
		}
	)

	const createMessageMutation = useMutation(
		(message: Omit<MessageType, '_id'>) => {
			return axios.post('/api/create_message', {
				message
			})
		},
		{
			onSuccess: () => {
				messagesQuery.refetch()
			}
		}
	)

	const distinctChatPaywallIds = []

	for (const message of messagesQuery?.data || []) {
		// get distinct list of chatPaywallIds
		if (!distinctChatPaywallIds.includes(message.chatPaywallId)) {
			distinctChatPaywallIds.push(message.chatPaywallId)
		}
	}

	const messagesGroupedByChatPaywallId: GroupedMessage[] = []
	for (const chatPaywallId of distinctChatPaywallIds) {
		// get the messages from messagesQuery?.data?.data for each chatPaywallId
		const messagesForChatPaywallId = messagesQuery?.data?.filter(
			(message) => message.chatPaywallId === chatPaywallId
		)
		messagesGroupedByChatPaywallId.push({
			chatPaywallId,
			postId: messagesForChatPaywallId[0].postId,
			hasUnreadMessages: messagesForChatPaywallId.some(
				(message) => message.seen === false && message.toUserId === userId
			),
			messages: messagesForChatPaywallId
		})
	}

	return {
		messagesQuery,
		groupedMessages: messagesGroupedByChatPaywallId,
		createMessageMutation
	}
}
