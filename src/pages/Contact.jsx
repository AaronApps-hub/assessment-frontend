// frontend/src/pages/Contact.jsx
import React from "react";
import AdminHeader from "../components/Admin/AdminHeader";

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f766e, #164e63)",
    fontFamily: "Segoe UI, sans-serif",
    padding: "20px",
    boxSizing: "border-box",
  },
  container: {
    maxWidth: 700,
    margin: "60px auto",
    background: "#fff",
    borderRadius: 16,
    padding: "30px 25px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
  },
  title: {
    fontSize: 26,
    fontWeight: 600,
    marginBottom: 20,
    textAlign: "center",
  },
  infoItem: {
    marginBottom: 15,
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  link: {
    color: "#0f766e",
    textDecoration: "none",
    fontWeight: 500,
  },
  mapWrapper: {
    marginTop: 25,
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  },
  footer: {
    marginTop: 25,
    textAlign: "center",
    fontSize: 14,
    color: "#6b7280",
  },
  icon: {
    width: 20,
    height: 20,
  },
};

const Contact = () => {
  return (
    <>
      <AdminHeader />
      <div style={styles.page}>
        <div style={styles.container}>
          <h2 style={styles.title}>Technical Support & Enquiries</h2>

          {/* Contact info */}
          <div style={styles.infoItem}>
            <img style={styles.icon} src="/icons/email.svg" alt="Email" />
            <a href="mailto:support@system.com" style={styles.link}>
              support@system.com
            </a>
          </div>

          <div style={styles.infoItem}>
            <img style={styles.icon} src="/icons/phone.svg" alt="Phone" />
            <span>+260 123 456 789</span>
          </div>

          <div style={styles.infoItem}>
            <img style={styles.icon} src="/icons/website.svg" alt="Website" />
            <a href="https://www.system.com" target="_blank" rel="noopener noreferrer" style={styles.link}>
              www.system.com
            </a>
          </div>

          {/* Google Map */}
          <div style={styles.mapWrapper}>
            <iframe
              title="Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086406887514!2d-122.41941548468265!3d37.77492927975927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c8b8c69c3%3A0xc8b3d9b78d0c0a8f!2sSan%20Francisco!5e0!3m2!1sen!2sus!4v1670000000000!5m2!1sen!2sus"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>

          <div style={styles.footer}>
            For enquiries or technical support, please use the contacts above. We aim to respond within 24 hours.
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
