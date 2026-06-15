const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true
    },
    txHash: {
      type: String,
      required: true
    },
    buyerWallet: {
      type: String,
      required: true
    },
    sellerWallet: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchase", purchaseSchema);