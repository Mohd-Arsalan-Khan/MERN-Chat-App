import React from 'react'
import axios from 'axios'
import { chatState } from '../context/chatProvider'
import { Box } from '@chakra-ui/react'
import ChatBox from '../components/miscellaneous/ChatBox'
import SideBar from '../components/miscellaneous/sideBar'
import MyChat from '../components/miscellaneous/MyChat'

function ChatPage() {
  const {user,fetchAgain, setFetchAgain} = chatState()

  return (
    <div style={{width: "100%"}}>
      {user && <SideBar/>}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChat fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  )
}

export default ChatPage