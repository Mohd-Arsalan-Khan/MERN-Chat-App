import React, { useEffect, useState } from 'react'
import { chatState } from '../context/chatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/ChatLogics'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import axios from 'axios'
import ScrollableChat from './ScrollableChat'
import io from "socket.io-client"
import Lottie from "react-lottie"
import animationData from "../animations/typing.json"

const ENDPOINT = "https://mern-chat-app-ijx7.onrender.com"
var socket, selectedChatCompare

const SingleChat = ({fetchAgain, setFetchAgain}) => {

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessages] = useState("")
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const defaultOptions ={
    loop: true,
    autoplay: true,
    animationData: animationData,
    renderSettings:{
      preserverAspectRatio: "xMidYMid slice"
    }
  }
  const toast = useToast()

    const{user, selectedChat, setSelectedChat, notification, setNotification} = chatState()

    const fetchMessages = async() =>{
      if (!selectedChat) {
        return
      }

      try {
        setLoading(true)
        const {data} = await axios.get(`/api/v1/message/${selectedChat._id}`,{
          headers:{Authorization:`Bearer ${user.token}`}
        })
        setMessages(data)
        setLoading(false)

        socket.emit("join chat", selectedChat._id)
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
      socket = io(ENDPOINT, {transports: ["websocket", "polling"]})
      socket.emit("setup", user)
      socket.on("connected", () => setSocketConnected(true))
      socket.on("typing", () => setIsTyping(true))
      socket.on("stop typing", () => setIsTyping(false))
      // return () => {
      //   socket.disconnect();
      // };
  
    },[])

    useEffect(()=>{
      fetchMessages()
      selectedChatCompare = selectedChat;
    },[selectedChat])

    useEffect(() =>{
      socket.on("message recieved", (newMessageRec) =>{
        if (!selectedChatCompare || selectedChatCompare._id !== newMessageRec.chat._id ) {
          setNotification((prevNotifications) => {
            // Prevent duplicates
            if (prevNotifications.some(n => n._id === newMessageRec._id)) {
                return prevNotifications;
            }
            return [newMessageRec, ...prevNotifications];
        });
        setFetchAgain((prev) => !prev);
        }else{
          // setMessages([...messages, newMessageRec])
          setMessages((prev) => [...prev, newMessageRec]);
        }
      })
    })
    useEffect(() => {
      if (selectedChat) {
        setNotification((prevNotifications) =>
          prevNotifications.filter((notif) => notif.chat._id !== selectedChat._id)
        );
      }
    }, [selectedChat, setNotification]); 

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
         
          if (socketConnected) {
            socket.emit("new message", data)
          }
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

      if (!socketConnected) {
        return
      }

      if (!typing) {
        setTyping(true)
        socket.emit("typing", selectedChat._id)
      }
      const lastTypingTime = new Date().getTime()

      setTimeout(()=>{
        const timeNow = new Date().getTime()
        const timeDiff = timeNow - lastTypingTime

        if (timeDiff >= 3000 && typing) {
          socket.emit("stop typing", selectedChat._id)
          setTyping(false)
        }
      }, 3000)
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
      {isTyping ? <div><Lottie options={defaultOptions} width={70} style={{marginBottom: 5, marginLeft: 0}}/></div> : <></>}
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