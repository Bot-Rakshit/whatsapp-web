import { Chat, Message } from '../types/chat';

const mockChats: Chat[] = [
  {
    chat_id: 10000,
    sender_details: {
      user_id: -100,
      profile_data: {
        first_name: "Rohit",
        last_name: "Sharma",
        profile_picture: "",
        headline: "Cricket Player",
        followers: "8787878"
      }
    },
    last_message: {
      id: "msg_1",
      content: "Awesome, texted you there. Thanks",
      created_at: "2024-05-29T04:14:45.614Z",
      status: "DELIVERED"
    },
    read: false,
    bookmark: true,
    unread_count: 2,
    pinned: false
  },
  {
    chat_id: 10001,
    sender_details: {
      user_id: -101,
      profile_data: {
        first_name: "Virat",
        last_name: "Kohli",
        profile_picture: "",
        headline: "Cricket Captain",
        followers: "9999999"
      }
    },
    last_message: {
      id: "msg_5",
      content: "Let's discuss the team strategy",
      created_at: "2024-05-29T05:30:00.000Z",
      status: "DELIVERED"
    },
    read: false,
    bookmark: false,
    unread_count: 1,
    pinned: false
  },
  {
    chat_id: 10002,
    sender_details: {
      user_id: -102,
      profile_data: {
        first_name: "MS",
        last_name: "Dhoni",
        profile_picture: "",
        headline: "Former Captain",
        followers: "7777777"
      }
    },
    last_message: {
      id: "msg_8",
      content: "Great match yesterday!",
      created_at: "2024-05-29T06:45:00.000Z",
      status: "DELIVERED"
    },
    read: false,
    bookmark: true,
    unread_count: 3,
    pinned: false
  },
  {
    chat_id: 10003,
    sender_details: {
      user_id: -103,
      profile_data: {
        first_name: "Jasprit",
        last_name: "Bumrah",
        profile_picture: "",
        headline: "Fast Bowler",
        followers: "5000000"
      }
    },
    last_message: {
      id: "msg_11",
      content: "How's your bowling practice going?",
      created_at: "2024-05-29T07:30:00.000Z",
      status: "DELIVERED"
    },
    read: true,
    bookmark: false,
    unread_count: 0,
    pinned: false
  },
  // Add more chats (about 20-30 in total) following the same structure
];

const mockMessages: { [key: number]: Message[] } = {
  10000: [
    {
      id: "msg_1",
      content: "Awesome, texted you there. Thanks",
      created_at: "2024-05-29T04:14:45.614Z",
      sender_id: -100,
      status: "DELIVERED"
    },
    {
      id: "msg_2",
      content: "No problem, glad to help!",
      created_at: "2024-05-29T04:15:30.000Z",
      sender_id: -1,
      status: "SENT"
    },
    {
      id: "msg_3",
      content: "By the way, how's the team preparation going?",
      created_at: "2024-05-29T04:16:15.000Z",
      sender_id: -100,
      status: "DELIVERED"
    },
    {
      id: "msg_4",
      content: "It's going well. We're focusing on our fielding drills.",
      created_at: "2024-05-29T04:17:00.000Z",
      sender_id: -1,
      status: "SENT"
    }
  ],
  10001: [
    {
      id: "msg_5",
      content: "Let's discuss the team strategy",
      created_at: "2024-05-29T05:30:00.000Z",
      sender_id: -101,
      status: "DELIVERED"
    },
    {
      id: "msg_6",
      content: "Sure, what do you have in mind?",
      created_at: "2024-05-29T05:31:00.000Z",
      sender_id: -1,
      status: "SENT"
    },
    {
      id: "msg_7",
      content: "I think we should focus on our bowling lineup",
      created_at: "2024-05-29T05:32:00.000Z",
      sender_id: -101,
      status: "DELIVERED"
    }
  ],
  10002: [
    {
      id: "msg_8",
      content: "Great match yesterday!",
      created_at: "2024-05-29T06:45:00.000Z",
      sender_id: -102,
      status: "DELIVERED"
    },
    {
      id: "msg_9",
      content: "Thanks, MS! Your advice really helped.",
      created_at: "2024-05-29T06:46:00.000Z",
      sender_id: -1,
      status: "SENT"
    },
    {
      id: "msg_10",
      content: "Always happy to help. Keep up the good work!",
      created_at: "2024-05-29T06:47:00.000Z",
      sender_id: -102,
      status: "DELIVERED"
    }
  ],
  10003: [
    {
      id: "msg_11",
      content: "How's your bowling practice going?",
      created_at: "2024-05-29T07:30:00.000Z",
      sender_id: -103,
      status: "DELIVERED"
    },
    // Add more messages (about 50-100) for this chat
  ],
  // Add more message arrays for other new chats
};

export const fetchChats = (
  applied_filters: { read?: boolean; bookmark?: boolean },
  page_details: { page_size: number; last_element_position: number }
): Promise<{ chats: Chat[]; has_more: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredChats = mockChats;
      if (applied_filters.read !== undefined) {
        filteredChats = filteredChats.filter(chat => chat.read === applied_filters.read);
      }
      if (applied_filters.bookmark !== undefined) {
        filteredChats = filteredChats.filter(chat => chat.bookmark === applied_filters.bookmark);
      }
      const startIndex = page_details.last_element_position;
      const endIndex = startIndex + page_details.page_size;
      const paginatedChats = filteredChats.slice(startIndex, endIndex);
      resolve({ 
        chats: paginatedChats,
        has_more: endIndex < filteredChats.length
      });
    }, 300);
  });
};

export const fetchMessages = (
  chat_id: number,
  cursor: { last_message_id: string | null; page_size: number }
): Promise<{ messages: Message[]; cursor: { last_message_id: string | null; page_size: number; has_next_message: boolean } }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const chatMessages = mockMessages[chat_id] || [];
      const startIndex = cursor.last_message_id ? chatMessages.findIndex(m => m.id === cursor.last_message_id) + 1 : 0;
      const endIndex = startIndex + cursor.page_size;
      const paginatedMessages = chatMessages.slice(startIndex, endIndex);
      resolve({
        messages: paginatedMessages,
        cursor: {
          last_message_id: paginatedMessages[paginatedMessages.length - 1]?.id || null,
          page_size: cursor.page_size,
          has_next_message: endIndex < chatMessages.length
        }
      });
    }, 300);
  });
};

export const markAsRead = (chat_id: number, read: boolean): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.1) {
        reject(new Error('Network error'));
        return;
      }
      const chat = mockChats.find(c => c.chat_id === chat_id);
      if (chat) {
        chat.read = read;
        if (read) {
          chat.unread_count = 0;
        } else {
          chat.unread_count = 0; // Set to 0 when marking as unread
        }
      }
      resolve();
    }, 300);
  });
};

export const pollMessages = (chat_id: number, last_message_id: string): Promise<{ messages: Message[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const chatMessages = mockMessages[chat_id] || [];
      const startIndex = chatMessages.findIndex(m => m.id === last_message_id) + 1;
      const newMessages = chatMessages.slice(startIndex);
      resolve({ messages: newMessages });
    }, 300);
  });
};
