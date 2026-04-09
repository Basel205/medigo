import {
  Box, Flex, Text, Button, HStack, Link as ChakraLink, Avatar, Menu,
  MenuButton, MenuList, MenuItem, useColorModeValue
} from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../services/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <Box
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.100"
      px={6}
      py={3}
      position="sticky"
      top={0}
      zIndex={100}
      boxShadow="sm"
    >
      <Flex maxW="1100px" mx="auto" align="center" justify="space-between">
        <Link to="/">
          <Text fontSize="1.5rem" fontWeight={800} letterSpacing="-0.5px">
            <Text as="span" color="blue.500">Medi</Text>Go
          </Text>
        </Link>

        <HStack spacing={6}>
          <ChakraLink as={Link} to="/search" fontWeight={500} color="gray.600"
            _hover={{ color: 'blue.500' }}>
            Find Providers
          </ChakraLink>

          {user ? (
            <>
              <ChakraLink as={Link} to="/appointments" fontWeight={500} color="gray.600"
                _hover={{ color: 'blue.500' }}>
                My Appointments
              </ChakraLink>
              <Menu>
                <MenuButton>
                  <Avatar size="sm" name={user.full_name} bg="blue.500" color="white" cursor="pointer" />
                </MenuButton>
                <MenuList>
                  <MenuItem isDisabled>{user.full_name || user.email}</MenuItem>
                  <MenuItem onClick={handleLogout} color="red.500">Logout</MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <Button as={Link} to="/auth" colorScheme="blue" size="sm" borderRadius="full" px={5}>
              Login / Register
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  )
}