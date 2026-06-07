import React, {useState, useRef, useEffect} from 'react'
import {assets} from '../assets/assets.js'

const Chat = () => {
  const [messages, setMessages] = useState([
    {id:1, sender: 'them', text: 'Thank you for the day!', avatar: null},
    {id:2, sender: 'me', text: 'Add pictures for the calendar', avatar: null},
    {id:3, sender: 'them', image: assets.image1, avatar: null}
  ])
  const [text, setText] = useState('')
  const scrollRef = useRef()

  useEffect(()=>{ if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight }, [messages])

  const send = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setMessages(prev => [...prev, {id: Date.now(), sender: 'me', text}])
    setText('')
  }

  return (
    <section className="py-10 sm:py-14 lg:py-20">
      <h1 className="text-4xl font-black mb-8">Share & Chat</h1>

      <div className="grid gap-8 lg:grid-cols-2 items-start">
        <div className="rounded-4xl border border-black p-6 h-130 overflow-hidden">
          <div ref={scrollRef} className="h-full overflow-auto p-4 space-y-6 bg-white">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`${m.sender === 'me' ? 'bg-[#ffd6b8] text-slate-900' : 'bg-[#ffd6b8] text-slate-900'} max-w-[60%] rounded-2xl p-4`}> 
                  {m.text && <p>{m.text}</p>}
                  {m.image && <img src={m.image} alt="shared" className="mt-3 rounded-lg w-full object-cover"/>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-start gap-6">
          <div className="rounded-4xl border border-black p-6 w-full max-w-md h-80">
            <p className="text-lg font-semibold mb-4">What they will see</p>
            <div className="rounded-2xl bg-[#ffd6b8] p-3">A quick preview of the shared plan and messages.</div>
          </div>

          <form onSubmit={send} className="w-full max-w-md">
            <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message" className="w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none mb-3" />
            <div className="flex gap-3">
              <button type="submit" className="inline-block rounded-full bg-linear-to-r from-rose-500 to-amber-400 px-6 py-3 text-white font-semibold">Send</button>
              <button type="button" onClick={()=>{ setMessages(prev => [...prev, {id:Date.now(), sender:'me', image:assets.image1}]) }} className="inline-block rounded-full border px-5 py-3">Share Image</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Chat
