import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Tabs, Tab, Box } from '@mui/material';
import useChatStore from '../store/chatStore';
import { Chat } from '../types/chat';
import { styled } from '@mui/material/styles';

const StyledListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const UnreadBadge = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  borderRadius: '50%',
  padding: theme.spacing(0.5, 1),
  fontSize: '0.75rem',
  fontWeight: 'bold',
  minWidth: '20px',
  textAlign: 'center',
}));

const ChatList: React.FC = () => {
  const { chats, loadChats, selectChat } = useChatStore();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => { 
    loadChats({ read: tabValue === 1 ? false : undefined }, 1, { page_size: 20, last_element_position: 0 });
  }, [tabValue, loadChats]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleChatSelect = (chatId: number) => {
    selectChat(chatId);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="All Chats" />
        <Tab label="Unread" />
      </Tabs>
      <List sx={{ flexGrow: 1, overflow: 'auto', padding: 2 }}>
        {chats.map((chat: Chat) => (
          <StyledListItem key={chat.chat_id} button onClick={() => handleChatSelect(chat.chat_id)}>
            <ListItemAvatar>
              <Avatar src={chat.sender_details.profile_data.profile_picture} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" component="span">
                    {`${chat.sender_details.profile_data.first_name} ${chat.sender_details.profile_data.last_name}`}
                  </Typography>
                  {chat.unread_count > 0 && (
                    <UnreadBadge>{chat.unread_count}</UnreadBadge>
                  )}
                </Box>
              }
              secondary={
                <Typography component="span" variant="body2" color="textSecondary" noWrap>
                  {chat.last_message.content}
                </Typography>
              }
            />
          </StyledListItem>
        ))}
      </List>
    </Box>
  );
};

export default ChatList;
