// middleware/authFormMiddleware.js
import jwt from "jsonwebtoken";

const authFormMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user to request
    next();
  } catch (error) {
    console.log("Token verification error:", error);
    return res.status(401).json({ success: false, message: "Error verifying token" });
  }
};

export default authFormMiddleware;
