import React from 'react';
import useChatStore from '../store/chatStore';

const BookmarksTab: React.FC = () => {
  const { bookmarkedMessages } = useChatStore();

  return (
    <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-4">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Bookmarked Messages</h2>
      <div className="space-y-4">
        {bookmarkedMessages.map((message) => (
          <div key={message.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-800 dark:text-gray-200">{message.senderName}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(message.created_at).toLocaleString()}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{message.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarksTab;
