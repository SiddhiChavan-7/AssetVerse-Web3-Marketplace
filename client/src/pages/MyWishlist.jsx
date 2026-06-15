import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

function MyWishlist() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.role !== "Buyer") {
      navigate("/explore");
      return;
    }

    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await API.get(`/wishlist/user/${user.id}`);
      setWishlist(res.data);
    } catch (error) {
      toast.error("Failed to load wishlist");
    }
  };

  const handleRemove = async (wishlistId) => {
    try {
      await API.delete(`/wishlist/${wishlistId}`);
      toast.success("Removed from wishlist");
      fetchWishlist();
    } catch (error) {
      toast.error(error.response?.data?.message || "Remove failed");
    }
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>My Wishlist</h1>
        <p style={subtitleStyle}>
          Your saved digital assets for later purchase.
        </p>
      </div>

      <div style={gridStyle}>
        {wishlist.length === 0 ? (
          <div style={emptyBox}>
            <h2>No wishlist items yet</h2>
            <p style={{ color: "#aaa", marginBottom: "20px" }}>
              Save assets from Explore to view them here.
            </p>

            <Link to="/explore" style={exploreButton}>
              Explore Assets
            </Link>
          </div>
        ) : (
          wishlist.map((item) => {
            const asset = item.asset;

            if (!asset) return null;

            return (
              <div key={item._id} style={cardStyle}>
                {asset.thumbnailUrl ? (
                  <img
                    src={`http://localhost:5000/uploads/thumbnails/${asset.thumbnailUrl}`}
                    alt={asset.title}
                    style={thumbnailStyle}
                  />
                ) : (
                  <div style={placeholderStyle}>No Thumbnail</div>
                )}

                <div style={contentStyle}>
                  <h2 style={assetTitle}>{asset.title}</h2>

                  <p style={descriptionStyle}>{asset.description}</p>

                  <div style={metaBox}>
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

                <div style={actionBox}>
                  <Link to={`/asset/${asset._id}`} style={detailsButton}>
                    View Details
                  </Link>

                  <button
                    onClick={() => handleRemove(item._id)}
                    style={removeButton}
                  >
                    Remove from Wishlist
                  </button>
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
  fontSize: "44px",
  marginBottom: "8px"
};

const subtitleStyle = {
  color: "#aaa",
  fontSize: "17px"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "30px"
};

const emptyBox = {
  background: "#151515",
  border: "1px solid #2a2a2a",
  borderRadius: "18px",
  padding: "35px"
};

const exploreButton = {
  display: "inline-block",
  padding: "12px 18px",
  borderRadius: "10px",
  background: "#7c3aed",
  color: "white",
  textDecoration: "none",
  fontWeight: "bold"
};

const cardStyle = {
  background: "#151515",
  borderRadius: "18px",
  padding: "20px",
  border: "1px solid #2a2a2a",
  display: "flex",
  flexDirection: "column",
  minHeight: "560px"
};

const thumbnailStyle = {
  width: "100%",
  height: "190px",
  objectFit: "cover",
  borderRadius: "14px",
  marginBottom: "18px",
  background: "#333"
};

const placeholderStyle = {
  height: "190px",
  background: "#222",
  borderRadius: "14px",
  marginBottom: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#aaa"
};

const contentStyle = {
  flexGrow: 1
};

const assetTitle = {
  fontSize: "26px",
  marginBottom: "12px"
};

const descriptionStyle = {
  color: "#aaa",
  lineHeight: "1.5",
  marginBottom: "16px"
};

const metaBox = {
  background: "#0f0f0f",
  borderRadius: "12px",
  padding: "14px",
  border: "1px solid #252525"
};

const actionBox = {
  marginTop: "18px"
};

const detailsButton = {
  display: "block",
  textAlign: "center",
  padding: "12px",
  borderRadius: "10px",
  background: "#0f0f0f",
  border: "1px solid #333",
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
  marginBottom: "10px"
};

const removeButton = {
  width: "100%",
  padding: "12px",
  border: "none",
  borderRadius: "10px",
  background: "#ef4444",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold"
};

export default MyWishlist;