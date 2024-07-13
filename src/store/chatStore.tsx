import create from 'zustand';
import { fetchChats, fetchMessages, markAsRead, pollMessages } from '../services/api';
import { Message, ChatStore } from '../types/chat';

const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  selectedChatId: null,
  messages: {},
  loadChats: async (filter, userId, pageDetails) => {
    const result = await fetchChats(
      { read: filter.read, bookmark: filter.bookmark },
      userId,
      pageDetails
    );
    set({ chats: result.chats });
  },
  selectChat: (chatId) => {
    set({ selectedChatId: chatId });
    get().loadMessages(chatId, { last_message_id: null, page_size: 20 });
    get().markAsRead(chatId, true);
  },
  loadMessages: async (chatId, cursor) => {
    const result = await fetchMessages(chatId, cursor);
    set((state) => ({
      messages: { ...state.messages, [chatId]: result.messages },
    }));
  },
  sendMessage: (chatId, content) => {
    const newMessage: Message = {
      id: `local_${Date.now()}`,
      content,
      created_at: new Date().toISOString(),
      sender_id: -1,
      status: 'SENT',
    };
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), newMessage],
      },
    }));
  },
  markAsRead: async (chatId, read) => {
    await markAsRead(chatId, read);
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.chat_id === chatId ? { ...chat, read, unread_count: 0 } : chat
      ),
    }));
  },
  pollMessages: async (chatId, lastMessageId) => {
    const result = await pollMessages(chatId, lastMessageId);
    if (result.messages.length > 0) {
      set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: [...(state.messages[chatId] || []), ...result.messages],
        },
      }));
    }
  },
  toggleMessageBookmark: (chatId, messageId) => set((state) => ({
    messages: {
      ...state.messages,
      [chatId]: state.messages[chatId].map(message =>
        message.id === messageId
          ? { ...message, bookmarked: !message.bookmarked }
          : message
      )
    }
  })),
  toggleChatBookmark: (chatId: number) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.chat_id === chatId ? { ...chat, bookmark: !chat.bookmark } : chat
      ),
    }));
  },
}));

export default useChatStore;
