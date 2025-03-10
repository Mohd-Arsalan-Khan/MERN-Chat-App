import React, { useEffect, useState } from 'react'
import { chatState } from '../../context/chatProvider'
import { Box, Button, Stack, useToast, Text } from '@chakra-ui/react'
import axios from 'axios'
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from '../ChatLoading'
import { getSender } from '../../config/ChatLogics'
import GroupChatModal from './GroupChatModal'

const MyChat = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState()
  const {selectedChat, setSelectedChat, user, chats, setChats} = chatState()

  const toast = useToast()

  const fetchChats = async() =>{
    if (!user?.token) {
      toast({
        title: "Authentication Error",
        description: "No token found, please log in again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    try {
      const {data} = await axios.get("/api/v1/chat", 
        {headers: {Authorization: `Bearer ${user.token}`}}
      )


      setChats(data)
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "faild to load the chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      })
    }
  }
  useEffect(()=>{
  setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
  fetchChats()
  },[fetchAgain])

  
  return (
    <Box
      display={{base: selectedChat ? "none" : "flex", md:"flex"}}
      flexDirection="column"
      padding={3}
      background="white"
      width={{base: "100%", md:"31%"}}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
      paddingBottom={3}
      paddingX={3}
      fontSize={{base: "28px", md:"30px"}}
      fontFamily="Work sans"
      display="flex"
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      >
        My Chats
        <GroupChatModal>
        <Button display="flex" fontSize={{base: "17px", md: "10px", lg: "17px"}}
        rightIcon={<AddIcon/>}
        >
          New Group Chat
        </Button>
        </GroupChatModal>
      </Box>
      <Box
      display="flex"
      flexDirection="column"
      padding={3}
      background="#F8F8F8"
      width="100%"
      height="100%"
      borderRadius="lg"
      overflow="auto"
      maxHeight="80vh"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) =>(
              <Box
              onClick={() => setSelectedChat(chat)}
              cursor="pointer"
              background={selectedChat === chat? "#38B2AC" : "#E8E8E8"}
              color={selectedChat === chat? "white" : "black"}
              paddingX={3}
              paddingY={2}
              borderRadius="lg"
              key={chat._id}
              >
                <Text>
                {!chat.isGroupChat? (loggedUser && chat.users ? getSender(loggedUser, chat.users) : "Loading..."): chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ):(<ChatLoading/>)}
      </Box>
    </Box>
  )
}

export default MyChat