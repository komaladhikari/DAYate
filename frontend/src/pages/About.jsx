import { Link } from "react-router-dom";
import {
  Bot,
  Camera,
  Car,
  ChefHat,
  Gift,
  Heart,
  MessageCircleHeart,
  Sparkles,
} from "lucide-react";
import image4 from "../assets/image4.jpg";

const reasons = [
  { icon: Heart, text: "One place for planning dates" },
  { icon: ChefHat, text: "Restaurants" },
  { icon: Gift, text: "Gifts" },
  { icon: Car, text: "Rides" },
  { icon: Camera, text: "Memories" },
  { icon: MessageCircleHeart, text: "Shared experiences" },
];

const timeline = [
  ["10 tabs open", "One app"],
  ["Searching restaurants", "Smart suggestions"],
  ["Switching apps", "Everything together"],
  ["Forgetting details", "Memories saved"],
];

const features = [
  {
    icon: ChefHat,
    title: "Dining",
    text: "Find restaurants and cafes that match the mood.",
  },
  {
    icon: Car,
    title: "Rides",
    text: "Keep transportation in the same planning flow.",
  },
  {
    icon: Gift,
    title: "Gifts",
    text: "Add flowers, surprises, and thoughtful extras.",
  },
  {
    icon: Camera,
    title: "Memories",
    text: "Hold onto the plans and moments that mattered.",
  },
  {
    icon: MessageCircleHeart,
    title: "Shared Plans",
    text: "Plan together without losing the details.",
  },
  {
    icon: Bot,
    title: "Ideas AI",
    text: "Generate date ideas from mood, budget, and interests.",
  },
];

const About = () => {
  return (
    <main className="overflow-hidden bg-[#F8C29B] text-slate-950">
      <section className="relative flex min-h-[calc(100vh-76px)] items-center justify-center px-4 text-center text-slate-950">
        <img
          src={image4}
          alt="Couple walking together through an open field"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#F8C29B]/55" />
        <div className="absolute inset-0 bg-white/20" />

        <div className="relative mx-auto max-w-4xl animate-[fadeIn_900ms_ease-out]">
          <h1 className="text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
            PLAN LESS.
            <br />
            LOVE MORE.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold leading-8 text-slate-800 sm:text-2xl">
            Creating meaningful moments should not feel complicated.
          </p>
          <Link
            to="/explore-ideas"
            className="mt-8 inline-flex rounded-full bg-[#09122C] px-7 py-3 text-sm font-black text-white shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#09122C]"
          >
            Explore Ideas
          </Link>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#D56B3D]">
              Why DAYate?
            </p>
            <h2 className="mt-3 text-4xl font-black sm:text-5xl">
              What is DAYate?
            </h2>
            <p className="mt-5 text-xl font-semibold leading-8 text-slate-800">
              Because meaningful moments deserve less stress and more thought.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-4 rounded-[24px] bg-white/80 p-5 shadow-md shadow-orange-900/10 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFE0C9] text-[#D56B3D]">
                  <Icon size={22} />
                </span>
                <span className="font-black">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl rounded-[24px] bg-[#FFF7EF] p-5 shadow-xl shadow-orange-900/10 sm:p-8">
          <div className="mb-6 grid gap-4 text-sm font-black uppercase tracking-[0.18em] text-slate-500 sm:grid-cols-2">
            <p>Without DAYate</p>
            <p className="text-[#D56B3D]">With DAYate</p>
          </div>

          <div className="grid gap-4">
            {timeline.map(([before, after]) => (
              <div
                key={before}
                className="grid gap-4 rounded-[24px] bg-white p-4 shadow-sm sm:grid-cols-2 sm:p-5"
              >
                <div className="rounded-2xl bg-[#FFF7EF] px-5 py-4 font-bold text-slate-700">
                  {before}
                </div>
                <div className="rounded-2xl bg-[#E88F5A] px-5 py-4 font-black text-white">
                  {after}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#D56B3D]">
                Everything together
              </p>
              <h2 className="mt-3 text-4xl font-black sm:text-5xl">
                Plan the whole moment
              </h2>
            </div>
            <p className="max-w-md text-lg leading-7 text-slate-700">
              Less bouncing between apps. More space for the part that matters:
              making someone feel seen.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="rounded-[24px] bg-[#FFF7EF] p-6 shadow-md shadow-orange-900/10 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFE0C9] text-[#D56B3D]">
                  <Icon size={27} />
                </span>
                <h3 className="mt-5 text-2xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-slate-700">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#D56B3D]">
              Meet DAYate
            </p>
            <h2 className="mt-3 text-4xl font-black sm:text-5xl">
              Why I Built DAYate
            </h2>
            <p className="mt-6 text-xl leading-9 text-slate-800">
              Sometimes planning something special becomes stressful. DAYate was
              created to simplify the process so people spend less time managing
              tabs and more time making memories.
            </p>
          </div>

          <div className="relative flex justify-center overflow-hidden px-2 py-8 sm:px-8">
            <span
              aria-hidden="true"
              className="absolute right-8 top-0 text-8xl font-black leading-none text-[#E88F5A]/15"
            >
              "
            </span>
            <div className="relative max-w-md">
              <Sparkles className="text-[#D56B3D]" size={30} />
              <p className="mt-5 text-3xl font-black leading-tight text-[#09122C] sm:text-4xl">
                A date is not just a reservation.
              </p>
              <p className="mt-4 text-lg font-semibold leading-8 text-slate-800 sm:text-xl">
                It is a little proof that someone was paying attention.
              </p>
              <div className="mt-6 h-1.5 w-24 rounded-full bg-[#E88F5A]" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl border-t border-[#D56B3D]/30 pt-14">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#D56B3D]">
            Start small. Make it thoughtful.
          </p>
          <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-black leading-tight text-[#09122C] sm:text-6xl">
            Ready to create something memorable?
          </h2>
          <Link
            to="/dashboard"
            className="mt-8 inline-flex rounded-full bg-[#09122C] px-8 py-3.5 text-sm font-black text-white shadow-xl shadow-orange-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#09122C]"
          >
            Start Planning
          </Link>
        </div>
      </section>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </main>
  );
};

export default About;
