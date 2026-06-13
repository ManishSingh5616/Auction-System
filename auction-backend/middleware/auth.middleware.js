const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(401).json({ success: false, message: "Not authorized. No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user)
      return res.status(401).json({ success: false, message: "User not found." });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token invalid or expired." });
  }
};

// Only allow specific roles
const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. Only ${roles.join(" or ")} can do this.`,
    });
  }
  next();
};

module.exports = { protect, restrictTo };
