import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function HomePage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  function handleSearch(e) {
    e.preventDefault()
    navigate(`/search?q=${query}`)
  }

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: '#2563eb',
        color: 'white',
        padding:'4rem 1.5rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem' }}>
          Your Health, On Your Schedule
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '2.5rem' }}>
          Search doctors, hospitals, and labs — book instantly, no phone calls needed.
        </p>

        <form onSubmit={handleSearch} style={{
          display: 'flex',
          maxWidth: '560px',
          margin: '0 auto',
          gap: '0.5rem'
        }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, specialty, location..."
            style={{
              flex: 1,
              padding: '0.85rem 1.2rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ background: '#1e40af' }}>
            Search
          </button>
        </form>
      </div>

      {/* Specialties */}
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.6rem' }}>
          Browse by Specialty
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          {[
            { label: 'Cardiology', emoji: '❤️' },
            { label: 'Dermatology', emoji: '🧴' },
            { label: 'Neurology', emoji: '🧠' },
            { label: 'Pediatrics', emoji: '👶' },
            { label: 'Orthopedics', emoji: '🦴' },
            { label: 'General', emoji: '🏥' },
          ].map(s => (
            <div
              key={s.label}
              className="card"
              onClick={() => navigate(`/search?q=${s.label}`)}
              style={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{s.emoji}</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: '#1e40af', color: 'white', padding: '3rem 1.5rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '4rem',
          flexWrap: 'wrap',
          textAlign: 'center'
        }}>
          {[
            { value: '500+', label: 'Doctors' },
            { value: '120+', label: 'Hospitals' },
            { value: '50+', label: 'Labs' },
            { value: '10K+', label: 'Appointments Booked' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800 }}>{s.value}</div>
              <div style={{ opacity: 0.8, marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}