import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Search, MoreVertical, PinIcon } from 'lucide-react';
import useChatStore from '../store/chatStore';
import { Chat } from '../types/chat';

interface ChatListProps {
  filter?: { read?: boolean; bookmark?: boolean };
}

const ChatList: React.FC<ChatListProps> = ({ filter = {} }) => {
  const { chats, loadChats, selectChat, pinChat, markChatAsUnread } = useChatStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const loadMoreChats = useCallback(async (resetPage = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const pageToLoad = resetPage ? 0 : page;
      await loadChats(filter, { page_size: 20, last_element_position: pageToLoad * 20 });
      setPage(pageToLoad + 1);
    } catch (err) {
      setError('Failed to load chats. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filter, page, loadChats]);

  useEffect(() => {
    setPage(0);
    loadMoreChats(true);
  }, [filter]);

  const handleChatSelect = useCallback((chatId: number) => {
    selectChat(chatId);
  }, [selectChat]);

  const handlePinChat = useCallback((e: React.MouseEvent, chatId: number) => {
    e.stopPropagation();
    pinChat(chatId);
  }, [pinChat]);

  const handleMenuToggle = useCallback((e: React.MouseEvent, chatId: number) => {
    e.stopPropagation();
    setMenuOpen((prev) => prev === chatId ? null : chatId);
  }, []);

  const handleMarkAsUnread = useCallback(async (e: React.MouseEvent, chatId: number) => {
    e.stopPropagation();
    await markChatAsUnread(chatId);
    setMenuOpen(null);
  }, [markChatAsUnread]);

  const filteredAndSortedChats = useMemo(() => {
    return chats
      .filter((chat) =>
        chat.sender_details.profile_data.first_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filter.read === undefined || chat.read === filter.read) &&
        (filter.bookmark === undefined || chat.bookmark === filter.bookmark)
      )
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.last_message.created_at).getTime() - new Date(a.last_message.created_at).getTime();
      });
  }, [chats, searchTerm, filter.read, filter.bookmark]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredAndSortedChats.map((chat: Chat) => (
          <div
            key={chat.chat_id}
            className="flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors relative"
            onClick={() => handleChatSelect(chat.chat_id)}
          >
            <div className="flex items-center flex-1 min-w-0">
              <img
                src={chat.sender_details.profile_data.profile_picture || 'https://via.placeholder.com/40'}
                alt={`${chat.sender_details.profile_data.first_name} ${chat.sender_details.profile_data.last_name}`}
                className="w-10 h-10 rounded-full mr-3 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                    {chat.sender_details.profile_data.first_name} {chat.sender_details.profile_data.last_name}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                    {new Date(chat.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{chat.last_message.content}</p>
              </div>
            </div>
            <div className="flex flex-col items-end ml-2 flex-shrink-0">
              {chat.unread_count > 0 ? (
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 mb-1">
                  {chat.unread_count}
                </span>
              ) : !chat.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mb-1"></div>
              )}
              <button
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={(e) => handleMenuToggle(e, chat.chat_id)}
              >
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
              <button
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={(e) => handlePinChat(e, chat.chat_id)}
              >
                <PinIcon className={`w-5 h-5 ${chat.pinned ? 'text-blue-500' : 'text-gray-400'}`} />
              </button>
            </div>
            {menuOpen === chat.chat_id && (
              <div className="absolute top-12 right-2 bg-white dark:bg-gray-800 shadow-md rounded-md z-10">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                  onClick={(e) => handlePinChat(e, chat.chat_id)}
                >
                  {chat.pinned ? 'Unpin' : 'Pin'} Chat
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                  onClick={(e) => handleMarkAsUnread(e, chat.chat_id)}
                >
                  Mark as {chat.read ? 'unread' : 'read'}
                </button>
              </div>
            )}
          </div>
        ))}
        {isLoading && <div className="p-4 text-center text-gray-600 dark:text-gray-400">Loading...</div>}
        {error && <div className="p-4 text-center text-red-500">{error}</div>}
      </div>
    </div>
  );
};

export default React.memo(ChatList);
