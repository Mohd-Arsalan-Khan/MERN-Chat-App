import { ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Image, Text,  Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({user, children}) => {
    const {isOpen, onOpen, onClose } = useDisclosure()
   
  return (
    <>
    {children ? (<span onClick={onOpen}>{children}</span> ): (<IconButton
        display={{base: "flex"}}
        icon={<ViewIcon/>}
        onClick={onOpen}
    />)}
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent height="400px">
          <ModalHeader fontSize="40px" fontFamily="Work sans" display="flex" justifyContent="center">{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center" justifyContent="space-between">
            <Image
            borderRadius="full"
            boxSize="150px"
            src={user.picture}
            alt={user.name}
            />
            <Text
                fontSize={{base:"28px", md:"30px"}}
                fontFamily="Work sans"
            >
                Email:{user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModal