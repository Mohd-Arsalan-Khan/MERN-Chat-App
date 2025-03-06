import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    IconButton,
    Button,
    useToast,
    Box,
    FormControl,
    Input,
    Spinner,
  } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { chatState } from '../../context/chatProvider'
import UserBadgeItem from '../userAvatar/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../userAvatar/UserListItem'

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain, fetchMessages}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState("")
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRemaneLoading] = useState(false)

    const toast = useToast()
    const {selectedChat, setSelectedChat, user} = chatState()

    const handleRemove = async(user1) =>{
      if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
        toast({
          title: "only admins can remove someone",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
        return
      }
      try {
        setLoading(true)

        const {data} = await axios.put("/api/v1/chat/userRemove",{
          chatId : selectedChat._id,
          userId : user1._id
        }, {headers : {Authorization: `Bearer ${user.token}`}})

        user1._id === user._id ? setSelectedChat() : setSelectedChat(data)
        setFetchAgain(!fetchAgain)
        fetchMessages()
        setLoading(false)
      } catch (error) {
        toast({
          title: "Error Occured",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
      }
    }

    const handleAdd = async(user1) =>{
      if (selectedChat.users.find((u) => u._id === user1._id)) {
        toast({
          title: "User is Alrady Add",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
        return
      }

      if (selectedChat.groupAdmin._id !== user._id) {
        toast({
          title: "Only admin can add someone",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
        return
      }

      try {
        setLoading(true)

        const {data} = await axios.put("/api/v1/chat/userAdd",{
          chatId : selectedChat._id,
          userId : user1._id
        }, {headers : {Authorization: `Bearer ${user.token}`}})

        setSelectedChat(data)
        setFetchAgain(!fetchAgain)
        setLoading(false)
      } catch (error) {
        toast({
          title: "Error Occured",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
      }
    }

    const handleRename = async() =>{
      if (!groupChatName) return
      
      try {
        setRemaneLoading(true)
        const {data} = await axios.put("/api/v1/chat/rename", {chatId: selectedChat._id, chatName: groupChatName},
          {headers : {Authorization: `Bearer ${user.token}`}}
        )
        setSelectedChat(data)
        setFetchAgain(!fetchAgain)
        setRemaneLoading(false)
        
      } catch (error) {
        toast({
          title: "Error Occured",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom"
        })
        setRemaneLoading(false)
      }
      setGroupChatName("")
    }
    const handleSearch = async(query) =>{
      setSearch(query)
      if (!query) {
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
    return (
        <>
          <IconButton display={{base: "flex"}} icon={<ViewIcon/>} onClick={onOpen}/>
    
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{selectedChat.chatName}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box width="100%" display="flex" flexWrap="wrap" paddingBottom={3}>
                    {selectedChat.users.map((u)=>(
                        <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleRemove(u)} />
                    ))}
                </Box>
                <FormControl display="flex">
                    <Input placeholder='Chat Name' marginBottom={3} value={groupChatName} 
                    onChange={(e) => setGroupChatName(e.target.value)}/>
                    <Button variant="solid" colorScheme='teal' marginInline={1} isLoading={renameLoading} onClick={handleRename}>
                        Update
                    </Button>
                </FormControl>
                <FormControl display="flex">
                    <Input placeholder='Add User' marginBottom={1}
                    onChange={(e) => handleSearch(e.target.value)}/>
                </FormControl>
                {loading?(
                  <Spinner size="lg"/>
                ):(
                  searchResult?.map((user) =>(
                    <UserListItem key={user._id} user={user} handleFunction={()=> handleAdd(user)}/>
                  ))
                )}
              </ModalBody>
    
              <ModalFooter>
                <Button onClick={()=> handleRemove(user)} colorScheme='red'>
                  Leave Group
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
    }

export default UpdateGroupChatModal