import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import {BellIcon, ChevronDownIcon} from "@chakra-ui/icons"
import React, { useState } from 'react'
import { chatState } from '../../context/chatProvider'
import ProfileModal from './ProfileModal'
import { useNavigate } from 'react-router-dom'
import ChatLoading from '../ChatLoading'
import UserListItem from '../userAvatar/UserListItem'
import axios from 'axios'

const SideBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState()
  const navigate = useNavigate()

  const {user} = chatState()
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
  
      setSearchResult(data);
      setLoading(false);

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

  const accessChat = (userId) =>{

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
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1}/>
            </MenuButton>
            {/* <MenuList></MenuList> */}
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
        </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideBar