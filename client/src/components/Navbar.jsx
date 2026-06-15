import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { connectWallet, shortenAddress } from "../services/wallet";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [walletAddress, setWalletAddress] = useState(
    localStorage.getItem("walletAddress") || ""
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("walletAddress");
    setWalletAddress("");
    navigate("/login");
  };

  const handleConnectWallet = async () => {
    try {
      const wallet = await connectWallet();

      localStorage.setItem("walletAddress", wallet.address);
      setWalletAddress(wallet.address);

      toast.success("Wallet connected successfully");
    } catch (error) {
      toast.error(error.message || "Wallet connection failed");
    }
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={linkStyle}>Home</Link>
      <Link to="/explore" style={linkStyle}>Explore</Link>

      {token && user?.role === "Creator" && (
        <>
          <Link to="/upload" style={linkStyle}>Upload Asset</Link>
          <Link to="/dashboard" style={linkStyle}>Creator Dashboard</Link>
        </>
      )}

      {token && user?.role === "Buyer" && (
        <>
          <Link to="/purchases" style={linkStyle}>My Purchases</Link>
          <Link to="/wishlist" style={linkStyle}>My Wishlist</Link>
        </>
      )}

      {token && (
        walletAddress ? (
          <button style={walletButton}>
            {shortenAddress(walletAddress)}
          </button>
        ) : (
          <button onClick={handleConnectWallet} style={walletButton}>
            Connect Wallet
          </button>
        )
      )}

      {!token ? (
        <>
          <Link to="/login" style={linkStyle}>Login</Link>
          <Link to="/register" style={linkStyle}>Register</Link>
        </>
      ) : (
        <button onClick={handleLogout} style={logoutButton}>
          Logout
        </button>
      )}
    </nav>
  );
}

const navStyle = {
  width: "100%",
  padding: "20px 40px",
  background: "#111",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "26px",
  boxSizing: "border-box",
  flexWrap: "wrap"
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500"
};

const walletButton = {
  padding: "9px 14px",
  borderRadius: "8px",
  border: "1px solid #333",
  background: "#1a1a1a",
  color: "white",
  cursor: "pointer"
};

const logoutButton = {
  padding: "9px 14px",
  borderRadius: "8px",
  border: "none",
  background: "#ef4444",
  color: "white",
  cursor: "pointer"
};

export default Navbar;