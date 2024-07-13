import React, { useState, useRef, useEffect } from 'react';
import { Paper, Typography, List, TextField, Button, Box, IconButton, Avatar } from '@mui/material';
import { Send, Bookmark, BookmarkBorder } from '@mui/icons-material';
import useChatStore from '../store/chatStore';
import { Message } from '../types/chat';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
}));

const MessageList = styled(List)(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  padding: theme.spacing(2),
}));

const MessageItem = styled(Box)<{ align: 'left' | 'right' }>(({ theme, align }) => ({
  display: 'flex',
  flexDirection: align === 'left' ? 'row' : 'row-reverse',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(2),
}));

const MessageBubble = styled(Paper)<{ align: 'left' | 'right' }>(({ theme, align }) => ({
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(2),
  maxWidth: '70%',
  backgroundColor: align === 'left' ? theme.palette.background.paper : theme.palette.primary.main,
  color: align === 'left' ? theme.palette.text.primary : theme.palette.primary.contrastText,
  boxShadow: theme.shadows[1],
}));

const MessageTimestamp = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  opacity: 0.8,
  fontSize: '0.75rem',
}));

const InputArea = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const ChatWindow: React.FC = () => {
  const { selectedChatId, messages, sendMessage, toggleMessageBookmark, chats } = useChatStore();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (selectedChatId && newMessage.trim()) {
      sendMessage(selectedChatId, newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  if (!selectedChatId) {
    return <Typography>Select a chat to start messaging</Typography>;
  }

  const chatMessages = messages[selectedChatId] || [];
  const selectedChat = chats.find(chat => chat.chat_id === selectedChatId);

  return (
    <StyledPaper>
      <Box sx={{ padding: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
        <Avatar src={selectedChat?.sender_details.profile_data.profile_picture} sx={{ marginRight: 2 }} />
        <Typography variant="h6">{`${selectedChat?.sender_details.profile_data.first_name} ${selectedChat?.sender_details.profile_data.last_name}`}</Typography>
      </Box>
      <MessageList>
        {chatMessages.map((message: Message) => (
          <MessageItem key={message.id} align={message.sender_id === -1 ? 'right' : 'left'}>
            <MessageBubble align={message.sender_id === -1 ? 'right' : 'left'}>
              <Typography variant="body1">{message.content}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 0.5 }}>
                <MessageTimestamp sx={{ mr: 1 }}>
                  {new Date(message.created_at).toLocaleTimeString()}
                </MessageTimestamp>
                <IconButton
                  size="small"
                  onClick={() => toggleMessageBookmark(selectedChatId, message.id)}
                  color="inherit"
                >
                  {message.bookmarked ? <Bookmark color="secondary" /> : <BookmarkBorder />}
                </IconButton>
              </Box>
            </MessageBubble>
          </MessageItem>
        ))}
        <div ref={messagesEndRef} />
      </MessageList>
      <InputArea>
        <TextField
          fullWidth
          variant="filled"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message"
          multiline
          maxRows={4}
          sx={{ backgroundColor: 'background.paper' }}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSendMessage}
          endIcon={<Send />}
          sx={{ ml: 2 }}
        >
          Send
        </Button>
      </InputArea>
    </StyledPaper>
  );
};

export default ChatWindow;
