import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful!");

      setTimeout(() => {
        if (res.data.user.role === "Creator") {
          navigate("/dashboard");
        } else {
          navigate("/explore");
        }
      }, 800);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <form style={cardStyle} onSubmit={handleLogin}>
        <h1>Login</h1>
        <p style={textStyle}>Access your AssetVerse account.</p>

        <input
          name="email"
          style={inputStyle}
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          style={inputStyle}
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{ marginTop: "18px", color: "#aaa", textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            style={{ color: "#a78bfa", textDecoration: "none" }}
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#0d0d0d",
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px"
};

const cardStyle = {
  width: "100%",
  maxWidth: "420px",
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
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  background: "#7c3aed",
  color: "white",
  fontSize: "16px",
  cursor: "pointer"
};

const textStyle = {
  color: "#aaa",
  marginBottom: "25px"
};

export default Login;