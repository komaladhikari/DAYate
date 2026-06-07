import {Link} from 'react-router-dom'

const Activites = () => {
  return (
    <section className="py-10 sm:py-14 lg:py-20">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-500">Activities</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Pick the vibe, then build the night around it.</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Dinner', 'Book a restaurant that matches the mood.', '/cafes'],
            ['Gifts', 'Gift them their favourite thing.', '/gifts'],
            ['Rides', 'Spa, ride, or a calm plan for the evening.', '/book-rides'],
          ].map(([title, text, href]) => (
            <Link key={title} to={href} className="rounded-4xl border border-white bg-white/90 p-6 shadow-lg shadow-rose-100 transition hover:-translate-y-0.5 hover:bg-white">
              <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
              <p className="mt-3 text-slate-600">{text}</p>
              <p className="mt-4 text-sm font-semibold text-rose-500">Start planning →</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Activites