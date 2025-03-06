import React, { useEffect, useState } from 'react'
import { chatState } from '../context/chatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/ChatLogics'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import axios from 'axios'
import ScrollableChat from './ScrollableChat'

const SingleChat = ({fetchAgain, setFetchAgain}) => {

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessages] = useState("")

  const toast = useToast()

    const{user, selectedChat, setSelectedChat} = chatState()

    const fetchMessages = async() =>{
      if (!selectedChat) {
        return
      }

      try {
        setLoading(true)
        const {data} = await axios.get(`/api/v1/message/${selectedChat._id}`,{
          headers:{Authorization:`Bearer ${user.token}`}
        })

        console.log(messages)
        setMessages(data)
        setLoading(false)
      } catch (error) {
        toast({
          title: "Error Occured",
          description:"Failed to load the meesage",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
      }
    }
    useEffect(()=>{
      fetchMessages()
    },[selectedChat])

    const sendMessage = async(event) =>{
      if (event.key === "Enter" && newMessage) {
        try {
          setNewMessages("")
          const {data} = await axios.post("/api/v1/message",{
            content: newMessage,
            chatId: selectedChat._id
          },
          {headers: {
            "Content-Type":"application/json",
            Authorization: `Bearer ${user.token}`}}
          )
          console.log(data)
          setMessages([...messages, data])
        } catch (error) {
          toast({
            title: "Error Occured",
            description:"Failed to send the meesage",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom"
          })
        }
      }
    }
    const typingHandler = (e) =>{
      setNewMessages(e.target.value)
    }

  return (
    <>{selectedChat?(<>
    <Text fontSize={{base: "28px", md: "30px"}} paddingBottom={3} paddingX={2} width="100%" fontFamily="Work Sans" display="flex"
    justifyContent={{base: "space-between"}} alignItems="center"
    >
        <IconButton
        display={{base: "flex", md:"none"}}
        icon={<ArrowBackIcon/>}
        onClick={() => setSelectedChat("")}
        />
        {!selectedChat.isGroupChat ?(<>
          {getSender(user, selectedChat.users)}
          <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
        </>):(<>{selectedChat.chatName.toUpperCase()}
        <UpdateGroupChatModal
        fetchAgain = {fetchAgain}
        setFetchAgain = {setFetchAgain}
        fetchMessages = {fetchMessages}
        />
        </>)}
    </Text>
    <Box display="flex" flexDirection="column" justifyContent="flex-end" padding={3} backgroundColor="#E8E8E8" width="100%"
    height="100%" borderRadius="lg" overflowY="hidden"
    >
      {loading ? (<Spinner
      size="xl"
      width={20}
      height={20}
      alignSelf="center"
      margin="auto"
      />) : (<div className='messages'>
        <ScrollableChat messages={messages}/>
      </div>)}
      <FormControl display="flex" alignItems="center" isRequired marginTop={3}>
      <Input
        variant="Filled"
        background="#E0E0E0"
        placeholder="Enter your message"
        onChange={typingHandler}
        value={newMessage}
        onKeyDown={sendMessage}
      />
      <IconButton
        icon={<ArrowForwardIcon/>}
        colorScheme="blue"
        onClick={() => sendMessage({ key: "Enter" })}
        marginLeft={2}
      />
</FormControl>
    </Box>
    </>):(
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
            <Text fontSize="3xl" paddingBottom={3} fontFamily="Work Sans">Click on a user to start chating</Text>
        </Box>
    )}</>
  )
}

export default SingleChat