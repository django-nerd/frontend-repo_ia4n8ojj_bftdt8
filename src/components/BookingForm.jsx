import { useState, useEffect } from 'react'

export default function BookingForm() {
  const [campus, setCampus] = useState('Tesano')
  const [stops, setStops] = useState([])
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [time, setTime] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const fetchStops = async () => {
      try {
        const res = await fetch(`${backend}/stops?campus=${campus}`)
        const data = await res.json()
        setStops(data)
        if (data.length) {
          setPickup(data[0].code)
          setDropoff(data.length > 1 ? data[1].code : data[0].code)
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchStops()
  }, [campus])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      const scheduled_time = time ? new Date(time).toISOString() : null
      const res = await fetch(`${backend}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, campus, pickup_code: pickup, dropoff_code: dropoff, scheduled_time })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Error' }))
        throw new Error(err.detail || 'Booking failed')
      }
      const data = await res.json()
      setStatus({ ok: true, message: `Booking confirmed. ETA ~ ${data.eta_minutes} minutes` })
    } catch (e) {
      setStatus({ ok: false, message: e.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800/50 border border-emerald-400/20 rounded-2xl p-6 backdrop-blur-sm">
      <h3 className="text-xl font-semibold text-white mb-4">Book a Shuttle</h3>
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-emerald-200 mb-1">Campus</label>
          <select value={campus} onChange={e => setCampus(e.target.value)} className="w-full bg-slate-900/60 text-white border border-slate-700 rounded px-3 py-2">
            <option>Tesano</option>
            <option>Abokobi</option>
            <option>Main Campus</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-emerald-200 mb-1">Pickup Stop</label>
          <select value={pickup} onChange={e => setPickup(e.target.value)} className="w-full bg-slate-900/60 text-white border border-slate-700 rounded px-3 py-2">
            {stops.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-emerald-200 mb-1">Drop-off Stop</label>
          <select value={dropoff} onChange={e => setDropoff(e.target.value)} className="w-full bg-slate-900/60 text-white border border-slate-700 rounded px-3 py-2">
            {stops.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-emerald-200 mb-1">Your Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-900/60 text-white border border-slate-700 rounded px-3 py-2" placeholder="e.g., Ama Mensah" />
        </div>
        <div>
          <label className="block text-sm text-emerald-200 mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-900/60 text-white border border-slate-700 rounded px-3 py-2" placeholder="e.g., ama@gctu.edu.gh" />
        </div>
        <div>
          <label className="block text-sm text-emerald-200 mb-1">Schedule (optional)</label>
          <input type="datetime-local" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-slate-900/60 text-white border border-slate-700 rounded px-3 py-2" />
        </div>
        <div className="sm:col-span-2 flex gap-3">
          <button disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-semibold px-4 py-2 rounded">
            {loading ? 'Booking…' : 'Book Ride'}
          </button>
          {status && (
            <div className={`text-sm px-3 py-2 rounded border ${status.ok ? 'border-emerald-400 text-emerald-300' : 'border-red-400 text-red-300'}`}>
              {status.message}
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
