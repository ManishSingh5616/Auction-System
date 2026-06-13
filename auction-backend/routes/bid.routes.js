const express = require("express");
const router = express.Router();
const { getAuctionBids, getMyBids } = require("../controllers/bid.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/auction/:id", getAuctionBids);
router.get("/my-bids", protect, getMyBids);

module.exports = router;
