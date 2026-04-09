import {
  Box, Container, Text, Button, VStack, HStack, Badge,
  Textarea, Alert, AlertIcon, Flex, SimpleGrid, Divider,
  Skeleton, useToast
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProvider, getSlots, bookAppointment } from '../services/api'

export default function BookingPage() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const toast       = useToast()

  const [provider, setProvider]       = useState(null)
  const [slots, setSlots]             = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [notes, setNotes]             = useState('')
  const [loading, setLoading]         = useState(true)
  const [booking, setBooking]         = useState(false)
  const [error, setError]             = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [pRes, sRes] = await Promise.all([getProvider(id), getSlots(id)])
        setProvider(pRes.data)
        setSlots(sRes.data.filter(s => s.is_available))
      } catch {
        setError('Failed to load provider details.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  async function handleBook() {
    if (!selectedSlot) return
    setBooking(true); setError('')
    try {
      await bookAppointment({ slot_id: selectedSlot, notes })
      toast({
        title: 'Appointment confirmed!',
        description: `Booked with ${provider?.name}`,
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'top'
      })
      navigate('/appointments')
    } catch (err) {
      setError(err.response?.data?.detail || 'Booking failed. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  const slotsByDate = slots.reduce((acc, slot) => {
    const date = slot.start_time.split('T')[0]
    if (!acc[date]) acc[date] = []
    acc[date].push(slot)
    return acc
  }, {})

  if (loading) return (
    <Container maxW="800px" py={10}>
      <Skeleton height="120px" borderRadius="xl" mb={4} />
      <Skeleton height="300px" borderRadius="xl" />
    </Container>
  )

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)" py={8}>
      <Container maxW="800px" px={6}>
        <Button variant="ghost" colorScheme="blue" mb={5} onClick={() => navigate(-1)}>
          ← Back to results
        </Button>

        {/* Provider card */}
        {provider && (
          <Box bg="white" borderRadius="xl" p={6} boxShadow="sm"
            border="1px solid" borderColor="gray.100" mb={6}>
            <Flex justify="space-between" align="flex-start">
              <VStack align="start" spacing={1}>
                <Text fontSize="1.4rem" fontWeight={800}>{provider.name}</Text>
                <Text color="gray.500">🏥 {provider.specialty}</Text>
                <Text color="gray.500">📍 {provider.location}</Text>
              </VStack>
              <VStack align="end" spacing={2}>
                {provider.rating && (
                  <Text color="yellow.500" fontWeight={700} fontSize="1.1rem">
                    ⭐ {provider.rating.toFixed(1)}
                  </Text>
                )}
                <Badge colorScheme="blue" borderRadius="full" px={3}>{provider.provider_type}</Badge>
              </VStack>
            </Flex>
          </Box>
        )}

        {/* Slots */}
        <Box bg="white" borderRadius="xl" p={6} boxShadow="sm"
          border="1px solid" borderColor="gray.100" mb={6}>
          <Text fontWeight={700} fontSize="1.1rem" mb={5}>Select an Available Slot</Text>

          {slots.length === 0 ? (
            <Text color="gray.400" textAlign="center" py={8}>No available slots at this time.</Text>
          ) : (
            Object.entries(slotsByDate).map(([date, dateSlots]) => (
              <Box key={date} mb={6}>
                <Text fontWeight={600} color="gray.600" fontSize="0.9rem" mb={3}
                  textTransform="uppercase" letterSpacing="0.05em">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long', month: 'long', day: 'numeric'
                  })}
                </Text>
                <Flex flexWrap="wrap" gap={2}>
                  {dateSlots.map(slot => (
                    <Button
                      key={slot.id}
                      size="sm"
                      borderRadius="lg"
                      variant={selectedSlot === slot.id ? 'solid' : 'outline'}
                      colorScheme="blue"
                      onClick={() => setSelectedSlot(slot.id)}
                    >
                      {new Date(slot.start_time).toLocaleTimeString('en-US', {
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </Button>
                  ))}
                </Flex>
              </Box>
            ))
          )}
        </Box>

        {/* Confirm */}
        {selectedSlot && (
          <Box bg="white" borderRadius="xl" p={6} boxShadow="sm"
            border="1px solid" borderColor="blue.100">
            <Text fontWeight={700} fontSize="1.1rem" mb={4}>Confirm Your Appointment</Text>
            <Textarea
              placeholder="Any notes for the provider? (optional)"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              mb={4}
              resize="vertical"
            />
            {error && <Alert status="error" borderRadius="lg" mb={4}><AlertIcon />{error}</Alert>}
            <Button colorScheme="blue" size="lg" w="full" borderRadius="lg"
              isLoading={booking} onClick={handleBook}>
              Confirm Appointment
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  )
}