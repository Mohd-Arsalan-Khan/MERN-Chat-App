import { FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, Button, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SignUp() {
    const [show, setShow] = useState(false)
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [picture, setPicture] = useState()
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const navigate = useNavigate()

    const handleClick = () => setShow(!show)

    const postDetails = (pictures) =>{
        setLoading(true)
        if (pictures === undefined) {
            toast({
                title: "Please select an Image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return;
        }

        if (pictures.type === "image/jpeg" || pictures.type === "image/png") {
            const data = new FormData();
            data.append("file", pictures);
            data.append("upload_preset", "MERN-CHAT");
            data.append("cloud_name", "arsalan787khan");
            
            fetch("https://api.cloudinary.com/v1_1/arsalan787khan/image/upload",{
                method: 'POST',
                body: data
            }).then((res) => res.json())
            .then(data => {
                setPicture(data.url.toString());
                setLoading(false)
            })
            .catch((err) =>{
                console.log(err)
                setLoading(false)
            })
        }
        else{
            toast({
                title: "Please select an Image",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
            return
        }
    }

    const handleSubmit = async() => {
        setLoading(true)
        if (!name || !email || !password || !confirmPassword) {
            toast({
                title: "Please filled all the details",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setLoading(false)
            return
        }
        if (password !== confirmPassword) {
            toast({
                title: "Password not matched",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            return  
        }

        try {
           const {data} = await axios.post("/api/v1/user",
            {name, email, password, picture},
            {headers : {"Content-Type": "Application/json"}})

           toast({
            title: "Registration Successful",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom"
           })
           localStorage.clear();  
           localStorage.setItem("userInfo", JSON.stringify(data))
           setLoading(false)
           navigate("/chats")
        } catch (error) {
            toast({
                title: "Error Occured",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
               })
               setLoading(false)
        }
    }

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
        isLoading={loading}
        >Sign Up</Button>
    </VStack>
  )
}

export default SignUp