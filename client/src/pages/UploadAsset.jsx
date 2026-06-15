import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import { mintNFT } from "../services/nftService";

function UploadAsset() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "UI Kit",
    customCategory: "",
    price: "",
    assetFile: null,
    thumbnail: null
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.role !== "Creator") {
      navigate("/explore");
    }
  }, [token, user, navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleAssetFileChange = (e) => {
    setForm({
      ...form,
      assetFile: e.target.files[0]
    });
  };

  const handleThumbnailChange = (e) => {
    setForm({
      ...form,
      thumbnail: e.target.files[0]
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (user?.role !== "Creator") {
      toast.error("Only creators can upload assets.");
      return;
    }

    if (!form.assetFile) {
      toast.error("Please select the main asset file.");
      return;
    }

    if (!form.thumbnail) {
      toast.error("Please select a thumbnail image.");
      return;
    }

    const finalCategory =
      form.category === "Other"
        ? form.customCategory.trim()
        : form.category;

    if (!finalCategory) {
      toast.error("Please enter a custom category.");
      return;
    }

    if (Number(form.price) <= 0) {
      toast.error("Price must be greater than 0.");
      return;
    }

    try {
      setLoading(true);

      toast.info("Minting NFT on blockchain...");

      const metadataURI = `assetverse://${form.title
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")}`;

      const nftResult = await mintNFT(metadataURI);
      const creatorWallet = nftResult.ownerWallet;

      console.log("NFT Result:", nftResult);

      const data = new FormData();

      data.append("title", form.title);
      data.append("description", form.description);
      data.append("category", finalCategory);
      data.append("price", form.price);
      data.append("creator", user?.id || "");
      data.append("assetFile", form.assetFile);
      data.append("thumbnail", form.thumbnail);

      data.append("metadataURI", metadataURI);
      data.append("txHash", nftResult.txHash);
      data.append("contractAddress", nftResult.contractAddress || "");
      data.append("ownerWallet", creatorWallet || "");
      data.append("creatorWallet", creatorWallet);

      const res = await API.post("/assets/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success(res.data.message || "Asset uploaded and NFT minted!");

      setForm({
        title: "",
        description: "",
        category: "UI Kit",
        customCategory: "",
        price: "",
        assetFile: null,
        thumbnail: null
      });
    } catch (error) {
      console.log("UPLOAD ERROR:", error);
      console.log("BACKEND RESPONSE:", error.response?.data);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <form style={cardStyle} onSubmit={handleUpload}>
        <h1>Upload Digital Asset</h1>

        <p style={textStyle}>
          Add your digital product, mint it as an NFT, and save it to AssetVerse.
        </p>

        <input
          name="title"
          style={inputStyle}
          type="text"
          placeholder="Asset Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          style={{ ...inputStyle, minHeight: "120px" }}
          placeholder="Asset Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          style={inputStyle}
          value={form.category}
          onChange={handleChange}
        >
          <option>UI Kit</option>
          <option>Source Code</option>
          <option>AI Prompt</option>
          <option>Music</option>
          <option>3D Model</option>
          <option>Design Asset</option>
          <option>Resume Template</option>
          <option>eBook</option>
          <option>Icon Pack</option>
          <option>Wallpaper</option>
          <option>Other</option>
        </select>

        {form.category === "Other" && (
          <input
            name="customCategory"
            style={inputStyle}
            type="text"
            placeholder="Enter custom category"
            value={form.customCategory}
            onChange={handleChange}
            required
          />
        )}

        <input
          name="price"
          style={inputStyle}
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Price in MATIC (e.g. 0.5)"
          value={form.price}
          onChange={handleChange}
          required
        />

        <label style={labelStyle}>Main Asset File</label>
        <input
          style={inputStyle}
          type="file"
          onChange={handleAssetFileChange}
          required
        />

        <label style={labelStyle}>Thumbnail Image</label>
        <input
          style={inputStyle}
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          required
        />

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Minting & Uploading..." : "Mint NFT & Upload Asset"}
        </button>
      </form>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#0d0d0d",
  color: "white",
  padding: "50px 20px",
  display: "flex",
  justifyContent: "center"
};

const cardStyle = {
  width: "100%",
  maxWidth: "650px",
  background: "#151515",
  padding: "30px",
  borderRadius: "16px",
  border: "1px solid #2a2a2a"
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "16px",
  borderRadius: "10px",
  border: "1px solid #333",
  background: "#0f0f0f",
  color: "white",
  fontSize: "15px",
  boxSizing: "border-box"
};

const labelStyle = {
  display: "block",
  color: "#aaa",
  marginBottom: "8px"
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  background: "#7c3aed",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
  marginTop: "10px"
};

const textStyle = {
  color: "#aaa",
  marginBottom: "30px"
};

export default UploadAsset;