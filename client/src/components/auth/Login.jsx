import { VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, Button, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
      const [show, setShow] = useState(false)
      const [email, setEmail] = useState("")
      const [password, setPassword] = useState("")
      const [loading, setLoading] = useState()
      const toast = useToast()
      const navigate = useNavigate()
  
      const handleClick = () => setShow(!show)
  
      const handleSubmit = async() => {
        setLoading(true)
        if (!email || !password) {
          toast({
            title: "Enter all the field",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom"
        })
        setLoading(false)
        return;
        }

        try {
          const {data} = await axios.post("/api/v1/user/login",
          {email, password},
          {headers : {"Content-Type": "Application/json"}})
          toast({
            title: "Login Successful",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom"
           })
           localStorage.removeItem("chats");
           localStorage.removeItem("messages");
           localStorage.removeItem("userInfo");
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
          <FormControl id='login email' isRequired>
              <FormLabel>Email</FormLabel>
              <Input type='email' placeholder='Enter Your Email'
              value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
          </FormControl>
          <FormControl id='login password' isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup> 
              <Input type={show ? "text" : "password"} placeholder='Enter Your Password'
              value={password}
                  onChange={(e) => setPassword(e.target.value)}/>
              
              <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "hide" : "show"}
              </Button>
              </InputRightElement>
              </InputGroup>
          </FormControl>
          <Button
          colorScheme='blue'
          width='100%'
          style={{marginTop: 15}}
          onClick={handleSubmit}
          isLoading={loading}
          >Login</Button>

          <Button variant='solid' colorScheme='red' width='100%' onClick={() =>{ 
            setEmail('guest@example.com');
            setPassword('12345678')
          }}>
            Login as a guest user
          </Button>
      </VStack>
    )
}

export default Login