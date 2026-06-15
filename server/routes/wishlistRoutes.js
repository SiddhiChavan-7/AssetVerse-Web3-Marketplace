const express = require("express");
const Wishlist = require("../models/Wishlist");

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { user, asset } = req.body;

    if (!user || !asset) {
      return res.status(400).json({
        message: "User and asset are required"
      });
    }

    const existing = await Wishlist.findOne({ user, asset });

    if (existing) {
      return res.status(400).json({
        message: "Asset already in wishlist"
      });
    }

    const wishlist = await Wishlist.create({
      user,
      asset
    });

    res.status(201).json({
      message: "Added to wishlist",
      wishlist
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const wishlist = await Wishlist.find({
      user: req.params.userId
    })
      .populate({
        path: "asset",
        populate: {
          path: "creator",
          select: "name email role"
        }
      })
      .sort({ createdAt: -1 });

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.delete("/:wishlistId", async (req, res) => {
  try {
    const item = await Wishlist.findById(req.params.wishlistId);

    if (!item) {
      return res.status(404).json({
        message: "Wishlist item not found"
      });
    }

    await Wishlist.findByIdAndDelete(req.params.wishlistId);

    res.json({
      message: "Removed from wishlist"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;