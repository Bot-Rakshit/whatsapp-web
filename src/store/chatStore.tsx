import { create } from 'zustand';
import { fetchChats, fetchMessages, markAsRead, pollMessages } from '../services/api';
import { Chat, Message } from '../types/chat';

interface ChatStore {
  bookmarkedMessages: Array<{
    id: string;
    content: string;
    senderName: string;
    created_at: string;
  }>;
  chats: Chat[];
  selectedChatId: number | null;
  messages: { [chatId: number]: Message[] };
  loadChats: (filter: { read?: boolean; bookmark?: boolean }, pageDetails: { page_size: number; last_element_position: number }) => Promise<void>;
  selectChat: (chatId: number) => Promise<void>;
  loadMessages: (chatId: number, cursor: { last_message_id: string | null; page_size: number }) => Promise<void>;
  sendMessage: (chatId: number, content: string) => Promise<void>;
  markAsRead: (chatId: number, read: boolean) => Promise<void>;
  pollMessages: (chatId: number, lastMessageId: string) => Promise<void>;
  toggleMessageBookmark: (chatId: number, messageId: string) => Promise<void>;
  toggleChatBookmark: (chatId: number) => void;
  pinChat: (chatId: number) => void;
  markChatAsRead: (chatId: number) => Promise<void>;
  markChatAsUnread: (chatId: number) => Promise<void>;
  syncChatsStatus: () => Promise<void>;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
}

const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  selectedChatId: null,
  messages: {},
  bookmarkedMessages: [],
  loadChats: async (filter, pageDetails) => {
    const result = await fetchChats(
      { read: filter.read, bookmark: filter.bookmark },
      pageDetails
    );
    set((state) => {
      const newChats = pageDetails.last_element_position === 0 ? result.chats : [...state.chats, ...result.chats];
      const updatedChats = newChats.map(newChat => {
        const existingChat = state.chats.find(chat => chat.chat_id === newChat.chat_id);
        return existingChat ? { ...newChat, pinned: existingChat.pinned } : newChat;
      });
      return { 
        chats: updatedChats.filter((chat, index, self) => 
          index === self.findIndex((t) => t.chat_id === chat.chat_id)
        )
      };
    });
  },
  selectChat: async (chatId) => {
    set({ selectedChatId: chatId });
    get().loadMessages(chatId, { last_message_id: null, page_size: 20 });
    await get().markChatAsRead(chatId);
  },
  loadMessages: async (chatId, cursor) => {
    const result = await fetchMessages(chatId, cursor);
    set((state) => ({
      messages: { ...state.messages, [chatId]: result.messages },
    }));
  },
  sendMessage: async (chatId, content) => {
    const newMessage: Message = {
      id: `temp_${Date.now()}`,
      content,
      created_at: new Date().toISOString(),
      sender_id: -1,
      status: 'SENT',
    };

    set((state) => {
      const updatedChats = state.chats.map(chat => 
        chat.chat_id === chatId
          ? {
              ...chat,
              last_message: {
                id: newMessage.id,
                content: newMessage.content,
                created_at: newMessage.created_at,
                status: newMessage.status,
              },
              unread_count: 0,
            }
          : chat
      );

      // Move the updated chat to the top
      const chatIndex = updatedChats.findIndex(chat => chat.chat_id === chatId);
      if (chatIndex > 0) {
        const [updatedChat] = updatedChats.splice(chatIndex, 1);
        updatedChats.unshift(updatedChat);
      }

      return {
        chats: updatedChats,
        messages: {
          ...state.messages,
          [chatId]: [...(state.messages[chatId] || []), newMessage],
        },
      };
    });

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));

    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: state.messages[chatId].map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: 'DELIVERED' } : msg
        ),
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
      set((state) => {
        const updatedMessages = {
          ...state.messages,
          [chatId]: [...(state.messages[chatId] || []), ...result.messages],
        };
        const lastMessage = result.messages[result.messages.length - 1];
        const updatedChats = state.chats.filter(chat => chat.chat_id !== chatId);
        const updatedChat = {
          ...state.chats.find(chat => chat.chat_id === chatId)!,
          last_message: {
            id: lastMessage.id,
            content: lastMessage.content,
            created_at: lastMessage.created_at,
            status: lastMessage.status || 'DELIVERED',
          },
          unread_count: state.selectedChatId === chatId ? 0 : (state.chats.find(chat => chat.chat_id === chatId)?.unread_count || 0) + result.messages.length,
          read: state.selectedChatId === chatId,
        };
        updatedChats.unshift(updatedChat);
        return {
          messages: updatedMessages,
          chats: updatedChats,
        };
      });
    }
  },
  toggleMessageBookmark: async (chatId, messageId) => {
    set((state) => {
      const updatedMessages = state.messages[chatId].map((message) =>
        message.id === messageId ? { ...message, bookmarked: !message.bookmarked } : message
      );

      const bookmarkedMessage = updatedMessages.find((m) => m.id === messageId && m.bookmarked);

      let updatedBookmarkedMessages = [...state.bookmarkedMessages];
      if (bookmarkedMessage) {
        const chat = state.chats.find(c => c.chat_id === chatId);
        const senderName = chat ? `${chat.sender_details.profile_data.first_name} ${chat.sender_details.profile_data.last_name}` : `User ${bookmarkedMessage.sender_id}`;
        updatedBookmarkedMessages.push({
          id: bookmarkedMessage.id,
          content: bookmarkedMessage.content,
          senderName: senderName,
          created_at: bookmarkedMessage.created_at,
        });
      } else {
        updatedBookmarkedMessages = updatedBookmarkedMessages.filter((m) => m.id !== messageId);
      }

      return {
        messages: { ...state.messages, [chatId]: updatedMessages },
        bookmarkedMessages: updatedBookmarkedMessages,
      };
    });

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 10000));
  },
  toggleChatBookmark: (chatId) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.chat_id === chatId ? { ...chat, bookmark: !chat.bookmark } : chat
      ),
    }));
  },
  pinChat: (chatId) => {
    set((state) => {
      const updatedChats = state.chats.map((chat) =>
        chat.chat_id === chatId ? { ...chat, pinned: !chat.pinned } : chat
      );
      
      updatedChats.sort((a, b) => {
        if (a.pinned === b.pinned) {
          return new Date(b.last_message.created_at).getTime() - new Date(a.last_message.created_at).getTime();
        }
        return a.pinned ? -1 : 1;
      });

      return { chats: updatedChats };
    });

    setTimeout(() => {
      console.log(`Chat ${chatId} pin status updated`);
    }, 300);
  },
  markChatAsRead: async (chatId) => {
    try {
      await markAsRead(chatId, true);
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.chat_id === chatId ? { ...chat, read: true, unread_count: 0 } : chat
        ),
      }));
    } catch (error) {
      console.error('Failed to mark chat as read:', error);
    }
  },
  markChatAsUnread: async (chatId) => {
    try {
      await markAsRead(chatId, false);
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.chat_id === chatId ? { ...chat, read: false, unread_count: 0 } : chat
        ),
      }));
    } catch (error) {
      console.error('Failed to mark chat as unread:', error);
    }
  },
  syncChatsStatus: async () => {
    const result = await fetchChats({ read: undefined, bookmark: undefined }, { page_size: 20, last_element_position: 0 });
    set((state) => {
      const updatedChats = state.chats.map((chat) => {
        const updatedChat = result.chats.find((c) => c.chat_id === chat.chat_id);
        return updatedChat ? { ...updatedChat, pinned: chat.pinned } : chat;
      });
      
      // Maintain the current order of chats
      updatedChats.sort((a, b) => {
        const indexA = state.chats.findIndex(chat => chat.chat_id === a.chat_id);
        const indexB = state.chats.findIndex(chat => chat.chat_id === b.chat_id);
        return indexA - indexB;
      });

      return { chats: updatedChats };
    });
  },
  isMobileMenuOpen: true,
  setMobileMenuOpen: (isOpen: boolean) => set({ isMobileMenuOpen: isOpen }),
})); // Removed the extra closing parenthesis here

export default useChatStore;
