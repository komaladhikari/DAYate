import {
  findNearbyGiftShops,
  getGiftShopPhoto,
  searchGiftShopsByLocation,
} from "./gift.service.js";

const validGiftTypes = new Set(["all", "gift_shop", "florist"]);

const normalizeType = (type) =>
  validGiftTypes.has(type) && type !== "all" ? type : undefined;

const listNearbyGiftShops = async (req, res) => {
  try {
    const latitude = Number(req.query.lat);
    const longitude = Number(req.query.lng);
    const radius = req.query.radius ? Number(req.query.radius) : 5000;
    const type = normalizeType(req.query.type);

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

    const shops = await findNearbyGiftShops({
      latitude,
      longitude,
      radius,
      type,
    });

    res.json({ success: true, data: shops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const searchGiftShops = async (req, res) => {
  try {
    const query = req.query.query?.trim();
    const type = normalizeType(req.query.type);

    if (!query || query.length < 2 || query.length > 120) {
      return res.status(400).json({
        success: false,
        message: "Enter a location between 2 and 120 characters",
      });
    }

    const shops = await searchGiftShopsByLocation({ query, type });
    res.json({ success: true, data: shops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const showGiftShopPhoto = async (req, res) => {
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

    const photoResponse = await getGiftShopPhoto({
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

export { listNearbyGiftShops, searchGiftShops, showGiftShopPhoto };
