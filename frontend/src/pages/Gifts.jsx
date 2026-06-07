import React from 'react'
import {assets} from '../assets/assets.js'

const gifts = [
  { id: 1, title: 'Flowers', img: assets.image1 },
  { id: 2, title: 'Dessert', img: assets.image2 },
  { id: 3, title: 'Gifts', img: assets.image1 },
  { id: 4, title: 'Food Hampers', img: assets.image2 },
]

const Gifts = () => {
  return (
    <section className="py-10 sm:py-14 lg:py-20">
      <h1 className="text-4xl font-black mb-8">Order Gifts</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {gifts.map(g => (
          <article key={g.id} className="rounded-3xl bg-rose-50 p-4 text-center shadow-md">
            <div className="rounded-2xl overflow-hidden bg-rose-100 p-3">
              <img src={g.img} alt={g.title} className="h-40 w-full object-cover rounded-lg" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{g.title}</h3>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Gifts
