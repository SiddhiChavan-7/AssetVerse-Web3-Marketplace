import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Buyer"
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/register", form);

      toast.success(res.data.message || "Registration successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <form style={cardStyle} onSubmit={handleRegister}>
        <h1>Create Account</h1>

        <p style={textStyle}>
          Join AssetVerse as a buyer or creator.
        </p>

        <input
          name="name"
          type="text"
          placeholder="Full Name"
          style={inputStyle}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          style={inputStyle}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          style={inputStyle}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          style={inputStyle}
          onChange={handleChange}
        >
          <option value="Buyer">Buyer</option>
          <option value="Creator">Creator</option>
        </select>

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p style={{ marginTop: "18px", color: "#aaa", textAlign: "center" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#a78bfa", textDecoration: "none" }}
          >
            Login here
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

export default Register;