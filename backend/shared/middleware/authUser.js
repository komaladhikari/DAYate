import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.json({ success: false, message: "Please login first" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || process.env.JWT_SECRET_KEY
    );

    req.userId = decoded.id;
    next();
  } catch (error) {
    res.json({ success: false, message: "Invalid token" });
  }
};
export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // should contain user id
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authUser;