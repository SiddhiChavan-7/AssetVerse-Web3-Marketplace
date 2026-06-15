const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    fileUrl: {
      type: String,
      required: true
    },

    thumbnailUrl: {
      type: String,
      required: true
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    creatorWallet: {
      type: String,
      default: ""
    },

    ownerWallet: {
      type: String,
      default: ""
    },

    metadataURI: {
      type: String,
      default: ""
    },

    txHash: {
      type: String,
      default: ""
    },

    contractAddress: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Asset", assetSchema);