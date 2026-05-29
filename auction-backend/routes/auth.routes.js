const express = require("express");
const router = express.Router();
const {
    register,
    login,
    logout,
    getMe,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Protected route
router.get("/me", protect, getMe);

module.exports = router;
