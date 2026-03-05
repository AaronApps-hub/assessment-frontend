import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminHeader from "../../components/Admin/AdminHeader";

const EditAssessment = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    is_active: 1,
    show_results: 0,
  });

  // Load assessment
  useEffect(() => {
    const loadAssessment = async () => {
      try {
        const res = await fetch(
          `https://assessment-backend-production-8042.up.railway.app/api/assessments/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setForm({
          title: data.assessment.title || "",
          description: data.assessment.description || "",
          is_active: data.assessment.is_active,
          show_results: data.assessment.show_results,
        });

      } catch (err) {
        alert("Failed to load assessment");
        navigate("/admin");
      }
    };

    if (token) loadAssessment();
  }, [id, token, navigate]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `https://assessment-backend-production-8042.up.railway.app/api/assessments/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      alert(data.message);

      // redirect after update
      navigate("/admin");

    } catch (err) {
      alert("Update failed");
      navigate("/admin");
    }
  };

  return (
    <>
    {/* TOP HEADER */}
      <AdminHeader />
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Edit Assessment</h2>

        <label style={styles.label}>Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <div style={styles.checkboxRow}>
          <label style={styles.checkbox}>
            <input
              type="checkbox"
              name="is_active"
              checked={!!form.is_active}
              onChange={handleChange}
            />
            Active
          </label>

          <label style={styles.checkbox}>
            <input
              type="checkbox"
              name="show_results"
              checked={!!form.show_results}
              onChange={handleChange}
            />
            Show Results
          </label>
        </div>

        <button type="submit" style={styles.button}>
          Update Assessment
        </button>
      </form>
    </div>
    </>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "500px",
    background: "#fff",
    padding: "28px",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  title: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "600",
  },

  label: {
    fontSize: "14px",
    fontWeight: "500",
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
  },

  textarea: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    minHeight: "90px",
  },

  checkboxRow: {
    display: "flex",
    gap: "20px",
  },

  checkbox: {
    display: "flex",
    gap: "6px",
  },

  button: {
    marginTop: "16px",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#134e4a",
    color: "#fff",
    cursor: "pointer",
  },
};

export default EditAssessment;
