const express = require("express");
const multer = require("multer");
const Asset = require("../models/Asset");
const Purchase = require("../models/Purchase");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "";

    if (file.fieldname === "thumbnail") {
      uploadPath = path.join(__dirname, "../uploads/thumbnails");
    } else {
      uploadPath = path.join(__dirname, "../uploads/assets");
    }

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post(
  "/upload",
  upload.fields([
    { name: "assetFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { title, description, price, category, creator } = req.body;

      if (!req.files || !req.files.assetFile) {
        return res.status(400).json({
          message: "Please upload the main asset file."
        });
      }

      if (!req.files.thumbnail) {
        return res.status(400).json({
          message: "Please upload a thumbnail image."
        });
      }

      if (!title || !description || !price || !category) {
        return res.status(400).json({
          message: "Title, description, price, and category are required."
        });
      }

      if (Number(price) <= 0) {
        return res.status(400).json({
          message: "Price must be greater than 0."
        });
      }

      const asset = await Asset.create({
  title,
  description,
  price: Number(price),
  category,

  fileUrl: req.files.assetFile[0].filename,
  thumbnailUrl: req.files.thumbnail[0].filename,

  creator: creator && creator.length === 24
    ? creator
    : null,

  creatorWallet: req.body.creatorWallet || "",

  metadataURI: req.body.metadataURI || "",
  txHash: req.body.txHash || "",
  contractAddress: req.body.contractAddress || "",
  ownerWallet: req.body.ownerWallet || ""
});
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const assets = await Asset.find()
      .populate("creator", "name email role")
      .sort({ createdAt: -1 });

    res.json(assets);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.get("/creator/:creatorId", async (req, res) => {
  try {
    const assets = await Asset.find({
      creator: req.params.creatorId
    }).sort({ createdAt: -1 });

    res.json(assets);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.get("/download/:assetId/:userId", async (req, res) => {
  try {
    const { assetId, userId } = req.params;

    const asset = await Asset.findById(assetId);

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found"
      });
    }

    const isCreator = asset.creator && asset.creator.toString() === userId;

    const purchase = await Purchase.findOne({
      buyer: userId,
      asset: assetId
    });

    if (!isCreator && !purchase) {
      return res.status(403).json({
        message: "Access denied. Please purchase this asset first."
      });
    }

    res.download(`uploads/assets/${asset.fileUrl}`);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found"
      });
    }

    await Asset.findByIdAndDelete(req.params.id);

    res.json({
      message: "Asset deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id).populate(
      "creator",
      "name email role"
    );

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found"
      });
    }

    res.json(asset);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;