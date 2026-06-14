import { Link } from "react-router-dom";
import { assets } from "../assets/assets.js";
import useNearbyRestaurants from "../hooks/useNearbyRestaurants";

const Cafes = () => {
  const { restaurants, loading, error, refetch } = useNearbyRestaurants();

  return (
    <section className="py-10 sm:py-14 lg:py-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black">Restaurants Near You</h1>
          <p className="mt-2 text-slate-600">
            Suggestions based on your current location.
          </p>
        </div>

        <button
          type="button"
          onClick={refetch}
          disabled={loading}
          className="rounded-full bg-slate-900 px-5 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Finding restaurants..." : "Refresh location"}
        </button>
      </div>

      {error && (
        <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 p-5">
          <p className="font-semibold text-rose-900">{error}</p>
          <p className="mt-1 text-sm text-rose-700">
            Allow location access in your browser settings, then try again.
          </p>
        </div>
      )}

      {!loading && !error && restaurants.length === 0 && (
        <p className="rounded-2xl bg-white p-6 text-slate-600 shadow">
          No nearby restaurants were found. Try refreshing your location.
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {restaurants.map((restaurant, index) => {
          const image = index % 2 === 0 ? assets.image1 : assets.image2;

          return (
          <Link
            key={restaurant.id}
            to={`/cafes/${restaurant.id}`}
            state={{ cafe: { ...restaurant, img: image } }}
            className="rounded-3xl bg-rose-50 p-4 text-center shadow-md transition hover:-translate-y-1 hover:bg-rose-100"
          >
            <div className="rounded-2xl overflow-hidden bg-rose-100 p-3">
              <img
                src={image}
                alt=""
                className="h-40 w-full rounded-lg object-cover"
              />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{restaurant.name}</h3>
            <p className="mt-2 text-sm text-slate-600">{restaurant.address}</p>
            <p className="mt-2 text-sm">
              {restaurant.isOpen === null
                ? "Hours unavailable"
                : restaurant.isOpen
                  ? "Open now"
                  : "Closed now"}
            </p>
            <p className="mt-2 text-sm">
              {restaurant.rating
                ? `${restaurant.rating}/5 (${restaurant.reviewCount} reviews)`
                : "No ratings yet"}
            </p>
            <p className="mt-4 text-sm font-semibold text-rose-500">
              Add to date plan
            </p>
          </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Cafes;
