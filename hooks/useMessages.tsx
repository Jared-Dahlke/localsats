import { MessageType } from '..//types/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { GroupedMessage } from '../types/types'
import { rqKeys } from '../constants'

export const useMessages = ({ userId }: { userId: string }) => {
	const messagesQuery = useQuery(
		rqKeys.messagesKey(),
		() => {
			return axios.post<MessageType[]>('/api/get_messages', {
				userId
			})
		},
		{
			enabled: !!userId,
			refetchInterval: 10000
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

	for (const message of messagesQuery?.data?.data || []) {
		// get distinct list of chatPaywallIds
		if (!distinctChatPaywallIds.includes(message.chatPaywallId)) {
			distinctChatPaywallIds.push(message.chatPaywallId)
		}
	}

	const messagesGroupedByChatPaywallId: GroupedMessage[] = []
	for (const chatPaywallId of distinctChatPaywallIds) {
		// get the messages from messagesQuery?.data?.data for each chatPaywallId
		const messagesForChatPaywallId = messagesQuery?.data?.data.filter(
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
