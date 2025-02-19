import React, { useEffect } from 'react'
import { chatState } from '../context/chatProvider'
import { Box, IconButton, Text } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { getSender } from '../config/ChatLogics'

const SingleChat = ({fetchAgain, setFetchAgain}) => {

    const{user, selectedChat, setSelectedChat} = chatState()

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
        </>):(<>{selectedChat.chatName.toUpperCase()}
        {/* <UpdateGroupChatModal
        fetchAgain = {fetchAgain}
        setFetchAgain = {setFetchAgain}
        /> */}
        </>)}
    </Text>
    </>):(
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
            <Text fontSize="3xl" paddingBottom={3} fontFamily="Work Sans">Click on a user to start chating</Text>
        </Box>
    )}</>
  )
}

export default SingleChat