import React from "react";
import AdminHeader from "../../components/Admin/AdminHeader";
import AssessmentForm from "../../components/Admin/AssessmentForm.jsx";
import AssessmentList from "../../components/Admin/AssessmentList.jsx";

// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));

const AdminDashboard = () => {
  const isAdmin = user?.role === "admin";
  const dashboardTitle = isAdmin ? "Admin Dashboard" : "My Dashboard";
  const dashboardSubtitle = isAdmin ? "Manage assessments and view submissions": "My assessments";


  return (
    <>
      {/* TOP HEADER */}
      <AdminHeader />

      {/* PAGE CONTENT */}
      <div style={styles.page}>
        <div style={styles.header}>
          <h2 style={styles.title}>{dashboardTitle}</h2>
          <p style={styles.subtitle}>{dashboardSubtitle}</p>
        </div>

        <div style={styles.content}>
          {/* Show Create Assessment only for admin */}
          {isAdmin && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Create Assessment</h3>
              <AssessmentForm />
            </div>
          )}

          {/* Show Assessment List for everyone */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Assessment List</h3>
            {/* Pass canEdit prop based on role */}
            <AssessmentList canEdit={isAdmin} />
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f8",
    padding: "20px",
    marginTop: "60px",
  },
  header: {
    marginBottom: "20px",
  },
  title: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "600",
    color: "#222",
  },
  subtitle: {
    marginTop: "5px",
    color: "#666",
    fontSize: "14px",
  },
  content: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  cardTitle: {
    marginBottom: "15px",
    fontSize: "18px",
    color: "#333",
  },
};

export default AdminDashboard;
