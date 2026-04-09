import {
  Box, Container, Text, VStack, HStack, Badge, Button,
  Flex, Divider, Alert, AlertIcon, useToast, Skeleton
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { getAppointments, cancelAppointment } from '../services/api'

const statusScheme = {
  confirmed: 'green',
  cancelled: 'red',
  pending:   'yellow',
  completed: 'blue'
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading]           = useState(true)
  const toast                           = useToast()

  useEffect(() => { fetchAppointments() }, [])

  async function fetchAppointments() {
    try {
      const res = await getAppointments()
      setAppointments(res.data)
    } catch {
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel(id) {
    try {
      await cancelAppointment(id)
      setAppointments(appointments.map(a =>
        a.id === id ? { ...a, status: 'cancelled' } : a
      ))
      toast({
        title: 'Appointment cancelled',
        status: 'info',
        duration: 3000,
        position: 'top'
      })
    } catch {
      toast({ title: 'Could not cancel', status: 'error', duration: 3000, position: 'top' })
    }
  }

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)" py={8}>
      <Container maxW="800px" px={6}>
        <Text fontSize="1.6rem" fontWeight={800} mb={6}>My Appointments</Text>

        {loading ? (
          <VStack spacing={4}>
            {[...Array(3)].map((_, i) => <Skeleton key={i} height="100px" borderRadius="xl" w="full" />)}
          </VStack>
        ) : appointments.length === 0 ? (
          <Box bg="white" borderRadius="xl" p={12} textAlign="center" boxShadow="sm">
            <Text fontSize="3rem" mb={3}>📅</Text>
            <Text color="gray.500" fontSize="1.1rem">No appointments yet.</Text>
            <Button colorScheme="blue" mt={5} onClick={() => window.location.href = '/search'}>
              Find a Provider
            </Button>
          </Box>
        ) : (
          <VStack spacing={4} align="stretch">
            {appointments.map(a => (
              <Box key={a.id} bg="white" borderRadius="xl" p={5} boxShadow="sm"
                border="1px solid" borderColor="gray.100">
                <Flex justify="space-between" align="flex-start" flexWrap="wrap" gap={3}>
                  <VStack align="start" spacing={1}>
                    <Text fontWeight={700} fontSize="1.05rem">
                      {a.provider_name || 'Healthcare Provider'}
                    </Text>
                    <Text fontSize="0.9rem" color="gray.500">
                      🕐 {new Date(a.slot_start_time).toLocaleString('en-US', {
                        weekday: 'short', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </Text>
                    {a.notes && (
                      <Text fontSize="0.85rem" color="gray.400">📝 {a.notes}</Text>
                    )}
                  </VStack>
                  <HStack spacing={3}>
                    <Badge
                      colorScheme={statusScheme[a.status] || 'gray'}
                      borderRadius="full" px={3} py={1} fontSize="0.8rem"
                    >
                      {a.status}
                    </Badge>
                    {a.status === 'confirmed' && (
                      <Button size="sm" colorScheme="red" variant="outline"
                        borderRadius="lg" onClick={() => handleCancel(a.id)}>
                        Cancel
                      </Button>
                    )}
                  </HStack>
                </Flex>
              </Box>
            ))}
          </VStack>
        )}
      </Container>
    </Box>
  )
}