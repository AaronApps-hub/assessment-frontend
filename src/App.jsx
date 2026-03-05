import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TakeAssessment from "./pages/TakeAssessment";
import Login from "./pages/Login";
import UpdateAccount from "./pages/UpdateAccount";
import Register from "./pages/Register";
import Developer from "./pages/Developer";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EditAssessment from "./pages/admin/EditAssessment";
import AssessmentDetail from "./pages/admin/AssessmentDetail.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ===== PUBLIC ===== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Developer" element={<Developer />} />
        <Route path="/Contact" element={<Contact />} />

        {/* ===== UPDATE ACCOUNT (ANY LOGGED-IN USER) ===== */}
        <Route
          path="/update-account"
          element={
            <ProtectedRoute>
              <UpdateAccount />
            </ProtectedRoute>
          }
        />

        {/* ===== DASHBOARD (admin + user allowed) ===== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin", "user"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
       

        {/* ===== ADMIN ONLY ===== */}
        <Route
          path="/admin/assessment/:id"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AssessmentDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/assessment/:id/edit"
          element={
            <ProtectedRoute roles={["admin"]}>
              <EditAssessment />
            </ProtectedRoute>
          }
        />

        {/* ===== ANY LOGGED-IN USER ===== */}
        <Route
          path="/take-assessment/:id"
          element={
            <ProtectedRoute>
              <TakeAssessment />
            </ProtectedRoute>
          }
        />

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
