import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AssessmentList = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "admin";

  const fetchAssessments = async () => {
    try {
      const res = await fetch("https://assessment-backend-production-8042.up.railway.app/api/assessments", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setAssessments(data);
    } catch (err) {
      console.error("Failed to fetch assessments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assessment?")) return;

    try {
      const res = await fetch(`https://assessment-backend-production-8042.up.railway.app/api/assessments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setAssessments((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading assessments...</p>;
  if (assessments.length === 0) return <p>No assessments found.</p>;

  return (
    <>
      {/* ===== CSS IN SAME FILE ===== */}
      <style>
        {`
        *,
*::before,
*::after {
  box-sizing: border-box;
}

          .table-container {
            width: 100%;
            overflow-x: auto;
          }

          .assessment-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 6px 18px rgba(0,0,0,0.08);
          }

          .assessment-table th {
            text-align: left;
            padding: 14px 16px;
            background: #0f766e;
            color: #ffffff;
            font-weight: 600;
          }

          .assessment-table td {
            padding: 14px 16px;
            border-bottom: 1px solid #e5e7eb;
          }

          .assessment-table tr:hover {
            background: #f9fafb;
          }

          .clickable {
            cursor: pointer;
            color: #2563eb;
            font-weight: 500;
          }

          .btn {
            padding: 6px 10px;
            margin-right: 6px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            color: #fff;
          }

          .btn-view { background: #2563eb; }
          .btn-edit { background: #16a34a; }
          .btn-delete { background: #dc2626; }

          /* ===== MOBILE RESPONSIVE ===== */
@media (max-width: 768px) {

  .assessment-table thead {
    display: none;
  }

  .assessment-table,
  .assessment-table tbody,
  .assessment-table tr,
  .assessment-table td {
    display: block;
    width: 100%;
  }

  .assessment-table tr {
    margin-bottom: 15px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    overflow: hidden;
  }

  .assessment-table td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid #f3f4f6;
  }

  .assessment-table td:last-child {
    border-bottom: none;
  }

  .assessment-table td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #374151;
  }
}


          }
        `}
      </style>

      <div className="table-container">
        <table className="assessment-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Active</th>
              <th>Show Results</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {assessments.map((a) => (
              <tr key={a.id}>
                <td
                  data-label="Title"
                  className="clickable"
                  onClick={() => navigate(`/admin/assessment/${a.id}`)}
                >
                  {a.title}
                </td>

                <td data-label="Description">{a.description}</td>
                <td data-label="Active">{a.is_active ? "Yes" : "No"}</td>
                <td data-label="Show Results">{a.show_results ? "Yes" : "No"}</td>

                <td data-label="Actions">
                  <button
                    className="btn btn-view"
                    onClick={() => navigate(`/take-assessment/${a.id}`)}
                  >
                    View
                  </button>

                  {isAdmin && (
                    <>
                      <button
                        className="btn btn-edit"
                        onClick={() => navigate(`/admin/assessment/${a.id}/edit`)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-delete"
                        onClick={() => handleDelete(a.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AssessmentList;
