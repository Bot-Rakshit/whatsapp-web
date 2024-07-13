export interface User {
  user_id: number;
  profile_data: {
    first_name: string;
    last_name: string;
    profile_picture: string;
    headline: string;
    followers: string;
  };
}

export interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_id: number;
  status?: 'SENT' | 'DELIVERED' | 'READ';
  bookmarked?: boolean;
}

export interface Chat {
  chat_id: number;
  sender_details: User;
  last_message: {
    id: string;
    content: string;
    created_at: string;
    status: string;
  };
  read: boolean;
  bookmark: boolean;
  unread_count: number;
}

export interface GroupedMessage {
  sender_id: number;
  messages: Message[];
}

export interface ChatStore {
  chats: Chat[];
  selectedChatId: number | null;
  messages: { [chatId: number]: Message[] };
  loadChats: (filter: { read?: boolean; bookmark?: boolean }, userId: number, pageDetails: { page_size: number; last_element_position: number }) => Promise<void>;
  selectChat: (chatId: number) => void;
  loadMessages: (chatId: number, cursor: { last_message_id: string | null; page_size: number }) => Promise<void>;
  sendMessage: (chatId: number, content: string) => void;
  markAsRead: (chatId: number, read: boolean) => Promise<void>;
  pollMessages: (chatId: number, lastMessageId: string) => Promise<void>;
  toggleMessageBookmark: (chatId: number, messageId: string) => void;
  toggleChatBookmark: (chatId: number) => void;
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export interface CountBtnProps {
  className?: string;
}