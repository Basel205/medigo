import {
  Box, VStack, Text, Input, Button, Select, Alert, AlertIcon,
  Tabs, TabList, Tab, TabPanels, TabPanel, FormControl, FormLabel,
  Container, Divider, HStack, Code
} from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../services/api'
import { useAuth } from '../services/AuthContext'

export default function AuthPage() {
  const [loginForm, setLoginForm]     = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', full_name: '', user_type: 'patient' })
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await loginUser({ username: loginForm.email, password: loginForm.password })
      const token = res.data.access_token
      const payload = JSON.parse(atob(token.split('.')[1]))
      login({ email: payload.sub, full_name: payload.full_name, user_type: payload.user_type }, token)
      navigate('/search')
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await registerUser(registerForm)
      setSuccess('Account created! Please log in.')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box minH="calc(100vh - 64px)" bg="gray.50" py={12} px={4}>
      <Container maxW="440px">
        <Box bg="white" borderRadius="2xl" boxShadow="lg" overflow="hidden">
          <Box bg="blue.500" px={8} py={6} color="white">
            <Text fontSize="1.5rem" fontWeight={800}>Welcome to MediGo</Text>
            <Text opacity={0.85} fontSize="0.95rem" mt={1}>Your healthcare booking platform</Text>
          </Box>

          <Box px={8} py={6}>
            {error   && <Alert status="error"   borderRadius="lg" mb={4}><AlertIcon />{error}</Alert>}
            {success && <Alert status="success" borderRadius="lg" mb={4}><AlertIcon />{success}</Alert>}

            <Tabs colorScheme="blue" onChange={() => { setError(''); setSuccess('') }}>
              <TabList mb={6}>
                <Tab fontWeight={600}>Login</Tab>
                <Tab fontWeight={600}>Register</Tab>
              </TabList>

              <TabPanels>
                {/* Login */}
                <TabPanel p={0}>
                  <VStack as="form" onSubmit={handleLogin} spacing={4}>
                    <FormControl>
                      <FormLabel fontSize="0.9rem" color="gray.600">Email</FormLabel>
                      <Input type="email" value={loginForm.email} placeholder="you@example.com"
                        onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} required />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="0.9rem" color="gray.600">Password</FormLabel>
                      <Input type="password" value={loginForm.password} placeholder="••••••••"
                        onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} required />
                    </FormControl>
                    <Button type="submit" colorScheme="blue" w="full" size="lg"
                      borderRadius="lg" isLoading={loading}>
                      Login
                    </Button>
                  </VStack>
                </TabPanel>

                {/* Register */}
                <TabPanel p={0}>
                  <VStack as="form" onSubmit={handleRegister} spacing={4}>
                    <FormControl>
                      <FormLabel fontSize="0.9rem" color="gray.600">Full Name</FormLabel>
                      <Input value={registerForm.full_name} placeholder="John Doe"
                        onChange={e => setRegisterForm({ ...registerForm, full_name: e.target.value })} required />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="0.9rem" color="gray.600">Email</FormLabel>
                      <Input type="email" value={registerForm.email} placeholder="you@example.com"
                        onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })} required />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="0.9rem" color="gray.600">Password</FormLabel>
                      <Input type="password" value={registerForm.password} placeholder="••••••••"
                        onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })} required />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="0.9rem" color="gray.600">I am a</FormLabel>
                      <Select value={registerForm.user_type}
                        onChange={e => setRegisterForm({ ...registerForm, user_type: e.target.value })}>
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                      </Select>
                    </FormControl>
                    <Button type="submit" colorScheme="blue" w="full" size="lg"
                      borderRadius="lg" isLoading={loading}>
                      Create Account
                    </Button>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>

            <Divider my={5} />
            <Box bg="blue.50" borderRadius="lg" p={4} fontSize="0.85rem" color="blue.700">
              <Text fontWeight={700} mb={1}>Demo credentials</Text>
              <Text>Email: <Code fontSize="0.85rem">admin@medigo.com</Code></Text>
              <Text>Password: <Code fontSize="0.85rem">admin123</Code></Text>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}