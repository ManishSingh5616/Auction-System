const express = require("express");
const router = express.Router();
const {
  getAuctions,
  getAuction,
  createAuction,
  updateAuction,
  deleteAuction,
  getMyAuctions,
} = require("../controllers/auction.controller");
const { protect } = require("../middleware/auth.middleware");

// Public routes
router.get("/", getAuctions);
router.get("/:id", getAuction);

// Protected routes (must be logged in)
router.post("/", protect, createAuction);
router.put("/:id", protect, updateAuction);
router.delete("/:id", protect, deleteAuction);
router.get("/user/my-auctions", protect, getMyAuctions);

module.exports = router;
