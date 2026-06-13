const express = require("express");
const router = express.Router();
const { getAuctions, getAuction, createAuction, updateAuction, deleteAuction, getMyAuctions } = require("../controllers/auction.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");

// Public
router.get("/", getAuctions);
router.get("/:id", getAuction);

// Consignor only
router.post("/", protect, restrictTo("consignor", "admin"), createAuction);
router.put("/:id", protect, restrictTo("consignor", "admin"), updateAuction);
router.delete("/:id", protect, restrictTo("consignor", "admin"), deleteAuction);
router.get("/user/my-auctions", protect, restrictTo("consignor", "admin"), getMyAuctions);

module.exports = router;
