import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Expected format: Bearer <token>

  if (!token) {
    return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = token_decode; // Attach decoded token (e.g., { id, name, etc. })
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: "Error verifying token" });
  }
};

export default authMiddleware;
