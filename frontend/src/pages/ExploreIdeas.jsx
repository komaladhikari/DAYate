import { useState } from "react";
import { Sparkles } from "lucide-react";
import { generateDateIdeas } from "../services/aiService";

const initialForm = {
  mood: "",
  budget: "",
  location: "",
  interests: "",
};

const getErrorHint = (message) => {
  if (message.toLowerCase().includes("quota")) {
    return "Please try again after the OpenAI billing or quota issue is resolved.";
  }

  return "Check your inputs and try again in a moment.";
};

const ExploreIdeas = () => {
  const [form, setForm] = useState(initialForm);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const generatedIdeas = await generateDateIdeas(form);
      setIdeas(generatedIdeas);
    } catch (err) {
      setError(err.message || "Could not generate date ideas.");
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#ffbf8b] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-rose-500">
              <Sparkles size={17} />
              AI date planner
            </p>
            <h1 className="text-4xl font-black text-slate-950">
              Explore Ideas
            </h1>
            <p className="mt-2 max-w-2xl text-slate-700">
              Tell DAYate the vibe, budget, location, and interests. We will
              turn it into three date ideas you can actually use.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-3xl border border-rose-100 bg-white p-5 shadow-md sm:p-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-slate-800">Mood</span>
              <input
                value={form.mood}
                onChange={(event) => updateField("mood", event.target.value)}
                placeholder="Cozy, adventurous, romantic..."
                maxLength={120}
                required
                className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 outline-none focus:border-rose-400"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-800">Budget</span>
              <input
                value={form.budget}
                onChange={(event) => updateField("budget", event.target.value)}
                placeholder="$50, low-cost, splurge..."
                maxLength={80}
                required
                className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 outline-none focus:border-rose-400"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-800">
                Location
              </span>
              <input
                value={form.location}
                onChange={(event) =>
                  updateField("location", event.target.value)
                }
                placeholder="Chicago, Dallas, near downtown..."
                maxLength={120}
                required
                className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 outline-none focus:border-rose-400"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-800">
                Interests
              </span>
              <input
                value={form.interests}
                onChange={(event) =>
                  updateField("interests", event.target.value)
                }
                placeholder="Coffee, art, movies, walks..."
                maxLength={180}
                required
                className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 outline-none focus:border-rose-400"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Sparkles size={18} />
              {loading ? "Generating ideas..." : "Explore Ideas"}
            </button>

            {ideas.length > 0 && !loading && (
              <button
                type="button"
                onClick={() => {
                  setForm(initialForm);
                  setIdeas([]);
                  setError("");
                }}
                className="rounded-full px-5 py-3 font-bold text-rose-500 hover:bg-rose-50"
              >
                Start over
              </button>
            )}
          </div>
        </form>

        {error && (
          <div
            role="alert"
            className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 p-5"
          >
            <p className="font-semibold text-rose-900">{error}</p>
            <p className="mt-1 text-sm text-rose-700">
              {getErrorHint(error)}
            </p>
          </div>
        )}

        {loading && (
          <div className="rounded-2xl bg-white p-6 text-slate-600 shadow">
            Generating thoughtful ideas for your date...
          </div>
        )}

        {!loading && ideas.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
            {ideas.map((idea, index) => (
              <article
                key={`${idea.title}-${index}`}
                className="flex min-h-full flex-col rounded-3xl bg-rose-50 p-5 shadow-md"
              >
                <p className="text-sm font-black uppercase tracking-wide text-rose-500">
                  Idea {index + 1}
                </p>
                <h2 className="mt-3 text-2xl font-black text-slate-950">
                  {idea.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-700">
                  {idea.description}
                </p>

                <div className="mt-5 space-y-2 rounded-2xl bg-white p-4 text-sm text-slate-700">
                  <p>
                    <span className="font-bold text-slate-950">
                      Estimated cost:
                    </span>{" "}
                    {idea.estimatedCost}
                  </p>
                  <p>
                    <span className="font-bold text-slate-950">
                      Best time:
                    </span>{" "}
                    {idea.bestTime}
                  </p>
                </div>

                {idea.activities?.length > 0 && (
                  <div className="mt-5">
                    <h3 className="text-sm font-bold text-slate-950">
                      Activities
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                      {idea.activities.map((activity) => (
                        <li
                          key={activity}
                          className="rounded-full bg-white px-4 py-2"
                        >
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ExploreIdeas;
