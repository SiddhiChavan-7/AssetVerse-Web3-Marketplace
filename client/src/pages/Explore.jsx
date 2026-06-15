import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function Explore() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [purchasedAssets, setPurchasedAssets] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Newest");

  useEffect(() => {
    fetchAssets();

    if (user?.id && user?.role === "Buyer") {
      fetchPurchases();
    }
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await API.get("/assets");
      setAssets(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load assets");
    }
  };

  const fetchPurchases = async () => {
    try {
      const res = await API.get(`/purchases/user/${user.id}`);
      const purchasedIds = res.data.map((purchase) => purchase.asset?._id);
      setPurchasedAssets(purchasedIds);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuy = (assetId) => {
    if (!user) {
      toast.error("Please login to buy assets.");
      return;
    }

    if (user.role !== "Buyer") {
      toast.error("Only buyers can purchase assets.");
      return;
    }

    navigate(`/asset/${assetId}`);
  };

  const handleWishlist = async (assetId) => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (user.role !== "Buyer") {
      toast.error("Only buyers can use wishlist");
      return;
    }

    try {
      await API.post("/wishlist/add", {
        user: user.id,
        asset: assetId
      });

      toast.success("Added to wishlist");
    } catch (error) {
      toast.error(error.response?.data?.message || "Wishlist failed");
    }
  };

  const categories = [
    "All",
    ...new Set(assets.map((asset) => asset.category).filter(Boolean))
  ];

  const filteredAssets = assets
    .filter((asset) =>
      asset.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((asset) =>
      category === "All" ? true : asset.category === category
    )
    .sort((a, b) => {
      if (sort === "Price Low to High") return a.price - b.price;
      if (sort === "Price High to Low") return b.price - a.price;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Explore Digital Assets</h1>

        <p style={subtitleStyle}>
          Search, filter, and purchase premium digital assets.
        </p>
      </div>

      <div style={filterBar}>
        <input
          type="text"
          placeholder="Search assets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={selectStyle}
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={selectStyle}
        >
          <option>Newest</option>
          <option>Price Low to High</option>
          <option>Price High to Low</option>
        </select>
      </div>

      <div style={gridStyle}>
        {filteredAssets.length === 0 ? (
          <p style={{ color: "#aaa" }}>No assets found.</p>
        ) : (
          filteredAssets.map((asset) => {
            const isPurchased = purchasedAssets.includes(asset._id);
            const isOwnAsset = asset.creator?._id === user?.id;

            return (
              <div key={asset._id} style={cardStyle}>
                <img
                  src={`http://localhost:5000/uploads/thumbnails/${asset.thumbnailUrl}`}
                  alt={asset.title}
                  style={thumbnailStyle}
                />

                <div style={contentStyle}>
                  <h2 style={assetTitle}>{asset.title}</h2>

                  <p style={descriptionStyle}>{asset.description}</p>

                  <div style={metaBlock}>
                    <p>
                      <strong>Category:</strong> {asset.category}
                    </p>

                    <p>
                      <strong>Price:</strong> {asset.price} MATIC
                    </p>

                    <p>
                      <strong>Creator:</strong>{" "}
                      {asset.creator?.name || "Unknown"}
                    </p>
                  </div>
                </div>

                <div style={footerStyle}>
                  <Link to={`/asset/${asset._id}`} style={detailsButton}>
                    View Details
                  </Link>

                  {user?.role === "Buyer" && (
                    <button
                      onClick={() => handleWishlist(asset._id)}
                      style={wishlistButton}
                    >
                      Add to Wishlist
                    </button>
                  )}

                  {user?.role === "Buyer" && isPurchased && (
                    <a
                      href={`http://localhost:5000/api/assets/download/${asset._id}/${user.id}`}
                      target="_blank"
                      rel="noreferrer"
                      style={downloadLink}
                    >
                      Download File
                    </a>
                  )}

                  {!user ? (
                    <button style={disabledButton}>Login to Buy</button>
                  ) : isOwnAsset ? (
                    <button style={disabledButton}>Your Asset</button>
                  ) : user.role === "Creator" ? (
                    <button style={disabledButton}>Creator View</button>
                  ) : isPurchased ? (
                    <button style={purchasedButton}>Purchased</button>
                  ) : (
                    <button
                      style={buyButton}
                      onClick={() => handleBuy(asset._id)}
                    >
                      Buy Asset
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#0d0d0d",
  color: "white",
  padding: "50px 60px"
};

const headerStyle = {
  marginBottom: "30px"
};

const titleStyle = {
  fontSize: "48px",
  marginBottom: "10px"
};

const subtitleStyle = {
  color: "#aaa",
  fontSize: "18px"
};

const filterBar = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr",
  gap: "16px",
  marginBottom: "30px"
};

const inputStyle = {
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #2a2a2a",
  background: "#151515",
  color: "white",
  fontSize: "15px"
};

const selectStyle = {
  ...inputStyle,
  cursor: "pointer"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "30px"
};

const cardStyle = {
  background: "#151515",
  borderRadius: "18px",
  padding: "20px",
  border: "1px solid #2a2a2a",
  display: "flex",
  flexDirection: "column",
  minHeight: "680px",
  overflow: "hidden"
};

const thumbnailStyle = {
  width: "100%",
  height: "190px",
  objectFit: "cover",
  borderRadius: "14px",
  marginBottom: "20px",
  background: "#333"
};

const contentStyle = {
  flexGrow: 1
};

const assetTitle = {
  fontSize: "28px",
  marginBottom: "12px",
  minHeight: "68px",
  lineHeight: "1.2"
};

const descriptionStyle = {
  color: "#aaa",
  minHeight: "70px",
  lineHeight: "1.5",
  marginBottom: "18px"
};

const metaBlock = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  fontSize: "15px"
};

const footerStyle = {
  marginTop: "20px"
};

const detailsButton = {
  display: "block",
  width: "100%",
  padding: "13px",
  marginBottom: "12px",
  borderRadius: "12px",
  border: "1px solid #333",
  background: "#0f0f0f",
  color: "white",
  textAlign: "center",
  textDecoration: "none",
  fontWeight: "bold",
  boxSizing: "border-box"
};

const wishlistButton = {
  width: "100%",
  padding: "13px",
  marginBottom: "12px",
  borderRadius: "12px",
  border: "1px solid #333",
  background: "#1a1a1a",
  color: "white",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "bold",
  transition: "0.3s"
};

const downloadLink = {
  display: "block",
  marginBottom: "15px",
  color: "#a78bfa",
  textDecoration: "none",
  fontWeight: "bold",
  textAlign: "center"
};

const buyButton = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  background: "#7c3aed",
  color: "white",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "bold"
};

const purchasedButton = {
  ...buyButton,
  background: "#16a34a"
};

const disabledButton = {
  ...buyButton,
  background: "#444",
  cursor: "not-allowed"
};

export default Explore;