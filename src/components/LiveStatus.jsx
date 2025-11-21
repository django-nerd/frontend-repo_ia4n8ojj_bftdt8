import { useEffect, useState } from 'react'

export default function LiveStatus() {
  const [shuttles, setShuttles] = useState([])
  const [campus, setCampus] = useState('Tesano')
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${backend}/shuttles?campus=${campus}`)
        const data = await res.json()
        setShuttles(data)
      } catch (e) {
        console.error(e)
      }
    }
    fetchData()
  }, [campus])

  return (
    <div className="bg-slate-800/50 border border-blue-400/20 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">Live Shuttle Status</h3>
        <select value={campus} onChange={e=>setCampus(e.target.value)} className="bg-slate-900/60 text-white border border-slate-700 rounded px-3 py-1">
          <option>Tesano</option>
          <option>Abokobi</option>
          <option>Main Campus</option>
        </select>
      </div>
      {shuttles.length === 0 ? (
        <p className="text-blue-200/80">No shuttles registered yet for this campus.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {shuttles.map(s => (
            <div key={s._id} className="bg-slate-900/40 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{s.identifier}</p>
                  <p className="text-xs text-blue-200/70">{s.status} • Battery {s.battery_level ?? '—'}%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-200/80">Route: {s.route_name || '—'}</p>
                  <p className="text-xs text-blue-200/60">{s.latitude && s.longitude ? `${s.latitude.toFixed?.(4) || s.latitude}, ${s.longitude.toFixed?.(4) || s.longitude}` : 'No GPS'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
