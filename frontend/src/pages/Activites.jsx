import { Link } from "react-router-dom";

const activities = [
  {
    title: "Dinner Date",
    text: "Explore restaurants that match your mood and moment.",
    href: "/cafes",
    icon: "🍴",
    tags: ["Romantic", "Cozy", "Rooftop"],
    badge: "Recommended",
  },
  {
    title: "Gifts & Surprises",
    text: "Find the perfect gift to make their day extra special.",
    href: "/gifts",
    icon: "🎁",
    tags: ["Thoughtful", "Unique", "Personalized"],
  },
  {
    title: "Rides & Experiences",
    text: "Arrive in style and enjoy a smooth, worry-free journey.",
    href: "/book-rides",
    icon: "🚗",
    tags: ["Comfort", "Premium", "Stress-free"],
    wide: true,
  },
];

const Activites = () => {
  return (
    <section className="min-h-screen bg-[#ffbf8b] px-5 py-12 sm:px-8 lg:px-14">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#ff6b1a]">
          Activities ✦
        </p>

        <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight text-[#070b1f] sm:text-5xl">
          Every great date starts with one{" "}
          <span className="text-[#ff6b1a]">thoughtful choice.</span>
        </h1>

        <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">
          Pick the vibe, then build the night around it.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {activities.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className={`group relative overflow-hidden rounded-[32px] border border-orange-100 bg-white/80 p-8 text-center shadow-[0_18px_50px_rgba(255,152,71,0.12)] transition duration-300 hover:-translate-y-2 hover:border-[#ff7a1a] hover:shadow-[0_25px_70px_rgba(255,122,26,0.22)] ${
                item.wide ? "md:col-span-2" : ""
              }`}
            >
              {item.badge && (
                <div className="absolute left-7 top-7 rounded-xl bg-[#ff6b1a] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
                  ☆ {item.badge}
                </div>
              )}

              {item.badge && (
                <div className="absolute right-8 top-0 h-14 w-8 bg-[#ff6b1a] clip-bookmark" />
              )}

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-[#ff7a1a] bg-white text-4xl transition duration-300 group-hover:scale-110 group-hover:bg-orange-50">
                {item.icon}
              </div>

              <h2 className="mt-8 text-3xl font-black text-[#070b1f]">
                {item.title}
              </h2>

              <div className="mx-auto mt-4 h-0.5 w-16 bg-[#ff7a1a]" />

              <p className="mx-auto mt-7 max-w-md text-lg leading-8 text-slate-600">
                {item.text}
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#fff0e6] px-4 py-2 text-sm font-semibold text-[#c94f13]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mx-auto mt-9 flex max-w-sm items-center justify-center gap-4 rounded-full border-2 border-[#ff6b1a] px-7 py-4 text-lg font-bold text-[#ff6b1a] transition duration-300 group-hover:bg-[#ff6b1a] group-hover:text-white">
                Explore
                <span className="text-2xl transition duration-300 group-hover:translate-x-2">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Activites;
