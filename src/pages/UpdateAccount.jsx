import React, { useState, useEffect } from "react";
import AdminHeader from "../components/Admin/AdminHeader";
import { useAuth } from "../context/AuthContext";

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #cfebe9, #ededed)",
    fontFamily: "Segoe UI, sans-serif",
    padding: "0px",
    display: "flex",
    flexDirection: "column",
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
  message: {
    marginTop: 15,
    fontSize: 14,
    color: "green",
  },
  error: {
    marginTop: 15,
    fontSize: 14,
    color: "red",
  },
  loading: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontSize: 18,
  },
};

const UpdateAccount = () => {
  const { user, token, loading } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Pre-fill form after user data is available
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("You are not logged in!");
      return;
    }

    try {
      const res = await fetch("https://assessment-backend-production-8042.up.railway.app/api/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(data.message);
      } else {
        setError(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error occurred");
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <AdminHeader />
      <div style={styles.content}>
        <form style={styles.card} onSubmit={handleSubmit}>
          <h2 style={styles.title}>Update Account</h2>

          <input
            name="name"
            placeholder="Name"
            value={form.name}
            style={styles.input}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            style={styles.input}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="New Password (optional)"
            value={form.password}
            style={styles.input}
            onChange={handleChange}
          />

          <button type="submit" style={styles.button}>
            Update
          </button>

          {message && <div style={styles.message}>{message}</div>}
          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.footer}>Update your account information</div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAccount;
