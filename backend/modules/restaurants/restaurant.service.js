export const findNearbyRestaurants = async ({
  latitude,
  longitude,
  radius,
}) => {
  // Step 2 will replace this placeholder with a Places API request.
  return {
    searchLocation: { latitude, longitude },
    radius,
    restaurants: [],
  };
};
