const express = require("express");
const Purchase = require("../models/Purchase");
const Asset = require("../models/Asset");

const router = express.Router();

router.post("/buy", async (req, res) => {
  try {
    const {
      buyer,
      asset,
      txHash,
      buyerWallet,
      sellerWallet,
      price
    } = req.body;

    if (!buyer || !asset || !txHash || !buyerWallet || !sellerWallet || !price) {
      return res.status(400).json({
        message: "Buyer, asset, txHash, buyerWallet, sellerWallet, and price are required"
      });
    }

    const assetData = await Asset.findById(asset);

    if (!assetData) {
      return res.status(404).json({
        message: "Asset not found"
      });
    }

    if (assetData.creator && assetData.creator.toString() === buyer) {
      return res.status(400).json({
        message: "You cannot buy your own asset"
      });
    }

    const alreadyPurchased = await Purchase.findOne({ buyer, asset });

    if (alreadyPurchased) {
      return res.status(400).json({
        message: "You already purchased this asset"
      });
    }

    const purchase = await Purchase.create({
      buyer,
      asset,
      txHash,
      buyerWallet,
      sellerWallet,
      price
    });

    res.status(201).json({
      message: "Asset purchased successfully",
      purchase
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const purchases = await Purchase.find({
      buyer: req.params.userId
    })
      .populate("asset")
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });

    res.json(purchases);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.get("/creator/:creatorId", async (req, res) => {
  try {
    const creatorAssets = await Asset.find({
      creator: req.params.creatorId
    });

    const assetIds = creatorAssets.map((asset) => asset._id);

    const purchases = await Purchase.find({
      asset: { $in: assetIds }
    })
      .populate("asset")
      .populate("buyer", "name email")
      .sort({ createdAt: -1 });

    const totalSales = purchases.length;

    const estimatedRevenue = purchases.reduce((sum, purchase) => {
      return sum + Number(purchase.price || purchase.asset?.price || 0);
    }, 0);

    const salesByAsset = creatorAssets.map((asset) => {
      const assetPurchases = purchases.filter(
        (purchase) =>
          purchase.asset &&
          purchase.asset._id.toString() === asset._id.toString()
      );

      const soldCount = assetPurchases.length;

      const revenue = assetPurchases.reduce((sum, purchase) => {
        return sum + Number(purchase.price || asset.price || 0);
      }, 0);

      return {
        assetId: asset._id,
        title: asset.title,
        price: asset.price,
        category: asset.category,
        thumbnailUrl: asset.thumbnailUrl,
        soldCount,
        revenue
      };
    });

    const topSellingAsset =
      salesByAsset.length > 0
        ? salesByAsset.reduce((top, current) =>
            current.soldCount > top.soldCount ? current : top
          )
        : null;

    res.json({
      totalSales,
      estimatedRevenue,
      topSellingAsset,
      salesByAsset,
      purchases
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;