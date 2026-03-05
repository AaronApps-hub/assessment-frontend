import logo from "../../images/logo1.jpg";
import logo2 from "../../images/logo2.jpg";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // close menu when clicking outside
  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <header style={styles.header}>
      {/* Logo section */}
      <div style={styles.logoWrap}>
        <img src={logo} alt="logo" style={styles.logoImg} />
        <img src={logo2} alt="logo2" style={styles.logoImg2} />
      </div>

      {/* Right side */}
      <div style={styles.right} ref={menuRef}>
        <span style={styles.user}>{user?.name}</span>
        <div style={styles.userIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#111">
            <circle cx="12" cy="11" r="4" />
            <path d="M6 20c0-2 6-2 6-2s6 0 6 2v1H6v-1z" />
          </svg>
        </div>

        {/* 3 dot menu */}
        <button style={styles.menuBtn} onClick={() => setOpen(!open)}>⋮</button>

        {open && (
          <div style={styles.dropdown}>
            <MenuItem icon={<DashboardIcon />} text="Dashboard" onClick={() => navigate("/admin")} />
            <MenuItem icon={<AccountIcon />} text="Manage Account" onClick={() => navigate("/update-account")} />

            {/* ⭐ ADMIN ONLY REGISTER */}
            {isAdmin && <MenuItem icon={<RegisterIcon />} text="Register User" onClick={() => navigate("/register")} />}

            {/* Developer link */}
            <MenuItem icon={<DeveloperIcon />} text="Developer" onClick={() => navigate("/developer")} />
            
            {/* Contact link */}
            <MenuItem icon={<ContactIcon />} text="Contact" onClick={() => navigate("/contact")} />

            <MenuItem icon={<LogoutIcon />} text="Logout" danger onClick={handleLogout} />
          </div>
        )}
      </div>
    </header>
  );
};

/* ---------- Menu Item ---------- */
const MenuItem = ({ icon, text, onClick, danger }) => (
  <div
    style={{
      ...styles.menuItem,
      color: danger ? "#ef4444" : "#111",
    }}
    onClick={onClick}
  >
    {icon}
    {text}
  </div>
);

/* ---------- Icons ---------- */
const ContactIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor">
    <path d="M2 4h16v12H2V4z" strokeWidth="2" />
    <path d="M2 4l8 7 8-7" strokeWidth="2" />
  </svg>
);

const AccountIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor">
    <circle cx="12" cy="8" r="4" strokeWidth="2" />
    <path d="M4 20c0-4 16-4 16 0" strokeWidth="2" />
  </svg>
);

const RegisterIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor">
    <path d="M12 5v14M5 12h14" strokeWidth="2" />
  </svg>
);

const DashboardIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor">
    <rect x="3" y="3" width="7" height="7" strokeWidth="2" />
    <rect x="12" y="3" width="3" height="7" strokeWidth="2" />
    <rect x="12" y="12" width="3" height="3" strokeWidth="2" />
    <rect x="3" y="12" width="7" height="3" strokeWidth="2" />
  </svg>
);

const DeveloperIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor">
    <path d="M3 12h3v3H3v-3zM9 3h6v6H9V3zM9 15h6v6H9v-6zM15 9h3v3h-3V9z" strokeWidth="2" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor">
    <path d="M9 3H5a2 2 0 00-2 2v8a2 2 0 002 2h4" strokeWidth="2" />
    <path d="M12 8l3 3-3 3" strokeWidth="2" />
    <path d="M15 11H7" strokeWidth="2" />
  </svg>
);

/* ---------- Styles ---------- */
const styles = {
  header: {
    height: 64,
    background: "#fff",
    color: "#111",
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: 0,
  },
  logoImg2: {
    height: 36,
    objectFit: "contain",
  },
  logoImg: {
    width: 36,
    height: 36,
    objectFit: "contain",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    position: "relative",
  },
  user: {
    fontSize: 14,
    opacity: 0.85,
    color: "#111",
  },
  menuBtn: {
    fontSize: 22,
    background: "transparent",
    border: "none",
    color: "#111",
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    top: 48,
    right: 0,
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    minWidth: 190,
    padding: "6px 0",
    zIndex: 999,
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    fontSize: 14,
    cursor: "pointer",
  },
  userIcon: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#e5e7eb",
    marginLeft: 8,
    cursor: "pointer",
  },
};

export default AdminHeader;
