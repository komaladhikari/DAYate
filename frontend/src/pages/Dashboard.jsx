import {Link} from 'react-router-dom'

const Dashboard = () => {
  return (
    <section className="py-10 sm:py-14 lg:py-20">
      <div className="rounded-4xl bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/20">
        <p className="text-sm uppercase tracking-[0.3em] text-rose-200">Welcome back</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight">You’re logged in successfully.</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
          Choose the next step for your date night: plan a cafe, book a ride, order gifts, or share a plan.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/activities" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">Go to Activities</Link>
          <Link to="/share" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Share Plan</Link>
          <Link to="/chat" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Open Chat</Link>
          <Link to="/my-plans" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            View My Plans
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
            ['Plan', 'Create a new date itinerary'],
            ['Budget', 'Keep track of expenses'],
            ['Share', 'Invite your partner instantly'],
            ].map(([title, text]) => {

            const card = (
                <div
                key={title}
                className="rounded-4xl border border-white bg-white/90 p-6 shadow-lg shadow-rose-100"
                >
                <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                <p className="mt-2 text-slate-600">{text}</p>
                </div>
            )
            return title === 'Plan'
                ? <Link key={title} to="/plan">{card}</Link>
                : card
            })}
        </div>
        </section>
)};

export default Dashboard;
