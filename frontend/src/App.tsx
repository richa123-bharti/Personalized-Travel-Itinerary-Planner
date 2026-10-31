import { useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type TripDay = {
  day: number
  title: string
  activities: Array<{ time: string; title: string; category: string }>
}

type ItineraryResponse = {
  country: string
  itinerary: TripDay[]
}

type IconName = 'grid' | 'plane' | 'map' | 'wallet' | 'spark' | 'calendar' | 'pin' | 'users' | 'clock' | 'menu' | 'chevron'

const icons: Record<IconName, string> = {
  grid: '▦', plane: '✈', map: '⌖', wallet: '◫', spark: '✦', calendar: '▣',
  pin: '⌖', users: '♙', clock: '◷', menu: '☰', chevron: '›',
}

const destinations: Record<string, { country: string; places: string[] }> = {
  Goa: { country: 'India', places: ['Baga Beach', 'Fontainhas', 'Dudhsagar Falls', 'Panjim Market'] },
  Jaipur: { country: 'India', places: ['Amber Fort', 'City Palace', 'Hawa Mahal', 'Johari Bazaar'] },
  Paris: { country: 'France', places: ['Eiffel Tower', 'Louvre Museum', 'Montmartre', 'Seine River'] },
  Bali: { country: 'Indonesia', places: ['Uluwatu Temple', 'Ubud Monkey Forest', 'Nusa Dua', 'Tegallalang Rice Terrace'] },
}

function Icon({ name }: { name: IconName }) {
  return <span className="icon" aria-hidden="true">{icons[name]}</span>
}

function App() {
  const [destination, setDestination] = useState('Goa')
  const [days, setDays] = useState(3)
  const [budget, setBudget] = useState('Mid-range')
  const [style, setStyle] = useState('Balanced')
  const [interests, setInterests] = useState(['Food', 'Sightseeing'])
  const [generated, setGenerated] = useState(false)
  const [activeDay, setActiveDay] = useState(1)
  const [itinerary, setItinerary] = useState<TripDay[]>([])
  const [country, setCountry] = useState(destinations.Goa.country)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')


  const toggleInterest = (interest: string) => {
    setInterests(current => current.includes(interest)
      ? current.filter(item => item !== interest)
      : [...current, interest])
  }

  const generateTrip = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setApiError('')
    setActiveDay(1)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://roamio-travel-api.onrender.com'
      const response = await fetch(`${apiUrl}/api/itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, days, budget, style, interests }),
      })
      if (!response.ok) throw new Error('Unable to generate itinerary')
      const data: ItineraryResponse = await response.json()
      setItinerary(data.itinerary)
      setCountry(data.country)
      setGenerated(true)
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Unable to connect to backend')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Icon name="plane" /></div><span>Roamio</span></div>
        <nav>
          <button><Icon name="grid" />Overview</button>
          <button className="active"><Icon name="map" />My trips</button>
          <button><Icon name="calendar" />Planner</button>
          <button><Icon name="wallet" />Budget</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card"><span><Icon name="spark" /></span><b>Unlock AI trips</b><small>Upgrade your plan</small><button>Upgrade</button></div>
          <div className="profile"><div className="avatar">RB</div><div><b>Richa</b><small>Explorer</small></div></div>
        </div>
      </aside>

      <main>
        <header>
          <div><p className="eyebrow">Workspace / My trips</p><h1>Plan your perfect escape</h1></div>
          <button className="new-trip"><span>＋</span> New trip</button>
        </header>

        <div className="content-grid">
          <section className="planner">
            <div className="section-heading"><div><span className="step">1</span><div><h2>Trip preferences</h2><p>Tell us what you love, we’ll handle the rest.</p></div></div></div>
            <form onSubmit={generateTrip}>
              <label>Destination<div className="field"><Icon name="pin" /><input value={destination} onChange={e => setDestination(e.target.value)} /></div></label>
              <div className="split-fields">
                <label>Trip length<div className="field"><Icon name="calendar" /><input type="number" min="1" max="7" value={days} onChange={e => setDays(Number(e.target.value))} /><span>{days === 1 ? 'day' : 'days'}</span></div></label>
                <label>Budget<div className="field"><Icon name="wallet" /><select value={budget} onChange={e => setBudget(e.target.value)}><option>Budget</option><option>Mid-range</option><option>Premium</option></select></div></label>
              </div>
              <label>Travel style<div className="segmented">{['Relaxed', 'Balanced', 'Packed'].map(item => <button type="button" key={item} className={style === item ? 'selected' : ''} onClick={() => setStyle(item)}>{item}</button>)}</div></label>
              <label>Interests<div className="chips">{['Food', 'Sightseeing', 'Adventure', 'Culture', 'Nature', 'Shopping'].map(item => <button type="button" key={item} className={interests.includes(item) ? 'selected' : ''} onClick={() => toggleInterest(item)}>{item}</button>)}</div></label>
              <button className="generate" type="submit" disabled={loading}><Icon name="spark" /> {loading ? 'Generating...' : 'Generate my itinerary'}</button>
              {apiError && <p className="api-error">{apiError}. Start the FastAPI server on port 8000.</p>}
            </form>
          </section>

          {generated && <section className="itinerary">
            <div className="trip-hero">
              <div><span className="status">AI GENERATED</span><h2>{destination || 'Your destination'}, {country}</h2><p>{days} days · {budget} · {style}</p></div>
              <button aria-label="More options">•••</button>
            </div>
            <div className="day-tabs">{itinerary.map(day => <button key={day.day} className={activeDay === day.day ? 'active' : ''} onClick={() => setActiveDay(day.day)}>Day {day.day}<small>{day.day === 1 ? 'Arrival' : day.day === 2 ? 'Explore' : 'Discover'}</small></button>)}</div>
            <div className="day-detail">
              <div className="day-title"><div><span>DAY {activeDay}</span><h3>{itinerary[activeDay - 1].title}</h3></div><button><span>＋</span> Add activity</button></div>
              {itinerary[activeDay - 1].activities.map((item, index) => (
                <div className="timeline-item" key={item.title}>
                  <div className="time">{item.time}<span /></div>
                  <div className={`activity art-${index}`}><div className="activity-image">{index === 0 ? '◉' : index === 1 ? '🍽️' : '✦'}</div><div><small>{item.category.toUpperCase()}</small><h4>{item.title}</h4><p>{item.category === 'Dining' ? `Try a highly-rated local restaurant during your ${style.toLowerCase()} trip.` : `Explore ${item.title} and enjoy the local experience.`}</p><div className="meta"><span><Icon name="clock" /> 2 hrs</span><span><Icon name="pin" /> {country}</span></div></div></div>
                </div>
              ))}
            </div>
          </section>}
        </div>
      </main>
    </div>
  )
}

export default App
