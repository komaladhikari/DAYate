import axios from "axios";

const PLACES_NEARBY_URL =
  "https://places.googleapis.com/v1/places:searchNearby";
const PLACES_TEXT_SEARCH_URL =
  "https://places.googleapis.com/v1/places:searchText";

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
  "places.photos",
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
  photoName: place.photos?.[0]?.name || "",
  photoAttributions: (place.photos?.[0]?.authorAttributions || []).map(
    (attribution) => ({
      displayName: attribution.displayName || "",
      uri: attribution.uri || "",
    })
  ),
});

const getPlacesHeaders = () => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    throw new Error("Google Places API key is not configured");
  }

  return {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask": PLACE_FIELDS,
  };
};

export const findNearbyRestaurants = async ({
  latitude,
  longitude,
  radius,
}) => {
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
        headers: getPlacesHeaders(),
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

export const searchRestaurantsByLocation = async (query) => {
  try {
    const response = await axios.post(
      PLACES_TEXT_SEARCH_URL,
      {
        textQuery: `restaurants and cafes near ${query}`,
        includedType: "restaurant",
        maxResultCount: 12,
        rankPreference: "RELEVANCE",
      },
      {
        headers: getPlacesHeaders(),
      }
    );

    return {
      query,
      restaurants: (response.data.places || []).map(normalizeRestaurant),
    };
  } catch (error) {
    const providerMessage = error.response?.data?.error?.message;
    throw new Error(providerMessage || "Could not search restaurants");
  }
};

export const getRestaurantPhoto = async ({
  photoName,
  maxWidth,
  maxHeight,
}) => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    throw new Error("Google Places API key is not configured");
  }

  try {
    return await axios.get(
      `https://places.googleapis.com/v1/${photoName}/media`,
      {
        params: {
          key: apiKey,
          maxWidthPx: maxWidth,
          maxHeightPx: maxHeight,
        },
        responseType: "stream",
      }
    );
  } catch {
    throw new Error("Could not load restaurant photo");
  }
};
