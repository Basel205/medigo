import {
  Box, Container, Text, Input, Select, Button, SimpleGrid,
  HStack, VStack, Badge, Flex, InputGroup, InputLeftElement, Skeleton
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getProviders } from '../services/api'

const typeColor = { doctor: 'blue', hospital: 'green', lab: 'orange' }

export default function SearchPage() {
  const [providers, setProviders] = useState([])
  const [loading, setLoading]     = useState(false)
  const [searchParams]            = useSearchParams()
  const navigate                  = useNavigate()

  const [filters, setFilters] = useState({
    search:   searchParams.get('q') || '',
    type:     '',
    location: ''
  })

  useEffect(() => { fetchProviders() }, [])

  async function fetchProviders() {
    setLoading(true)
    try {
      const res = await getProviders({
        search: filters.search,
        provider_type: filters.type,
        location: filters.location
      })
      setProviders(res.data)
    } catch {
      setProviders([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box bg="gray.50" minH="calc(100vh - 64px)">
      {/* Search bar */}
      <Box bg="white" borderBottom="1px solid" borderColor="gray.100" py={6} px={6}>
        <Container maxW="1100px">
          <HStack spacing={3} flexWrap="wrap">
            <InputGroup flex={2} minW="220px">
              <InputLeftElement><SearchIcon color="gray.400" /></InputLeftElement>
              <Input
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                placeholder="Name, specialty..."
                bg="gray.50"
                onKeyDown={e => e.key === 'Enter' && fetchProviders()}
              />
            </InputGroup>
            <Select flex={1} minW="140px" bg="gray.50" value={filters.type}
              onChange={e => setFilters({ ...filters, type: e.target.value })}>
              <option value="">All Types</option>
              <option value="doctor">Doctor</option>
              <option value="hospital">Hospital</option>
              <option value="lab">Lab</option>
            </Select>
            <Input flex={1} minW="140px" bg="gray.50" placeholder="Location..."
              value={filters.location}
              onChange={e => setFilters({ ...filters, location: e.target.value })} />
            <Button colorScheme="blue" onClick={fetchProviders} px={8}>Search</Button>
          </HStack>
        </Container>
      </Box>

      {/* Results */}
      <Container maxW="1100px" py={8} px={6}>
        <Text color="gray.500" fontSize="0.9rem" mb={6}>
          {loading ? 'Searching...' : `${providers.length} provider${providers.length !== 1 ? 's' : ''} found`}
        </Text>

        {loading ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
            {[...Array(6)].map((_, i) => <Skeleton key={i} height="200px" borderRadius="xl" />)}
          </SimpleGrid>
        ) : providers.length === 0 ? (
          <Box textAlign="center" py={20} color="gray.400">
            <Text fontSize="3rem" mb={3}>🔍</Text>
            <Text fontSize="1.1rem">No providers found. Try a different search.</Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
            {providers.map(p => (
              <Box
                key={p.id}
                bg="white"
                borderRadius="xl"
                p={5}
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.100"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ boxShadow: 'md', transform: 'translateY(-2px)', borderColor: 'blue.200' }}
                onClick={() => navigate(`/book/${p.id}`)}
              >
                <Flex justify="space-between" align="flex-start" mb={3}>
                  <Text fontWeight={700} fontSize="1.05rem" flex={1} mr={2}>{p.name}</Text>
                  <Badge colorScheme={typeColor[p.provider_type] || 'gray'}
                    borderRadius="full" px={3} py={0.5} fontSize="0.75rem">
                    {p.provider_type}
                  </Badge>
                </Flex>
                <VStack align="start" spacing={1} mb={4}>
                  <Text fontSize="0.9rem" color="gray.500">🏥 {p.specialty}</Text>
                  <Text fontSize="0.9rem" color="gray.500">📍 {p.location}</Text>
                  {p.rating && (
                    <Text fontSize="0.9rem" color="yellow.600">⭐ {p.rating.toFixed(1)} rating</Text>
                  )}
                </VStack>
                <Button colorScheme="blue" size="sm" w="full" borderRadius="lg" variant="outline">
                  View & Book →
                </Button>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  )
}