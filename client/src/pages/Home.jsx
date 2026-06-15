import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Home() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetchFeaturedAssets();
  }, []);

  const fetchFeaturedAssets = async () => {
    try {
      const res = await API.get("/assets");
      setAssets(res.data.slice(0, 3));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={pageStyle}>
      <section style={heroStyle}>
        <div style={badgeStyle}>Secure Digital Asset Marketplace</div>

        <h1 style={titleStyle}>
          Buy, Sell & Own <span style={highlightStyle}>Digital Assets</span>
        </h1>

        <p style={subtitleStyle}>
          A premium marketplace where creators securely sell templates, source
          code, AI prompts, wallpapers, design assets, music, and more.
        </p>

        <div style={buttonWrapper}>
          <Link to="/explore" style={primaryButton}>
            Explore Marketplace
          </Link>

          <Link to="/upload" style={secondaryButton}>
            Start Selling
          </Link>
        </div>
      </section>

      <section style={statsSection}>
        <StatCard title="Assets Listed" value={assets.length} />
        <StatCard title="Secure Downloads" value="Protected" />
        <StatCard title="Marketplace Status" value="Live" />
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitle}>How AssetVerse Works</h2>

        <div style={gridStyle}>
          <InfoCard
            title="Upload Assets"
            text="Creators upload digital products with custom pricing and thumbnail previews."
          />

          <InfoCard
            title="Sell Securely"
            text="Role-based access, creator dashboards, secure ownership flow, and protected asset management."
          />

          <InfoCard
            title="Buy & Download"
            text="Buyers purchase digital products and gain secure download access only after purchase."
          />
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionTitle}>Featured Assets</h2>

        <div style={gridStyle}>
          {assets.length === 0 ? (
            <p style={{ color: "#aaa" }}>No assets uploaded yet.</p>
          ) : (
            assets.map((asset) => (
              <div key={asset._id} style={assetCard}>
                {asset.thumbnailUrl ? (
                  <img
                    src={`http://localhost:5000/uploads/thumbnails/${asset.thumbnailUrl}`}
                    alt={asset.title}
                    style={thumbnailStyle}
                  />
                ) : (
                  <div style={assetPreview}>Digital Asset</div>
                )}

                <h3 style={assetTitle}>{asset.title}</h3>

                <p style={assetCategory}>{asset.category}</p>

                <p style={assetPrice}>{asset.price} MATIC</p>
              </div>
            ))
          )}
        </div>
      </section>

      <section style={ctaSection}>
        <h2 style={{ marginBottom: "15px" }}>
          Ready to start your digital marketplace journey?
        </h2>

        <p style={ctaText}>
          Browse premium assets or become a creator and monetize your digital work.
        </p>

        <Link to="/explore" style={primaryButton}>
          Visit Marketplace
        </Link>
      </section>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div style={statCard}>
      <h3 style={statValue}>{value}</h3>
      <p style={statLabel}>{title}</p>
    </div>
  );
}

function InfoCard({ title, text }) {
  return (
    <div style={infoCard}>
      <h3 style={{ marginBottom: "12px" }}>{title}</h3>
      <p style={infoText}>{text}</p>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #050505 0%, #0d0d0d 45%, #121212 100%)",
  color: "white",
  padding: "60px 50px",
  animation: "fadeIn 0.8s ease-in-out"
};

const heroStyle = {
  textAlign: "center",
  maxWidth: "950px",
  margin: "0 auto",
  padding: "80px 20px"
};

const badgeStyle = {
  display: "inline-block",
  padding: "10px 18px",
  borderRadius: "30px",
  background: "rgba(255,255,255,0.04)",
  color: "#d1d5db",
  border: "1px solid rgba(255,255,255,0.08)",
  marginBottom: "25px",
  backdropFilter: "blur(8px)"
};

const titleStyle = {
  fontSize: "64px",
  lineHeight: "1.1",
  marginBottom: "25px"
};

const highlightStyle = {
  color: "#f5f5f5"
};

const subtitleStyle = {
  fontSize: "20px",
  color: "#aaa",
  maxWidth: "760px",
  margin: "0 auto 35px",
  lineHeight: "1.6"
};

const buttonWrapper = {
  display: "flex",
  justifyContent: "center",
  gap: "18px",
  flexWrap: "wrap"
};

const primaryButton = {
  background: "#ffffff",
  color: "#000",
  padding: "14px 24px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: "bold"
};

const secondaryButton = {
  background: "#151515",
  color: "white",
  padding: "14px 24px",
  borderRadius: "12px",
  textDecoration: "none",
  border: "1px solid #2a2a2a",
  fontWeight: "bold"
};

const statsSection = {
  display: "flex",
  justifyContent: "center",
  gap: "25px",
  flexWrap: "wrap",
  marginBottom: "80px"
};

const statCard = {
  background: "rgba(20,20,20,0.95)",
  border: "1px solid #242424",
  borderRadius: "18px",
  padding: "28px",
  minWidth: "230px",
  textAlign: "center",
  boxShadow: "0 0 25px rgba(255,255,255,0.03)"
};

const statValue = {
  fontSize: "28px",
  marginBottom: "8px"
};

const statLabel = {
  color: "#aaa"
};

const sectionStyle = {
  maxWidth: "1200px",
  margin: "0 auto 90px"
};

const sectionTitle = {
  fontSize: "38px",
  marginBottom: "35px",
  textAlign: "center"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "28px"
};

const infoCard = {
  background: "rgba(18,18,18,0.96)",
  border: "1px solid #252525",
  borderRadius: "18px",
  padding: "28px",
  boxShadow: "0 0 20px rgba(255,255,255,0.02)"
};

const infoText = {
  color: "#aaa",
  lineHeight: "1.7"
};

const assetCard = {
  background: "rgba(18,18,18,0.96)",
  border: "1px solid #252525",
  borderRadius: "18px",
  padding: "20px",
  boxShadow: "0 0 20px rgba(255,255,255,0.02)"
};

const thumbnailStyle = {
  width: "100%",
  height: "180px",
  objectFit: "cover",
  borderRadius: "14px",
  marginBottom: "16px",
  background: "#222"
};

const assetPreview = {
  height: "180px",
  borderRadius: "14px",
  background: "linear-gradient(135deg, #111111, #2a2a2a)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#bdbdbd",
  marginBottom: "16px"
};

const assetTitle = {
  fontSize: "22px",
  marginBottom: "10px"
};

const assetCategory = {
  color: "#aaa",
  marginBottom: "8px"
};

const assetPrice = {
  fontWeight: "bold"
};

const ctaSection = {
  textAlign: "center",
  background: "rgba(15,15,15,0.98)",
  border: "1px solid #252525",
  borderRadius: "24px",
  padding: "60px 20px",
  maxWidth: "1000px",
  margin: "0 auto",
  boxShadow: "0 0 30px rgba(255,255,255,0.03)"
};

const ctaText = {
  color: "#aaa",
  marginBottom: "30px",
  fontSize: "18px"
};

export default Home;