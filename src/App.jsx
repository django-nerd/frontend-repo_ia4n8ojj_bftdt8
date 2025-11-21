import Header from './components/Header'
import BookingForm from './components/BookingForm'
import LiveStatus from './components/LiveStatus'
import LiveMap from './components/LiveMap'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(16,185,129,0.15),transparent_35%),_radial-gradient(circle_at_80%_110%,rgba(59,130,246,0.15),transparent_35%)] pointer-events-none" />

      <Header />

      <main className="max-w-6xl mx-auto px-4 pb-16">
        <section className="grid lg:grid-cols-2 gap-6">
          <BookingForm />
          <LiveStatus />
        </section>

        <section className="mt-8">
          <LiveMap />
        </section>

        <section className="mt-10 text-center text-emerald-200/80">
          <p>
            Locate, book, and ride electric autonomous shuttles between Tesano, Abokobi, and Main Campus.
          </p>
        </section>
      </main>
    </div>
  )
}

export default App
