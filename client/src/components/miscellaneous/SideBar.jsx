import {Badge, Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import {BellIcon, ChevronDownIcon} from "@chakra-ui/icons"
import React, { useState } from 'react'
import { chatState } from '../../context/chatProvider'
import ProfileModal from './ProfileModal'
import { useNavigate } from 'react-router-dom'
import ChatLoading from '../ChatLoading'
import UserListItem from '../userAvatar/UserListItem'
import axios from 'axios'
import { getSender } from '../../config/ChatLogics'



const SideBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState()
  const navigate = useNavigate()

  const {user, setSelectedChat, chats, setChats, notification, setNotification} = chatState()
  const toast = useToast()

  const logoutHandler = () =>{
    localStorage.removeItem("userInfo")
    navigate('/')
  }
  
  const handleSearch = async() =>{

    if (!search) {
      toast({
        title: "Please enter something is search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left"
      })
      return
    }
    try {
      setLoading(true)
      
      const {data} = await axios.get(`/api/v1/user?search=${search}`, 
        {headers : {Authorization: `Bearer ${user.token}`}}
      )
    
      setLoading(false)
      setSearchResult(data)

    } catch (error) {
      toast({
        title: "error occured",
        description: error.response?.data?.message || "failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      })
    }
  }

  const accessChat = async(userId) =>{
    try {
      setLoadingChat(true)
      const {data} = await axios.post("/api/v1/chat", {userId},
        {headers : {"Content-type":"application/json",Authorization: `Bearer ${user.token}`}}
      )

      if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats])

      setSelectedChat(data);
      setLoadingChat(false);
      onClose()
      
    } catch (error) {
      toast({
        title: "Error fetching the data",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      })
    }
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" bg="white" w="100%" p="5px 10px 5px 10px" borderWidth="5px">
        <Tooltip label="search user to chat" hasArrow placement='bottom-end'>
          <Button variant="ghost" onClick={onOpen}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <Text display={{base:"none", md:"flex"}} px={4}>
            Search User
          </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">Let's Talk</Text>
        <div>
          <Menu>
          <MenuButton p={1} position="relative">
          <BellIcon fontSize="2xl" m={1} />
          {notification.length > 0 && (
            <Badge
              colorScheme="red"
              borderRadius="full"
              px={2}
              fontSize="0.8em"
              position="absolute"
              top="-3px"
              right="-3px"
            >
              {notification.length}
            </Badge>
          )}
        </MenuButton>
            <MenuList paddingLeft={2}>
              {!notification.length && "no new messages"}
              {notification.map((notif, index) => (
              <MenuItem key={index} onClick={() => {
              setSelectedChat(notif.chat);
              setNotification(prevNotifications => prevNotifications.filter(n => n._id !== notif._id)); // Ensure only one instance is removed
              }}>
                  {notif.chat.isGroupChat ? `new message in ${notif.chat.chatName}`:`new message in ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
            <Avatar size="sm" cursor="pointer" name={user.name} src={user.picture} />
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
            <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuDivider/>
            <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
          </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
          <DrawerBody>
          <Box display="flex" paddingBottom={2}>
            <Input
              placeholder='Search by name or email'
              margin={2}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={handleSearch}>Go</Button>
          </Box>
          {loading ? <ChatLoading/>:(
            searchResult?.map(user => (
              <UserListItem
              key={user._id}
              user={user}
              handleFunction={()=>accessChat(user._id)}
              />
            ))
          )}
          {loadingChat && <Spinner display="flex" />}
        </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideBar