import {
  findNearbyRestaurants,
  searchRestaurantsByLocation,
} from "./restaurant.service.js";

const listNearbyRestaurants = async (req, res) => {
  try {
    const latitude = Number(req.query.lat);
    const longitude = Number(req.query.lng);
    const radius = req.query.radius ? Number(req.query.radius) : 5000;

    if (
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90 ||
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid lat and lng query parameters are required",
      });
    }

    if (!Number.isFinite(radius) || radius <= 0 || radius > 50000) {
      return res.status(400).json({
        success: false,
        message: "Radius must be between 1 and 50000 meters",
      });
    }

    const restaurants = await findNearbyRestaurants({
      latitude,
      longitude,
      radius,
    });

    res.json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const searchRestaurants = async (req, res) => {
  try {
    const query = req.query.query?.trim();

    if (!query || query.length < 2 || query.length > 120) {
      return res.status(400).json({
        success: false,
        message: "Enter a location between 2 and 120 characters",
      });
    }

    const restaurants = await searchRestaurantsByLocation(query);
    res.json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { listNearbyRestaurants, searchRestaurants };
