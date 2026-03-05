// src/pages/UserDashboard.jsx
import React from "react";
import TakeAssessment from "../components/User/TakeAssessment";

const UserDashboard = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>User Dashboard</h2>
      <TakeAssessment />
    </div>
  );
};

export default UserDashboard;
