import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = token_decode;
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: "Error verifying token" });
  }
};

export default authMiddleware;
