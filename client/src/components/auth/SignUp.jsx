import { FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, Button } from '@chakra-ui/react'
import React, { useState } from 'react'

function SignUp() {
    const [show, setShow] = useState(false)
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [picture, setPicture] = useState()

    const handleClick = () => setShow(!show)

    const postDetails = (pictures) =>{}

    const handleSubmit = () => {}

  return (
    <VStack spacing='5px'>
        <FormControl id='name' isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder='Enter Your Name'
                onChange={(e) => setName(e.target.value)}
            />
        </FormControl>
        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input type='email' placeholder='Enter Your Email'
                onChange={(e) => setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup> 
            <Input type={show ? "text" : "password"} placeholder='Enter Your Password'
                onChange={(e) => setPassword(e.target.value)}/>
            
            <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "hide" : "show"}
            </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id='confirm-password' isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup size='md'> 
            <Input type={show ? "text" : "password"} placeholder='Confirm password'
                onChange={(e) => setConfirmPassword(e.target.value)}/>
            
            <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "hide" : "show"}
            </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id='picture'>
            <FormLabel>Upload your picture</FormLabel>
            <Input
            type='file'
            p={1.5}
            accept='image/*'
            onChange={(e) => postDetails(e.target.files[0])}
            />
        </FormControl>
        <Button
        colorScheme='blue'
        width='100%'
        style={{marginTop: 15}}
        onClick={handleSubmit}
        >Sign Up</Button>
    </VStack>
  )
}

export default SignUp