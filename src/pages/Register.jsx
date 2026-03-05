import React, { useState } from "react";
import AdminHeader from "../components/Admin/AdminHeader";
import { useAuth } from "../context/AuthContext";

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(135deg, #cfebe9, #ededed)",
    fontFamily: "Segoe UI, sans-serif",
    padding: "0px",
  },
  content: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 40,
    paddingBottom: 40,
  },
  card: {
    width: "100%",
    maxWidth: 450,
    background: "#ffffff",
    padding: "40px 35px",
    borderRadius: 16,
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    marginBottom: 25,
    fontSize: 24,
    fontWeight: 600,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    marginBottom: 15,
    borderRadius: 10,
    border: "1px solid #d1d5db",
  },
  select: {
    width: "100%",
    padding: "12px 14px",
    marginBottom: 20,
    borderRadius: 10,
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: 10,
    border: "none",
    background: "#0f766e",
    color: "#fff",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
    fontSize: 13,
  },
};

const Register = () => {
  const { user } = useAuth();
  const isAdmin = user && user.role === "admin";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      role: isAdmin ? form.role : "user",
    };

    try {
      const res = await fetch("https://assessment-backend-production-8042.up.railway.app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to register");
    }
  };

  return (
    <div style={styles.container}>
      <AdminHeader />
      <div style={styles.content}>
        <form style={styles.card} onSubmit={handleSubmit}>
          <h2 style={styles.title}>Register</h2>

          <input
            name="name"
            placeholder="Name"
            style={styles.input}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            placeholder="Email"
            style={styles.input}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            style={styles.input}
            onChange={handleChange}
            required
          />

          {isAdmin ? (
            <select name="role" style={styles.select} onChange={handleChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          ) : (
            <input type="hidden" value="user" />
          )}

          <button type="submit" style={styles.button}>
            Register
          </button>

          <div style={styles.footer}>Secure access portal</div>
        </form>
      </div>
    </div>
  );
};

export default Register;
