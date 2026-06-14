import { useCallback, useEffect, useRef, useState } from "react";
import {
  getNearbyRestaurants,
  searchRestaurants,
} from "../services/restaurantService";

const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Your browser does not support location access."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000,
    });
  });

const getLocationErrorMessage = (error) => {
  if (error?.code === 1) {
    return "Location permission is required to find restaurants near you.";
  }

  if (error?.code === 2) {
    return "Your current location could not be determined.";
  }

  if (error?.code === 3) {
    return "Location lookup timed out. Please try again.";
  }

  return error?.message || "Could not load nearby restaurants.";
};

const useNearbyRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locationLabel, setLocationLabel] = useState("your current location");
  const controllerRef = useRef(null);

  const loadRestaurants = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError("");

    try {
      const position = await getCurrentPosition();
      const nearbyRestaurants = await getNearbyRestaurants({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        signal: controller.signal,
      });

      if (!controller.signal.aborted) {
        setRestaurants(nearbyRestaurants);
        setLocationLabel("your current location");
      }
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        setError(getLocationErrorMessage(requestError));
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  const searchByLocation = useCallback(async (query) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError("");

    try {
      const searchResults = await searchRestaurants({
        query,
        signal: controller.signal,
      });

      if (!controller.signal.aborted) {
        setRestaurants(searchResults);
        setLocationLabel(query);
      }
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        setError(requestError.message || "Could not search restaurants.");
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadRestaurants, 0);

    return () => {
      window.clearTimeout(timeoutId);
      controllerRef.current?.abort();
    };
  }, [loadRestaurants]);

  return {
    restaurants,
    loading,
    error,
    locationLabel,
    refetch: loadRestaurants,
    searchByLocation,
  };
};

export default useNearbyRestaurants;
