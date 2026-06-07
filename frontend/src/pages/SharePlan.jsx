import React, {useState} from 'react'
import {assets} from '../assets/assets.js'

const SharePlan = () => {
  const [email, setEmail] = useState('')

  const handleShare = (e) => {
    e.preventDefault()
    alert(`Invitation sent to ${email}`)
    setEmail('')
  }

  return (
    <section className="py-10 sm:py-14 lg:py-20">
      <h1 className="text-4xl font-black mb-8">Share Your Plan</h1>

      <div className="grid gap-12 lg:grid-cols-2 items-start">
        <div>
          <div className="rounded-4xl border border-black p-8 max-w-md">
            <h2 className="text-2xl font-bold mb-6">Send Invitation</h2>
            <form onSubmit={handleShare} className="space-y-6">
              <input
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-2xl bg-[#ffd6b8] px-4 py-4 outline-none"
                type="email"
                required
              />

              <div className="text-center">
                <button type="submit" className="inline-block rounded-full bg-linear-to-r from-rose-500 to-amber-400 px-10 py-3 text-white font-semibold">Share</button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="rounded-4xl border border-black p-6 w-[320px] h-140">
            <div className="h-14 w-full rounded-md bg-rose-400 mb-4 flex items-center px-4">
              <img src={assets.image2} alt="logo" className="h-8 w-8 rounded mr-2" />
              <span className="font-bold text-white">DAYate</span>
            </div>

            <div className="space-y-4 mt-4">
              <p className="text-sm italic text-slate-700">"user" has planned a day for you</p>

              <div className="space-y-3 mt-4">
                <div className="rounded-2xl bg-[#ffd6b8] px-4 py-3">1. Pick up from (add)</div>
                <div className="rounded-2xl bg-[#ffd6b8] px-4 py-3">2. Morning sun cafe</div>
                <div className="rounded-2xl bg-[#ffd6b8] px-4 py-3">3. Booslin Hair Care</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SharePlan
