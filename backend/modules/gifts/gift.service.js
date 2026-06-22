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
  "places.currentOpeningHours.openNow",
  "places.googleMapsUri",
  "places.primaryType",
  "places.photos",
].join(",");

const normalizeGiftShop = (place) => ({
  id: place.id,
  name: place.displayName?.text || "Unnamed gift shop",
  address: place.formattedAddress || "",
  latitude: place.location?.latitude ?? null,
  longitude: place.location?.longitude ?? null,
  rating: place.rating ?? null,
  reviewCount: place.userRatingCount ?? 0,
  isOpen: place.currentOpeningHours?.openNow ?? null,
  mapsUrl: place.googleMapsUri || "",
  type: place.primaryType || "gift_shop",
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

export const findNearbyGiftShops = async ({
  latitude,
  longitude,
  radius,
  type,
}) => {
  const includedTypes =
    type === "florist" || type === "gift_shop"
      ? [type]
      : ["gift_shop", "florist"];

  try {
    const response = await axios.post(
      PLACES_NEARBY_URL,
      {
        includedTypes,
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
      shops: (response.data.places || []).map(normalizeGiftShop),
    };
  } catch (error) {
    const providerMessage = error.response?.data?.error?.message;
    throw new Error(providerMessage || "Could not load nearby gift shops");
  }
};

export const searchGiftShopsByLocation = async ({ query, type }) => {
  const searchSubject =
    type === "florist"
      ? "flower shops"
      : type === "gift_shop"
        ? "gift shops"
        : "gift shops and flower shops";

  try {
    const response = await axios.post(
      PLACES_TEXT_SEARCH_URL,
      {
        textQuery: `${searchSubject} near ${query}`,
        maxResultCount: 12,
        rankPreference: "RELEVANCE",
      },
      {
        headers: getPlacesHeaders(),
      }
    );

    return {
      query,
      shops: (response.data.places || []).map(normalizeGiftShop),
    };
  } catch (error) {
    const providerMessage = error.response?.data?.error?.message;
    throw new Error(providerMessage || "Could not search gift shops");
  }
};

export const getGiftShopPhoto = async ({ photoName, maxWidth, maxHeight }) => {
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
    throw new Error("Could not load gift shop photo");
  }
};
