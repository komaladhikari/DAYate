import { useMemo, useState } from "react";
import { assets } from "../assets/assets.js";
import useNearbyGiftShops from "../hooks/useNearbyGiftShops";
import { getGiftPhotoUrl } from "../services/giftService";

const typeLabels = {
  gift_shop: "Gift shop",
  florist: "Flower shop",
};

const Gifts = () => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    openNow: false,
    minimumRating: "0",
  });
  const {
    shops,
    loading,
    error,
    locationLabel,
    activeType,
    refetch,
    searchByLocation,
    changeType,
  } = useNearbyGiftShops();

  const filteredShops = useMemo(
    () =>
      shops.filter((shop) => {
        const matchesOpenNow = !filters.openNow || shop.isOpen === true;
        const matchesRating = (shop.rating || 0) >= Number(filters.minimumRating);

        return matchesOpenNow && matchesRating;
      }),
    [filters, shops]
  );

  const updateFilter = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      openNow: false,
      minimumRating: "0",
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (trimmedQuery.length >= 2) {
      searchByLocation(trimmedQuery, activeType);
    }
  };

  return (
    <section className="min-h-screen bg-[#ffbf8b] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black">Gift Shops Near You</h1>
            <p className="mt-2 text-slate-600">
              Find flowers and thoughtful gifts around {locationLabel}.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch(activeType)}
            disabled={loading}
            className="rounded-full bg-slate-900 px-5 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Finding gifts..." : "Refresh location"}
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
            className="rounded-full bg-slate-900 px-5 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Search location
          </button>
        </form>

        <div className="mb-8 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={activeType}
              onChange={(event) => changeType(event.target.value)}
              aria-label="Gift shop type"
              className="rounded-full border border-rose-200 px-4 py-2.5 outline-none focus:border-rose-400"
            >
              <option value="all">Gifts and flowers</option>
              <option value="gift_shop">Gift shops</option>
              <option value="florist">Flower shops</option>
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

            <label className="flex cursor-pointer items-center gap-2 rounded-full border border-rose-200 px-4 py-2.5">
              <input
                type="checkbox"
                checked={filters.openNow}
                onChange={(event) =>
                  updateFilter("openNow", event.target.checked)
                }
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
              Showing {filteredShops.length} of {shops.length} places
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

        {!loading && !error && shops.length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-slate-600 shadow">
            No nearby gift shops were found. Try refreshing your location.
          </p>
        )}

        {!loading &&
          !error &&
          shops.length > 0 &&
          filteredShops.length === 0 && (
            <p className="rounded-2xl bg-white p-6 text-slate-600 shadow">
              No places match these filters. Try resetting them.
            </p>
          )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredShops.map((shop, index) => {
            const fallbackImage = index % 2 === 0 ? assets.image1 : assets.image2;
            const image = getGiftPhotoUrl(shop.photoName) || fallbackImage;

            return (
              <article
                key={shop.id}
                className="rounded-3xl bg-rose-50 p-4 text-center shadow-md transition hover:-translate-y-1 hover:bg-rose-100"
              >
                <div className="overflow-hidden rounded-2xl bg-rose-100 p-3">
                  <img
                    src={image}
                    alt=""
                    onError={(event) => {
                      event.currentTarget.src = fallbackImage;
                    }}
                    className="h-40 w-full rounded-lg object-cover"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{shop.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{shop.address}</p>
                <p className="mt-2 text-sm">
                  {shop.isOpen === null
                    ? "Hours unavailable"
                    : shop.isOpen
                      ? "Open now"
                      : "Closed now"}
                </p>
                <p className="mt-2 text-sm">
                  {shop.rating
                    ? `${shop.rating}/5 (${shop.reviewCount} reviews)`
                    : "No ratings yet"}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-600">
                  {typeLabels[shop.type] || "Gift option"}
                </p>
                {shop.photoAttributions?.length > 0 && (
                  <p className="mt-2 text-xs text-slate-500">
                    Photo by{" "}
                    {shop.photoAttributions.map((attribution, position) => (
                      <span key={`${shop.id}-${attribution.displayName}`}>
                        {position > 0 && ", "}
                        {attribution.uri ? (
                          <a
                            href={attribution.uri}
                            target="_blank"
                            rel="noreferrer"
                            className="underline"
                          >
                            {attribution.displayName}
                          </a>
                        ) : (
                          attribution.displayName
                        )}
                      </span>
                    ))}
                  </p>
                )}
                {shop.mapsUrl && (
                  <a
                    href={shop.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600"
                  >
                    Open in Google Maps
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Gifts;
