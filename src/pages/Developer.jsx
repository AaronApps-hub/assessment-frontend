import React from "react";
import AdminHeader from "../components/Admin/AdminHeader";
import developerPhoto from "../images/logo.jpg"; // optional, your photo

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f766e, #164e63)",
    fontFamily: "Segoe UI, sans-serif",
    paddingTop: 80, // leave space for header
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingBottom: 50,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: "40px 35px",
    maxWidth: 700,
    width: "90%",
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  systemTitle: {
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 10,
    color: "#0f766e",
  },
  systemDesc: {
    fontSize: 16,
    lineHeight: 1.6,
    color: "#333",
    marginBottom: 25,
  },
  developerSection: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    justifyContent: "center",
    marginTop: 30,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #0f766e",
  },
  developerInfo: {
    textAlign: "left",
  },
  devName: {
    fontSize: 16,
    fontWeight: 600,
  },
  devRole: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  devLink: {
    fontSize: 14,
    color: "#0f766e",
    textDecoration: "none",
    transition: "color 0.2s",
  },
  devLinkHover: {
    color: "#164e63",
  },
};

const Developer = () => {
  return (
    <>
      <AdminHeader />
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.systemTitle}>Assessment Management System</div>
          <div style={styles.systemDesc}>
            This system was designed to efficiently manage assessments, track student progress,
            and streamline reporting for administrators and teachers. It provides secure access
            and a user-friendly interface to ensure smooth daily operations.
          </div>

          <div style={styles.developerSection}>
            <img src={developerPhoto} alt="Developer" style={styles.photo} />
            <div style={styles.developerInfo}>
              <div style={styles.devRole}>Developed by:</div>
              <div style={styles.devName}>ClassicArts Studios</div>
              <a
                href="https://github.com/yourgithub"
                target="_blank"
                rel="noreferrer"
                style={styles.devLink}
              >
                GitHub Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Developer;
