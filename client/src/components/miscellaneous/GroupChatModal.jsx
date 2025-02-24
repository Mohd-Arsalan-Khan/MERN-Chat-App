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
    Button,
    useToast,
    FormControl,
    Input,
    Box,
  } from '@chakra-ui/react'
import { chatState } from '../../context/chatProvider'
import UserListItem from '../userAvatar/UserListItem'
import axios from 'axios'
import UserBadgeItem from '../userAvatar/UserBadgeItem'

const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setgroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setsearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const toast = useToast()

    const {user, chats, setChats} =  chatState()
    const handleSearch = async(query) =>{
        setsearch(query)
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
    const handleSubmit = async() =>{
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "please fill all the field",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            return
        }

        try {
            const {data} = await axios.post("/api/v1/chat/group",{
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u)=>u._id))
            },
                {headers : {Authorization: `Bearer ${user.token}`}}
              )
              setChats([data, ...chats])
            onClose()
            toast({
                title:`${groupChatName} group is created`,
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
        } catch (error) {
            toast({
                title:"Faild to create the group chat",
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
        }
    }

    const handleGroupChat = (userToAdd)=>{
        if(selectedUsers.includes(userToAdd)){
            toast({
                title:"User is already added",
                status:"warning",
                duration:5000,
                isClosable: true,
                position:"top",
            })
            return
        }
        setSelectedUsers([...selectedUsers, userToAdd])
    }

    const handleDelete = (deleteUser) =>{
        setSelectedUsers(selectedUsers.filter((selected)=> selected._id !== deleteUser._id))
    }

    return (
        <>
          <span onClick={onOpen}>{children}</span>
    
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader fontSize="35p" fontFamily="Work Sans" display="flex" justifyContent="center">Create Group Chat</ModalHeader>
              <ModalCloseButton />
              <ModalBody display="flex" flexDirection="column" alignItems="center">
                <FormControl>
                    <Input placeholder='Chat Name' marginBottom={3} onChange={(e) => setgroupChatName(e.target.value)}/>
                </FormControl>
                <FormControl>
                    <Input placeholder='Select Name' marginBottom={1} onChange={(e) => handleSearch(e.target.value)}/>
                </FormControl>
                <Box width="100%" display="flex" flexWrap="wrap"> 
                {selectedUsers.map(u=>(
                    <UserBadgeItem key={user._id} user={u} handleFunction={()=>handleDelete(u)} />
                ))}</Box>
                {loading?<div>loading</div>:(
                    searchResult?.slice(0,4).map(user =>(<UserListItem key={users._id} user={user} handleFunction={() => handleGroupChat(user)}/>))
                )}
              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='blue' onClick={handleSubmit}>
                  Create Group
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
    }

export default GroupChatModal