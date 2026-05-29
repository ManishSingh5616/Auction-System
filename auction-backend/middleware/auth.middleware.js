const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

/**
 * Protect middleware — verifies JWT from cookie or Authorization header.
 * Attaches req.user on success.
 */
const protect = async (req, res, next) => {
    let token;

    // 1. Check httpOnly cookie first
    if (req.cookies?.token) {
        token = req.cookies.token;
    }
    // 2. Fallback: Bearer token in Authorization header
    else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized. No token provided.",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach user to request (exclude password)
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User belonging to this token no longer exists.",
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized. Token invalid or expired.",
        });
    }
};

/**
 * Restrict to certain roles, e.g. adminOnly = restrictTo('admin')
 */
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action.",
            });
        }
        next();
    };
};

module.exports = { protect, restrictTo };