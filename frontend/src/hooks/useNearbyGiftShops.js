import { useCallback, useEffect, useRef, useState } from "react";
import { getNearbyGiftShops, searchGiftShops } from "../services/giftService";

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
    return "Location permission is required to find gift shops near you.";
  }

  if (error?.code === 2) {
    return "Your current location could not be determined.";
  }

  if (error?.code === 3) {
    return "Location lookup timed out. Please try again.";
  }

  return error?.message || "Could not load nearby gift shops.";
};

const useNearbyGiftShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locationLabel, setLocationLabel] = useState("your current location");
  const [activeType, setActiveType] = useState("all");
  const lastQueryRef = useRef("");
  const controllerRef = useRef(null);

  const loadGiftShops = useCallback(async (type = "all") => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError("");
    setActiveType(type);
    lastQueryRef.current = "";

    try {
      const position = await getCurrentPosition();
      const nearbyShops = await getNearbyGiftShops({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        type,
        signal: controller.signal,
      });

      if (!controller.signal.aborted) {
        setShops(nearbyShops);
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

  const searchByLocation = useCallback(async (query, type = "all") => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError("");
    setActiveType(type);
    lastQueryRef.current = query;

    try {
      const searchResults = await searchGiftShops({
        query,
        type,
        signal: controller.signal,
      });

      if (!controller.signal.aborted) {
        setShops(searchResults);
        setLocationLabel(query);
      }
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        setError(requestError.message || "Could not search gift shops.");
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  const changeType = useCallback(
    (type) => {
      if (lastQueryRef.current) {
        searchByLocation(lastQueryRef.current, type);
        return;
      }

      loadGiftShops(type);
    },
    [loadGiftShops, searchByLocation]
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => loadGiftShops("all"), 0);

    return () => {
      window.clearTimeout(timeoutId);
      controllerRef.current?.abort();
    };
  }, [loadGiftShops]);

  return {
    shops,
    loading,
    error,
    locationLabel,
    activeType,
    refetch: loadGiftShops,
    searchByLocation,
    changeType,
  };
};

export default useNearbyGiftShops;
