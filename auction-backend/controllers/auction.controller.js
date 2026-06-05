const Auction = require("../models/Auction.model");

// ─── GET ALL AUCTIONS (with filters) ───────────────────────────────────────
const getAuctions = async (req, res) => {
  try {
    const { status, category, search, sort, page = 1, limit = 12 } = req.query;

    const query = {};

    // Filter by status (default: active)
    if (status) query.status = status;
    else query.status = "active";

    // Filter by category
    if (category && category !== "All") query.category = category;

    // Search by title
    if (search) query.title = { $regex: search, $options: "i" };

    // Sorting
    let sortObj = { createdAt: -1 }; // newest first by default
    if (sort === "price_asc") sortObj = { currentPrice: 1 };
    if (sort === "price_desc") sortObj = { currentPrice: -1 };
    if (sort === "ending_soon") sortObj = { endTime: 1 };
    if (sort === "most_bids") sortObj = { totalBids: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Auction.countDocuments(query);

    const auctions = await Auction.find(query)
      .populate("seller", "name email")
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      auctions,
    });
  } catch (error) {
    console.error("getAuctions error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET SINGLE AUCTION ─────────────────────────────────────────────────────
const getAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate("seller", "name email createdAt")
      .populate("winner", "name email");

    if (!auction) {
      return res.status(404).json({ success: false, message: "Auction not found." });
    }

    return res.status(200).json({ success: true, auction });
  } catch (error) {
    console.error("getAuction error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── CREATE AUCTION ─────────────────────────────────────────────────────────
const createAuction = async (req, res) => {
  try {
    const {
      title,
      description,
      images,
      category,
      startingPrice,
      reservePrice,
      bidIncrement,
      endTime,
    } = req.body;

    // Validate endTime is in the future
    if (new Date(endTime) <= new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "End time must be in the future." });
    }

    const auction = await Auction.create({
      title,
      description,
      images: images || [],
      category,
      startingPrice,
      currentPrice: startingPrice,
      reservePrice: reservePrice || 0,
      bidIncrement: bidIncrement || 1,
      endTime,
      seller: req.user._id,
    });

    await auction.populate("seller", "name email");

    return res.status(201).json({
      success: true,
      message: "Auction created successfully.",
      auction,
    });
  } catch (error) {
    console.error("createAuction error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── UPDATE AUCTION ─────────────────────────────────────────────────────────
const updateAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({ success: false, message: "Auction not found." });
    }

    // Only seller or admin can update
    if (
      auction.seller.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    // Can't update if auction has bids
    if (auction.totalBids > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot edit an auction with existing bids." });
    }

    const allowedFields = [
      "title",
      "description",
      "images",
      "category",
      "startingPrice",
      "reservePrice",
      "bidIncrement",
      "endTime",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        auction[field] = req.body[field];
      }
    });

    await auction.save();
    await auction.populate("seller", "name email");

    return res.status(200).json({
      success: true,
      message: "Auction updated successfully.",
      auction,
    });
  } catch (error) {
    console.error("updateAuction error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE AUCTION ─────────────────────────────────────────────────────────
const deleteAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({ success: false, message: "Auction not found." });
    }

    if (
      auction.seller.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    if (auction.totalBids > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot delete an auction with existing bids." });
    }

    await auction.deleteOne();

    return res.status(200).json({ success: true, message: "Auction deleted successfully." });
  } catch (error) {
    console.error("deleteAuction error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET MY AUCTIONS (seller's own) ────────────────────────────────────────
const getMyAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ seller: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, auctions });
  } catch (error) {
    console.error("getMyAuctions error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAuctions,
  getAuction,
  createAuction,
  updateAuction,
  deleteAuction,
  getMyAuctions,
};
