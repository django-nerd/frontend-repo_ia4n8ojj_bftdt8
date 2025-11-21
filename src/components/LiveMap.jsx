import { useEffect, useState, useRef } from 'react'

const deg2rad = (deg) => (deg * Math.PI) / 180
const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function LiveMap() {
  const [campus, setCampus] = useState('Tesano')
  const [stops, setStops] = useState([])
  const [shuttles, setShuttles] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const backend = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const timer = useRef(null)

  useEffect(() => {
    const fetchAll = async () => {
      const [stopsRes, shRes] = await Promise.all([
        fetch(`${backend}/stops?campus=${campus}`),
        fetch(`${backend}/shuttles?campus=${campus}`)
      ])
      const stopsData = await stopsRes.json()
      const shData = await shRes.json()
      setStops(stopsData)
      setShuttles(shData)
      setLastUpdated(new Date().toLocaleTimeString())
    }
    fetchAll()
  }, [campus])

  useEffect(() => {
    timer.current = setInterval(async () => {
      try {
        await fetch(`${backend}/simulate/telemetry?campus=${campus}`, { method: 'POST' })
        const res = await fetch(`${backend}/shuttles?campus=${campus}`)
        const data = await res.json()
        setShuttles(data)
        setLastUpdated(new Date().toLocaleTimeString())
      } catch (e) {
        console.error(e)
      }
    }, 10000)
    return () => clearInterval(timer.current)
  }, [campus])

  const extent = (() => {
    const lat = stops.map(s => s.latitude)
    const lon = stops.map(s => s.longitude)
    if (!lat.length || !lon.length) return { minLat: 0, maxLat: 0, minLon: 0, maxLon: 0 }
    return { minLat: Math.min(...lat), maxLat: Math.max(...lat), minLon: Math.min(...lon), maxLon: Math.max(...lon) }
  })()

  const padding = 0.001
  const width = 600
  const height = 360
  const latRange = (extent.maxLat - extent.minLat) || 0.01
  const lonRange = (extent.maxLon - extent.minLon) || 0.01

  const project = (lat, lon) => {
    const x = ((lon - extent.minLon + padding) / (lonRange + padding * 2)) * width
    const y = height - ((lat - extent.minLat + padding) / (latRange + padding * 2)) * height
    return { x, y }
  }

  return (
    <div className="bg-slate-800/50 border border-indigo-400/20 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">Live Map</h3>
        <div className="flex items-center gap-3">
          <select value={campus} onChange={e=>setCampus(e.target.value)} className="bg-slate-900/60 text-white border border-slate-700 rounded px-3 py-1">
            <option>Tesano</option>
            <option>Abokobi</option>
            <option>Main Campus</option>
          </select>
          <span className="text-xs text-indigo-200/70">Updated: {lastUpdated || '—'}</span>
        </div>
      </div>
      <div className="overflow-auto">
        <svg width={width} height={height} className="bg-slate-900/40 rounded-xl border border-slate-700">
          {/* Stops */}
          {stops.map(s => {
            const p = project(s.latitude, s.longitude)
            return (
              <g key={s.code}>
                <circle cx={p.x} cy={p.y} r={6} fill="#22d3ee" opacity={0.9} />
                <text x={p.x + 8} y={p.y - 8} className="fill-white text-xs">{s.name}</text>
              </g>
            )
          })}
          {/* Shuttles */}
          {shuttles.map(sh => {
            if (sh.latitude == null || sh.longitude == null) return null
            const p = project(sh.latitude, sh.longitude)
            return (
              <g key={sh._id}>
                <rect x={p.x - 6} y={p.y - 6} width={12} height={12} rx={3} fill="#10b981" opacity={0.9} />
                <text x={p.x + 8} y={p.y + 4} className="fill-emerald-200 text-xs">{sh.identifier}</text>
              </g>
            )
          })}
        </svg>
      </div>
      {stops.length > 0 && shuttles.length > 0 && (
        <div className="mt-3 text-indigo-200/80 text-sm">
          <p>
            Approx distances between first stop and shuttles: {shuttles.slice(0,3).map((sh, i) => {
              const d = sh.latitude != null ? haversine(stops[0].latitude, stops[0].longitude, sh.latitude, sh.longitude).toFixed(2) : '—'
              return `${i ? ', ' : ''}${sh.identifier}: ${d} km`
            })}
          </p>
        </div>
      )}
    </div>
  )
}
