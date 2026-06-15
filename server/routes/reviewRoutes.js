const express = require("express");
const Review = require("../models/Review");
const Purchase = require("../models/Purchase");

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { user, asset, rating, comment } = req.body;

    if (!user || !asset || !rating || !comment) {
      return res.status(400).json({
        message: "User, asset, rating, and comment are required"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }

    const purchased = await Purchase.findOne({
      buyer: user,
      asset
    });

    if (!purchased) {
      return res.status(403).json({
        message: "Only buyers who purchased this asset can review it"
      });
    }

    const existingReview = await Review.findOne({
      user,
      asset
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You already reviewed this asset"
      });
    }

    const review = await Review.create({
      user,
      asset,
      rating,
      comment
    });

    res.status(201).json({
      message: "Review added successfully",
      review
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.get("/asset/:assetId", async (req, res) => {
  try {
    const reviews = await Review.find({
      asset: req.params.assetId
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews === 0
        ? 0
        : reviews.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews;

    res.json({
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
      reviews
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;