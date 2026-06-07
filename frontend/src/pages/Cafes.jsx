import React from 'react'
import { Link } from 'react-router-dom'
import {assets} from '../assets/assets.js'

const cafes = [
  { id: 1, name: 'Moonbeam Café', img: assets.image1, open: '7:00 AM', close: '9:00 PM', rating: '5.0/5 (248 reviews)' },
  { id: 2, name: 'Velvet Bean House', img: assets.image2, open: '7:00 AM', close: '9:00 PM', rating: '5.0/5 (248 reviews)' },
  { id: 3, name: 'Cedar Cup Café', img: assets.image1, open: '7:00 AM', close: '9:00 PM', rating: '5.0/5 (248 reviews)' },
  { id: 4, name: 'Sunrise Brew Café', img: assets.image2, open: '7:00 AM', close: '9:00 PM', rating: '5.0/5 (248 reviews)' },
]

const Cafes = () => {
  return (
    <section className="py-10 sm:py-14 lg:py-20">
      <h1 className="text-4xl font-black mb-8">Cafes</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cafes.map(c => (
          <Link
            key={c.id}
            to={`/cafes/${c.id}`}
            state={{ cafe: c }}
            className="rounded-3xl bg-rose-50 p-4 text-center shadow-md transition hover:-translate-y-1 hover:bg-rose-100"
          >
            <div className="rounded-2xl overflow-hidden bg-rose-100 p-3">
              <img src={c.img} alt={c.name} className="h-40 w-full object-cover rounded-lg" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{c.name}</h3>
            <p className="mt-2 text-sm">⏰ Open: {c.open}</p>
            <p className="text-sm">⏰ Close: {c.close}</p>
            <p className="mt-2 text-sm">⭐ {c.rating}</p>
            <p className="mt-4 text-sm font-semibold text-rose-500">
              Choose time →
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Cafes
