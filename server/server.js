const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");


dotenv.config();

const authRoutes = require("./routes/authRoutes");
const assetRoutes = require("./routes/assetRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// THIS MUST BE HERE
app.use(
  "/uploads/thumbnails",
  express.static(path.join(__dirname, "uploads", "thumbnails"))
);

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("AssetVerse Backend Running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error(err.message);
  });