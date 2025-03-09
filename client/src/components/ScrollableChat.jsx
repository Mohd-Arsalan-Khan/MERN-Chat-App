import React, { useEffect, useRef } from 'react'
import ScrollableFeed from "react-scrollable-feed"
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics'
import { chatState } from '../context/chatProvider'
import { Avatar, Tooltip } from '@chakra-ui/react'


const ScrollableChat = ({messages}) => {

    const {user} = chatState()
    const chatContainerRef = useRef(null)
    useEffect(()=>{
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    },[messages])
  return (
    <div ref={chatContainerRef}
    style={{
      maxHeight: "400px",  // ✅ Ensure height is limited
      overflowY: "auto",   // ✅ Enable scrolling
      padding: "10px",
    }}>
        {messages && messages.map((m,i) =>(<div style={{display:"flex"}} key={m._id}>
            {
                (isSameSender(messages,m,i,user._id)
                || isLastMessage(messages,i,user._id)
                )&&(
                    <Tooltip label={m.sender.name} placement='bottom-start' hasArrow>
                        <Avatar
                        marginTop="7px"
                        marginRight={1}
                        size="sm"
                        cursor="pointer"
                        name={m.sender.name}
                        src={m.sender.picture}
                        />
                    </Tooltip>
                )}
                <span style={{backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                    marginLeft: isSameSenderMargin(messages,m,i,user._id),
                    marginTop: isSameUser(messages,m,i) ? 3 : 10,
                }}>
                    {m.content}
                </span>
        </div>))}
    </div>
  )
}

export default ScrollableChat