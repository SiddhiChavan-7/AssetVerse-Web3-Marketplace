import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function MyPurchases() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [purchases, setPurchases] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.role !== "Buyer") {
      navigate("/explore");
      return;
    }

    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const res = await API.get(`/purchases/user/${user.id}`);
      setPurchases(res.data);
    } catch (error) {
      setMessage("Failed to load purchases");
    }
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>My Purchases</h1>
        <p style={subtitleStyle}>
          View and securely download your purchased digital assets.
        </p>
      </div>

      <div style={statsGrid}>
        <StatCard title="Total Purchases" value={purchases.length} />
        <StatCard title="Access Type" value="Blockchain" />
        <StatCard title="Assets Owned" value={purchases.length}/>
        <StatCard title="Role" value="Buyer" />
      </div>

      {message && <p style={messageStyle}>{message}</p>}

      <div style={gridStyle}>
        {purchases.length === 0 ? (
          <div style={emptyBox}>
            <h2>No purchases yet</h2>
            <p style={{ color: "#aaa", marginBottom: "20px" }}>
              Explore the marketplace and buy your first digital asset.
            </p>

            <Link to="/explore" style={exploreButton}>
              Explore Assets
            </Link>
          </div>
        ) : (
          purchases.map((purchase) => {
            const asset = purchase.asset;

            if (!asset) return null;

            return (
              <div key={purchase._id} style={cardStyle}>
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

                  <p style={descriptionStyle}>
                    {asset.description}
                  </p>

                  <div style={metaBox}>
                    <p>
                      <strong>Category:</strong> {asset.category}
                    </p>

                    <p>
                      <strong>Price:</strong> {asset.price} MATIC
                    </p>
                    

                   <p>
  <strong>Purchased:</strong>{" "}
  {new Date(purchase.createdAt).toLocaleDateString()}
</p>

{purchase.txHash && (
  <p>
    <strong>Transaction:</strong>{" "}
    {purchase.txHash.slice(0, 10)}...
    {purchase.txHash.slice(-8)}
  </p>
)}

{purchase.buyerWallet && (
  <p>
    <strong>Buyer Wallet:</strong>{" "}
    {purchase.buyerWallet.slice(0, 8)}...
    {purchase.buyerWallet.slice(-6)}
  </p>
)}

{purchase.sellerWallet && (
  <p>
    <strong>Seller Wallet:</strong>{" "}
    {purchase.sellerWallet.slice(0, 8)}...
    {purchase.sellerWallet.slice(-6)}
  </p>
)}

{purchase.price && (
  <p>
    <strong>Paid:</strong> {purchase.price} ETH
  </p>
)}
{purchase.txHash && (
  <p>
    <strong>Transaction:</strong>{" "}
    {purchase.txHash.slice(0, 10)}...
    {purchase.txHash.slice(-8)}
  </p>
)}

{purchase.buyerWallet && (
  <p>
    <strong>Buyer Wallet:</strong>{" "}
    {purchase.buyerWallet.slice(0, 8)}...
    {purchase.buyerWallet.slice(-6)}
  </p>
)}

{purchase.sellerWallet && (
  <p>
    <strong>Seller Wallet:</strong>{" "}
    {purchase.sellerWallet.slice(0, 8)}...
    {purchase.sellerWallet.slice(-6)}
  </p>
)}

{purchase.price && (
  <p>
    <strong>Paid:</strong> {purchase.price} ETH
  </p>
)}
                  </div>
                </div>

                <div style={actionBox}>
                  <Link to={`/asset/${asset._id}`} style={detailsButton}>
                    View Details
                  </Link>

                  <a
                    href={`http://localhost:5000/api/assets/download/${asset._id}/${user.id}`}
                    target="_blank"
                    rel="noreferrer"
                    style={downloadButton}
                  >
                    Download Asset
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div style={statCard}>
      <p style={statTitle}>{title}</p>
      <h2 style={statValue}>{value}</h2>
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

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginBottom: "40px"
};

const statCard = {
  background: "#151515",
  padding: "25px",
  borderRadius: "16px",
  border: "1px solid #2a2a2a"
};

const statTitle = {
  color: "#aaa",
  marginBottom: "10px"
};

const statValue = {
  fontSize: "30px"
};

const messageStyle = {
  color: "#a78bfa",
  marginBottom: "20px"
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

const downloadButton = {
  display: "block",
  textAlign: "center",
  padding: "12px",
  borderRadius: "10px",
  background: "#ffffff",
  color: "#000",
  textDecoration: "none",
  fontWeight: "bold"
};

export default MyPurchases;