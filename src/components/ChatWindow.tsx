import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Send, Bookmark, Menu } from 'lucide-react';
import useChatStore from '../store/chatStore';
import { Message } from '../types/chat';

interface ChatWindowProps {
  onMenuToggle: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onMenuToggle }) => {
  const { selectedChatId, messages, sendMessage, toggleMessageBookmark, chats } = useChatStore();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMessages = useMemo(() => messages[selectedChatId as keyof typeof messages] || [], [messages, selectedChatId]);
  const selectedChat = useMemo(() => chats.find(chat => chat.chat_id === selectedChatId), [chats, selectedChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = useCallback(() => {
    if (selectedChatId && newMessage.trim()) {
      sendMessage(selectedChatId, newMessage.trim());
      setNewMessage('');
    }
  }, [selectedChatId, newMessage, sendMessage]);

  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  if (!selectedChat) {
    return (
      <div className="flex flex-col h-full">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center">
          <button onClick={onMenuToggle} className="md:hidden mr-4">
            <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Chat</h2>
        </div>
        <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <p className="text-xl text-gray-500 dark:text-gray-400">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-gray-500 dark:text-gray-400">Chat not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center">
        <button onClick={onMenuToggle} className="md:hidden mr-4">
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
        <img
          src={selectedChat.sender_details.profile_data.profile_picture || 'https://via.placeholder.com/40'}
          alt={`${selectedChat.sender_details.profile_data.first_name} ${selectedChat.sender_details.profile_data.last_name}`}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h2 className="font-semibold text-gray-800 dark:text-gray-200">
            {selectedChat.sender_details.profile_data.first_name} {selectedChat.sender_details.profile_data.last_name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{selectedChat.sender_details.profile_data.headline}</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((message: Message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_id === -1 ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                message.sender_id === -1
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              <p className="break-words">{message.content}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs opacity-75">
                  {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <button
                  onClick={() => selectedChatId && toggleMessageBookmark(selectedChatId, message.id)}
                  className="text-xs opacity-75 hover:opacity-100 transition-opacity"
                >
                  {message.bookmarked ? (
                    <Bookmark className={`w-4 h-4 fill-current ${message.sender_id === -1 ? 'text-white' : 'text-blue-500'}`} />
                  ) : (
                    <Bookmark className={`w-4 h-4 ${message.sender_id === -1 ? 'text-white' : 'text-gray-500'}`} />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message"
            className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChatWindow);
