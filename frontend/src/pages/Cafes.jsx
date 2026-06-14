import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets.js";
import useNearbyRestaurants from "../hooks/useNearbyRestaurants";

const priceLabels = {
  PRICE_LEVEL_FREE: "Free",
  PRICE_LEVEL_INEXPENSIVE: "$",
  PRICE_LEVEL_MODERATE: "$$",
  PRICE_LEVEL_EXPENSIVE: "$$$",
  PRICE_LEVEL_VERY_EXPENSIVE: "$$$$",
};

const Cafes = () => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    openNow: false,
    minimumRating: "0",
    priceLevel: "all",
  });
  const {
    restaurants,
    loading,
    error,
    locationLabel,
    refetch,
    searchByLocation,
  } = useNearbyRestaurants();

  const filteredRestaurants = useMemo(
    () =>
      restaurants.filter((restaurant) => {
        const matchesType =
          filters.type === "all" || restaurant.type === filters.type;
        const matchesOpenNow = !filters.openNow || restaurant.isOpen === true;
        const matchesRating =
          (restaurant.rating || 0) >= Number(filters.minimumRating);
        const matchesPrice =
          filters.priceLevel === "all" ||
          restaurant.priceLevel === filters.priceLevel;

        return matchesType && matchesOpenNow && matchesRating && matchesPrice;
      }),
    [filters, restaurants]
  );

  const updateFilter = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      type: "all",
      openNow: false,
      minimumRating: "0",
      priceLevel: "all",
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (trimmedQuery.length >= 2) {
      searchByLocation(trimmedQuery);
    }
  };

  return (
    <section className="py-10 sm:py-14 lg:py-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black">Restaurants Near You</h1>
          <p className="mt-2 text-slate-600">
            Showing suggestions around {locationLabel}.
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

      <form
        onSubmit={handleSearch}
        className="mb-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
      >
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a city, neighborhood, or address"
          minLength={2}
          maxLength={120}
          required
          className="min-w-0 flex-1 rounded-full border border-rose-200 bg-white px-5 py-3 outline-none focus:border-rose-400"
        />
        <button
          disabled={loading}
          className="rounded-full bg-rose-500 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          Search location
        </button>
      </form>

      <div className="mb-8 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filters.type}
            onChange={(event) => updateFilter("type", event.target.value)}
            aria-label="Restaurant type"
            className="rounded-full border border-rose-200 px-4 py-2.5 outline-none focus:border-rose-400"
          >
            <option value="all">Restaurants and cafes</option>
            <option value="restaurant">Restaurants</option>
            <option value="cafe">Cafes</option>
          </select>

          <select
            value={filters.minimumRating}
            onChange={(event) =>
              updateFilter("minimumRating", event.target.value)
            }
            aria-label="Minimum rating"
            className="rounded-full border border-rose-200 px-4 py-2.5 outline-none focus:border-rose-400"
          >
            <option value="0">Any rating</option>
            <option value="3">3+ rating</option>
            <option value="4">4+ rating</option>
            <option value="4.5">4.5+ rating</option>
          </select>

          <select
            value={filters.priceLevel}
            onChange={(event) => updateFilter("priceLevel", event.target.value)}
            aria-label="Price level"
            className="rounded-full border border-rose-200 px-4 py-2.5 outline-none focus:border-rose-400"
          >
            <option value="all">Any price</option>
            <option value="PRICE_LEVEL_INEXPENSIVE">$</option>
            <option value="PRICE_LEVEL_MODERATE">$$</option>
            <option value="PRICE_LEVEL_EXPENSIVE">$$$</option>
            <option value="PRICE_LEVEL_VERY_EXPENSIVE">$$$$</option>
          </select>

          <label className="flex cursor-pointer items-center gap-2 rounded-full border border-rose-200 px-4 py-2.5">
            <input
              type="checkbox"
              checked={filters.openNow}
              onChange={(event) => updateFilter("openNow", event.target.checked)}
              className="accent-rose-500"
            />
            Open now
          </label>

          <button
            type="button"
            onClick={resetFilters}
            className="rounded-full px-4 py-2.5 font-semibold text-rose-500 hover:bg-rose-50"
          >
            Reset filters
          </button>
        </div>

        {!loading && !error && (
          <p className="mt-3 text-sm text-slate-500">
            Showing {filteredRestaurants.length} of {restaurants.length} places
          </p>
        )}
      </div>

      {error && (
        <div className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 p-5">
          <p className="font-semibold text-rose-900">{error}</p>
          <p className="mt-1 text-sm text-rose-700">
            Try entering a city, neighborhood, or address above.
          </p>
        </div>
      )}

      {!loading && !error && restaurants.length === 0 && (
        <p className="rounded-2xl bg-white p-6 text-slate-600 shadow">
          No nearby restaurants were found. Try refreshing your location.
        </p>
      )}

      {!loading &&
        !error &&
        restaurants.length > 0 &&
        filteredRestaurants.length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-slate-600 shadow">
            No places match these filters. Try resetting them.
          </p>
        )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredRestaurants.map((restaurant, index) => {
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
            {restaurant.priceLevel && (
              <p className="mt-2 text-sm font-semibold text-slate-600">
                {priceLabels[restaurant.priceLevel] || restaurant.priceLevel}
              </p>
            )}
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
