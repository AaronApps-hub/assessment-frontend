import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminHeader from "../components/Admin/AdminHeader";

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(135deg, #cfebe9, #ededed)",
    fontFamily: "Segoe UI, sans-serif",
    padding: "0",
    boxSizing: "border-box",
  },
  content: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 40, // space for header
    paddingBottom: 40,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    background: "#ffffff",
    padding: "35px 30px",
    borderRadius: 12,
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box",
  },
  title: {
    textAlign: "center",
    marginBottom: 25,
    color: "#0f172a",
    fontSize: 24,
    fontWeight: 600,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    marginBottom: 15,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
    outline: "none",
    transition: "border 0.2s ease",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: 8,
    border: "none",
    background: "#0f766e",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    cursor: "pointer",
    transition: "background 0.2s ease",
    boxSizing: "border-box",
  },
  footer: {
    marginTop: 15,
    fontSize: 13,
    textAlign: "center",
    color: "#6b7280",
  },
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://assessment-backend-production-8042.up.railway.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      login(data.user, data.token);
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <AdminHeader />
      <div style={styles.content}>
        <form onSubmit={handleSubmit} style={styles.card}>
          <h2 style={styles.title}>Welcome Back</h2>

          <input
            style={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => (e.target.style.background = "#115e59")}
            onMouseOut={(e) => (e.target.style.background = "#0f766e")}
          >
            Login
          </button>

          <div style={styles.footer}>Secure access portal</div>
        </form>
      </div>
    </div>
  );
};

export default Login;
