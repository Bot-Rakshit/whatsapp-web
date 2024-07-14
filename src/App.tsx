import React, { useState } from 'react';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import BookmarksTab from './components/BookmarksTab';
import { MessageSquare, Bookmark, Bell } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'bookmarks'>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex md:hidden w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`flex-1 p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
            activeTab === 'all' ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          onClick={() => setActiveTab('all')}
        >
          <MessageSquare className="w-6 h-6 mx-auto text-gray-600 dark:text-gray-300" />
        </button>
        <button
          className={`flex-1 p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
            activeTab === 'unread' ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          onClick={() => setActiveTab('unread')}
        >
          <Bell className="w-6 h-6 mx-auto text-gray-600 dark:text-gray-300" />
        </button>
        <button
          className={`flex-1 p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
            activeTab === 'bookmarks' ? 'bg-gray-200 dark:bg-gray-700' : ''
          }`}
          onClick={() => setActiveTab('bookmarks')}
        >
          <Bookmark className="w-6 h-6 mx-auto text-gray-600 dark:text-gray-300" />
        </button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex md:flex-col md:w-20 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <button
            className={`flex-1 md:flex-none p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              activeTab === 'all' ? 'bg-gray-200 dark:bg-gray-700' : ''
            }`}
            onClick={() => setActiveTab('all')}
          >
            <MessageSquare className="w-6 h-6 mx-auto text-gray-600 dark:text-gray-300" />
          </button>
          <button
            className={`flex-1 md:flex-none p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              activeTab === 'unread' ? 'bg-gray-200 dark:bg-gray-700' : ''
            }`}
            onClick={() => setActiveTab('unread')}
          >
            <Bell className="w-6 h-6 mx-auto text-gray-600 dark:text-gray-300" />
          </button>
          <button
            className={`flex-1 md:flex-none p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              activeTab === 'bookmarks' ? 'bg-gray-200 dark:bg-gray-700' : ''
            }`}
            onClick={() => setActiveTab('bookmarks')}
          >
            <Bookmark className="w-6 h-6 mx-auto text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        <div className={`w-full md:w-80 ${isMobileMenuOpen ? 'block' : 'hidden'} md:block flex-shrink-0 overflow-y-auto`}>
          {activeTab === 'all' || activeTab === 'unread' ? (
            <ChatList filter={activeTab === 'unread' ? { read: false } : {}} />
          ) : (
            <BookmarksTab />
          )}
        </div>
        <div className={`flex-1 ${isMobileMenuOpen ? 'hidden' : 'block'} md:block`}>
          <ChatWindow onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        </div>
      </div>
    </div>
  );
};

export default App;
