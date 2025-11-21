export default function Header() {
  return (
    <header className="py-8">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shadow-inner">
            <span className="text-emerald-400 font-bold">EV</span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">SmartRide</h1>
            <p className="text-xs text-emerald-200/70">GCTU Smart Campus Shuttle</p>
          </div>
        </div>
        <div className="text-emerald-200/80 text-sm">Safe • Electric • Autonomous</div>
      </div>
    </header>
  )
}
