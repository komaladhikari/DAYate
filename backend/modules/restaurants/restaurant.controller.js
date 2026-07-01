import {
  findNearbyRestaurants,
  getRestaurantPhoto,
  listRegisteredRestaurants,
  searchRestaurantsByLocation,
} from "./restaurant.service.js";

const listRegisteredRestaurantPartners = async (req, res) => {
  try {
    const restaurants = await listRegisteredRestaurants();
    res.json({ success: true, data: { restaurants } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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

const showRestaurantPhoto = async (req, res) => {
  try {
    const photoName = req.query.name?.trim();
    const maxWidth = Math.min(Math.max(Number(req.query.width) || 800, 1), 1600);
    const maxHeight = Math.min(
      Math.max(Number(req.query.height) || 600, 1),
      1600
    );

    if (!/^places\/[^/]+\/photos\/[^/]+$/.test(photoName || "")) {
      return res.status(400).json({
        success: false,
        message: "A valid Google place photo name is required",
      });
    }

    const photoResponse = await getRestaurantPhoto({
      photoName,
      maxWidth,
      maxHeight,
    });

    res.setHeader(
      "Content-Type",
      photoResponse.headers["content-type"] || "image/jpeg"
    );
    res.setHeader("Cache-Control", "no-store");
    photoResponse.data.pipe(res);
  } catch (error) {
    res.status(502).json({ success: false, message: error.message });
  }
};

export {
  listNearbyRestaurants,
  listRegisteredRestaurantPartners,
  searchRestaurants,
  showRestaurantPhoto,
};
