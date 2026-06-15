import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

function AssetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [asset, setAsset] = useState(null);
  const [purchased, setPurchased] = useState(false);
  const [message, setMessage] = useState("");

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ""
  });

  useEffect(() => {
    fetchAsset();
    fetchReviews();

    if (user?.id) {
      fetchPurchases();
    }
  }, [id]);

  const fetchAsset = async () => {
    try {
      const res = await API.get(`/assets/${id}`);
      setAsset(res.data);
    } catch (error) {
      setMessage("Failed to load asset.");
    }
  };

  const fetchPurchases = async () => {
    try {
      const res = await API.get(`/purchases/user/${user.id}`);
      const purchasedIds = res.data.map((purchase) => purchase.asset?._id);
      setPurchased(purchasedIds.includes(id));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/asset/${id}`);
      setReviews(res.data.reviews);
      setAverageRating(res.data.averageRating);
      setTotalReviews(res.data.totalReviews);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuy = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!window.ethereum) {
      toast.error("MetaMask is not installed");
      return;
    }

    try {
      toast.info("Opening MetaMask...");

      const { ethers } = await import("ethers");

      const provider = new ethers.BrowserProvider(window.ethereum);

      await window.ethereum.request({
        method: "eth_requestAccounts"
      });

      const network = await provider.getNetwork();

      if (Number(network.chainId) !== 31337) {
        toast.error("Please switch MetaMask to Hardhat Local network.");
        return;
      }

      const signer = await provider.getSigner();
      const buyerWallet = await signer.getAddress();

      const sellerWallet =
        asset.ownerWallet ||
        asset.creatorWallet ||
        asset.creator?.walletAddress;

      if (!sellerWallet) {
        toast.error("Seller wallet address not found for this asset.");
        return;
      }

      if (
        sellerWallet.toLowerCase() === buyerWallet.toLowerCase()
      ) {
        toast.error("You cannot buy your own asset.");
        return;
      }

      const tx = await signer.sendTransaction({
        to: sellerWallet,
        value: ethers.parseEther(String(asset.price))
      });

      toast.info("Transaction submitted. Waiting for confirmation...");

      const receipt = await tx.wait();

      await API.post("/purchases/buy", {
        buyer: user.id,
        asset: id,
        txHash: receipt.hash,
        buyerWallet,
        sellerWallet,
        price: asset.price
      });

      setPurchased(true);
      toast.success("Purchase successful! Asset unlocked.");
    } catch (error) {
      console.log("BLOCKCHAIN BUY ERROR:", error);

      toast.error(
        error.reason ||
          error.shortMessage ||
          error.message ||
          "Blockchain purchase failed"
      );
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first");
      return;
    }

    try {
      await API.post("/reviews/add", {
        user: user.id,
        asset: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });

      toast.success("Review submitted");

      setReviewForm({
        rating: 5,
        comment: ""
      });

      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Review failed");
    }
  };

  if (!asset) {
    return (
      <div style={pageStyle}>
        <h2>{message || "Loading asset..."}</h2>
      </div>
    );
  }

  const isOwnAsset = asset.creator?._id === user?.id;

  return (
    <div style={pageStyle}>
      <button style={backButton} onClick={() => navigate("/explore")}>
        ← Back to Explore
      </button>

      <div style={layoutStyle}>
        <img
          src={`http://localhost:5000/uploads/thumbnails/${asset.thumbnailUrl}`}
          alt={asset.title}
          style={thumbnailStyle}
        />

        <div style={infoCard}>
          <p style={categoryStyle}>{asset.category}</p>

          <h1 style={titleStyle}>{asset.title}</h1>

          <div style={ratingBox}>
            ⭐ {averageRating} / 5 ({totalReviews} reviews)
          </div>

          <p style={descriptionStyle}>{asset.description}</p>

          <div style={metaBox}>
            <p>
              <strong>Creator:</strong> {asset.creator?.name || "Unknown"}
            </p>

            <p>
              <strong>Price:</strong> {asset.price} ETH
            </p>

            {asset.ownerWallet && (
              <p>
                <strong>Owner Wallet:</strong>{" "}
                {asset.ownerWallet.slice(0, 6)}...
                {asset.ownerWallet.slice(-4)}
              </p>
            )}

            {asset.txHash && (
              <p>
                <strong>Mint Tx:</strong>{" "}
                {asset.txHash.slice(0, 8)}...
                {asset.txHash.slice(-6)}
              </p>
            )}
          </div>

          {isOwnAsset ? (
            <button style={disabledButton}>Your Asset</button>
          ) : purchased ? (
            <>
              <button style={purchasedButton}>Purchased</button>

              <a
                href={`http://localhost:5000/api/assets/download/${asset._id}/${user.id}`}
                target="_blank"
                rel="noreferrer"
                style={downloadButton}
              >
                Download Asset
              </a>
            </>
          ) : (
            <button style={buyButton} onClick={handleBuy}>
              Buy Asset with Wallet
            </button>
          )}
        </div>
      </div>

      {purchased && user?.role === "Buyer" && (
        <div style={reviewFormCard}>
          <h2>Write a Review</h2>

          <form onSubmit={handleReviewSubmit}>
            <select
              value={reviewForm.rating}
              onChange={(e) =>
                setReviewForm({
                  ...reviewForm,
                  rating: Number(e.target.value)
                })
              }
              style={inputStyle}
            >
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>

            <textarea
              placeholder="Write your review..."
              value={reviewForm.comment}
              onChange={(e) =>
                setReviewForm({
                  ...reviewForm,
                  comment: e.target.value
                })
              }
              style={textareaStyle}
              required
            />

            <button type="submit" style={buyButton}>
              Submit Review
            </button>
          </form>
        </div>
      )}

      <div style={reviewSection}>
        <h2>Customer Reviews</h2>

        {reviews.length === 0 ? (
          <p style={{ color: "#aaa" }}>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} style={reviewCard}>
              <h3>{review.user?.name}</h3>
              <p>⭐ {review.rating}/5</p>
              <p style={{ color: "#bbb" }}>{review.comment}</p>
            </div>
          ))
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

const backButton = {
  marginBottom: "30px",
  padding: "12px 18px",
  borderRadius: "10px",
  border: "1px solid #333",
  background: "#151515",
  color: "white",
  cursor: "pointer"
};

const layoutStyle = {
  display: "grid",
  gridTemplateColumns: "1.2fr 1fr",
  gap: "40px",
  alignItems: "start"
};

const thumbnailStyle = {
  width: "100%",
  maxHeight: "550px",
  objectFit: "cover",
  borderRadius: "20px",
  border: "1px solid #2a2a2a"
};

const infoCard = {
  background: "#151515",
  borderRadius: "20px",
  padding: "35px",
  border: "1px solid #2a2a2a"
};

const categoryStyle = {
  color: "#aaa"
};

const titleStyle = {
  fontSize: "42px",
  margin: "12px 0"
};

const ratingBox = {
  background: "#101010",
  padding: "12px",
  borderRadius: "12px",
  marginBottom: "20px",
  border: "1px solid #252525"
};

const descriptionStyle = {
  color: "#bbb",
  lineHeight: "1.7",
  marginBottom: "25px"
};

const metaBox = {
  background: "#101010",
  border: "1px solid #252525",
  borderRadius: "14px",
  padding: "18px",
  marginBottom: "25px",
  wordBreak: "break-word"
};

const buyButton = {
  width: "100%",
  padding: "15px",
  borderRadius: "12px",
  border: "none",
  background: "#7c3aed",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "16px"
};

const purchasedButton = {
  ...buyButton,
  background: "#16a34a",
  marginBottom: "12px"
};

const disabledButton = {
  ...buyButton,
  background: "#444",
  cursor: "not-allowed"
};

const downloadButton = {
  display: "block",
  textAlign: "center",
  padding: "15px",
  borderRadius: "12px",
  background: "#ffffff",
  color: "#000",
  textDecoration: "none",
  fontWeight: "bold"
};

const reviewFormCard = {
  background: "#151515",
  padding: "30px",
  borderRadius: "20px",
  border: "1px solid #2a2a2a",
  marginTop: "40px"
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "16px",
  borderRadius: "10px",
  border: "1px solid #333",
  background: "#0f0f0f",
  color: "white"
};

const textareaStyle = {
  ...inputStyle,
  minHeight: "120px",
  resize: "none"
};

const reviewSection = {
  marginTop: "50px"
};

const reviewCard = {
  background: "#151515",
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid #2a2a2a",
  marginTop: "16px"
};

export default AssetDetails;