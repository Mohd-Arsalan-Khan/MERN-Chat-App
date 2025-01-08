import React from 'react'
import {Box, Container, Text, TabList, Tab, TabPanels, TabPanel, Tabs} from '@chakra-ui/react'
import Login from '../components/auth/Login'
import SignUp from '../components/auth/SignUp'

function HomePage() {
  return (
    <Container maxW="xl" centerContent>
      <Box display="flex" justifyContent="center" p={3} bg={"white"} w="100%" m="40px 0 15px 0" borderRadius="lg" borderWidth="1px">
        <Text fontSize="4xl">Let's Talk</Text>      
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs variant='soft-rounded'>
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">SignUp</Tab>
           </TabList>
          <TabPanels>
            <TabPanel>
               <Login/>
            </TabPanel>
            <TabPanel>
               <SignUp/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage