import axios from "axios";

const PLACES_NEARBY_URL =
  "https://places.googleapis.com/v1/places:searchNearby";

const PLACE_FIELDS = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
  "places.currentOpeningHours.openNow",
  "places.googleMapsUri",
  "places.primaryType",
].join(",");

const normalizeRestaurant = (place) => ({
  id: place.id,
  name: place.displayName?.text || "Unnamed restaurant",
  address: place.formattedAddress || "",
  latitude: place.location?.latitude ?? null,
  longitude: place.location?.longitude ?? null,
  rating: place.rating ?? null,
  reviewCount: place.userRatingCount ?? 0,
  priceLevel: place.priceLevel || null,
  isOpen: place.currentOpeningHours?.openNow ?? null,
  mapsUrl: place.googleMapsUri || "",
  type: place.primaryType || "restaurant",
});

export const findNearbyRestaurants = async ({
  latitude,
  longitude,
  radius,
}) => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    throw new Error("Google Places API key is not configured");
  }

  try {
    const response = await axios.post(
      PLACES_NEARBY_URL,
      {
        includedTypes: ["restaurant", "cafe"],
        maxResultCount: 12,
        rankPreference: "POPULARITY",
        locationRestriction: {
          circle: {
            center: { latitude, longitude },
            radius,
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": PLACE_FIELDS,
        },
      }
    );

    return {
      searchLocation: { latitude, longitude },
      radius,
      restaurants: (response.data.places || []).map(normalizeRestaurant),
    };
  } catch (error) {
    const providerMessage = error.response?.data?.error?.message;
    throw new Error(providerMessage || "Could not load nearby restaurants");
  }
};
