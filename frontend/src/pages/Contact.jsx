const Contact = () => {
  return (
    <section className="py-10 sm:py-14 lg:py-20">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/20">
          <p className="text-sm uppercase tracking-[0.25em] text-rose-200">Contact</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight">Need help building your date plan?</h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Reach out if you want help with routes, ideas, or anything in the planning flow.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white bg-white/90 p-8 shadow-xl shadow-rose-100">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-500">Say hello</p>
          <p className="mt-4 text-slate-700">Email: support@dayate.com</p>
          <p className="mt-2 text-slate-700">Instagram: @dayate</p>
        </div>
      </div>
    </section>
  )
}

export default Contact