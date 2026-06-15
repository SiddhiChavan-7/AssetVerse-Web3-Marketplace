import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [assets, setAssets] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.role !== "Creator") {
      navigate("/explore");
      return;
    }

    fetchAssets();
    fetchAnalytics();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await API.get(`/assets/creator/${user.id}`);
      setAssets(res.data);
    } catch (error) {
      toast.error("Failed to load assets");
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await API.get(`/purchases/creator/${user.id}`);
      setAnalytics(res.data);
    } catch (error) {
      toast.error("Failed to load analytics");
    }
  };

  const handleDelete = async (assetId) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;

    try {
      await API.delete(`/assets/${assetId}`);
      toast.success("Asset deleted successfully");
      fetchAssets();
      fetchAnalytics();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const totalValue = assets.reduce(
    (sum, asset) => sum + Number(asset.price || 0),
    0
  );

  const getSoldCount = (assetId) => {
    const found = analytics?.salesByAsset?.find(
      (item) => item.assetId === assetId
    );

    return found?.soldCount || 0;
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Creator Dashboard</h1>

          <p style={subtitleStyle}>
            Welcome, {user?.name}. Manage your assets and track your sales.
          </p>
        </div>

        <Link to="/upload" style={uploadButton}>
          + Upload New Asset
        </Link>
      </div>

      <div style={statsGrid}>
        <StatCard title="Total Assets" value={assets.length} />
        <StatCard title="Listed Value" value={`${totalValue} MATIC`} />
        <StatCard title="Total Sales" value={analytics?.totalSales || 0} />
        <StatCard
          title="Estimated Revenue"
          value={`${analytics?.estimatedRevenue || 0} MATIC`}
        />
      </div>

      {analytics?.topSellingAsset && (
        <div style={topBox}>
          <p style={topLabel}>Top Selling Asset</p>

          <h2 style={{ marginBottom: "8px" }}>
            {analytics.topSellingAsset.title}
          </h2>

          <p style={{ color: "#aaa" }}>
            Sold {analytics.topSellingAsset.soldCount} time(s) • Revenue{" "}
            {analytics.topSellingAsset.revenue} MATIC
          </p>
        </div>
      )}

      <h2 style={sectionTitle}>Your Uploaded Assets</h2>

      <div style={gridStyle}>
        {assets.length === 0 ? (
          <p style={{ color: "#aaa" }}>No assets uploaded yet.</p>
        ) : (
          assets.map((asset) => (
            <div key={asset._id} style={cardStyle}>
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
                    <strong>Sold:</strong> {getSoldCount(asset._id)} time(s)
                  </p>
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
                  Download File
                </a>

                <button
                  onClick={() => handleDelete(asset._id)}
                  style={deleteButton}
                >
                  Delete Asset
                </button>
              </div>
            </div>
          ))
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
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "35px",
  flexWrap: "wrap"
};

const titleStyle = {
  fontSize: "44px",
  marginBottom: "8px"
};

const subtitleStyle = {
  color: "#aaa"
};

const uploadButton = {
  padding: "14px 20px",
  borderRadius: "12px",
  background: "#7c3aed",
  color: "white",
  textDecoration: "none",
  fontWeight: "bold"
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginBottom: "30px"
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

const topBox = {
  background: "#151515",
  border: "1px solid #2a2a2a",
  borderRadius: "18px",
  padding: "25px",
  marginBottom: "40px"
};

const topLabel = {
  color: "#aaa",
  marginBottom: "8px"
};

const sectionTitle = {
  marginBottom: "25px"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "30px"
};

const cardStyle = {
  background: "#151515",
  borderRadius: "18px",
  padding: "20px",
  border: "1px solid #2a2a2a",
  display: "flex",
  flexDirection: "column",
  minHeight: "590px"
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
  fontWeight: "bold",
  marginBottom: "10px"
};

const deleteButton = {
  width: "100%",
  padding: "12px",
  border: "none",
  borderRadius: "10px",
  background: "#ef4444",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold"
};

export default Dashboard;