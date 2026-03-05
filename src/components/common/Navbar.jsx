// src/components/common/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css"; // make sure this file exists

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <span className="brand">Assessment System</span>

      {user && (
        <div className="nav-links">
          {user.role === "admin" && <Link to="/admin">Admin</Link>}
          {user.role === "student" && <Link to="/user">User</Link>}
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
