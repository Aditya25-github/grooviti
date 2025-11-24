import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "!!No token provided or malformed authorization header!!"
      });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Additional checks (optional)
    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Malformed token payload"
      });
    }

    // 4. Attach user to request
    req.user = {
      id: decoded.id,
      // Add other decoded fields if needed
    };

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);

    // Specific error messages
    let message = "Authentication failed";
    if (error.name === 'TokenExpiredError') {
      message = "Token expired. Please login again.";
    } else if (error.name === 'JsonWebTokenError') {
      message = "Invalid token. Please login again.";
    }

    return res.status(401).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default authMiddleware;