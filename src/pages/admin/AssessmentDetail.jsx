import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminHeader from "../../components/Admin/AdminHeader";

const AssessmentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // assessment_id
  const { token } = useAuth();

  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // New question form state
  const [questionText, setQuestionText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  // Fetch assessment with questions & options
  const fetchAssessment = async () => {
    try {
      const res = await fetch(`https://assessment-backend-production-8042.up.railway.app/api/assessments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setAssessment(data.assessment);
      setQuestions(data.questions || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load assessment: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessment();
  }, [id]);

  // Add question
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!questionText.trim()) return alert("Question text is required");

    try {
      const res = await fetch(`https://assessment-backend-production-8042.up.railway.app/api/assessments/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assessment_id: id,
          question_text: questionText,
          image_url: imageUrl,
          video_url: videoUrl,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      setQuestions((prev) => [...prev, { ...data.question, options: [] }]);
      setQuestionText("");
      setImageUrl("");
      setVideoUrl("");
    } catch (err) {
      console.error(err);
      alert("Failed to add question: " + err.message);
    }
  };

  // Edit question
  const handleEditQuestion = async (qId, updatedText, updatedImage, updatedVideo) => {
    try {
      const res = await fetch(`https://assessment-backend-production-8042.up.railway.app/api/assessments/questions/${qId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question_text: updatedText,
          image_url: updatedImage,
          video_url: updatedVideo,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      await res.json();

      setQuestions((prev) =>
        prev.map((q) =>
          q.id === qId ? { ...q, question_text: updatedText, image_url: updatedImage, video_url: updatedVideo } : q
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to edit question: " + err.message);
    }
  };

  // Delete question
  const handleDeleteQuestion = async (qId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;

    try {
      const res = await fetch(`https://assessment-backend-production-8042.up.railway.app/api/assessments/questions/${qId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      await res.json();

      setQuestions((prev) => prev.filter((q) => q.id !== qId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete question: " + err.message);
    }
  };

  // Add option
  const handleAddOption = async (questionId, optionText, isCorrect) => {
    if (!optionText.trim()) return alert("Option text is required");

    try {
      const res = await fetch(`https://assessment-backend-production-8042.up.railway.app/api/assessments/options`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question_id: questionId, option_text: optionText, is_correct: isCorrect }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? { ...q, options: [...(q.options || []), data.option] } : q))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to add option: " + err.message);
    }
  };

  // Edit option
  const handleEditOption = async (optionId, optionText, isCorrect, questionId) => {
    try {
      const res = await fetch(`https://assessment-backend-production-8042.up.railway.app/api/assessments/options/${optionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ option_text: optionText, is_correct: isCorrect }),
      });
      if (!res.ok) throw new Error(await res.text());
      await res.json();

      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? {
                ...q,
                options: q.options.map((o) =>
                  o.id === optionId ? { ...o, option_text: optionText, is_correct: isCorrect } : o
                ),
              }
            : q
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to edit option: " + err.message);
    }
  };

  // Delete option
  const handleDeleteOption = async (optionId, questionId) => {
    if (!window.confirm("Are you sure you want to delete this option?")) return;

    try {
      const res = await fetch(`https://assessment-backend-production-8042.up.railway.app/api/assessments/options/${optionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      await res.json();

      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId ? { ...q, options: q.options.filter((o) => o.id !== optionId) } : q
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete option: " + err.message);
    }
  };

  if (loading) return <p>Loading assessment...</p>;
  if (!assessment) return <p>Assessment not found</p>;

  return (
    <>
    {/* TOP HEADER */}
      <AdminHeader />
    <div style={styles.container}>
      <p>{assessment.description}</p>

      <div style={{ margin: "15px 0" }}>
        <div style={{ margin: "15px 0", display: "flex", gap: 10 }}>
        <button
          style={styles.iconActionBtn}
          title="Take Assessment"
          onClick={() => navigate(`/take-assessment/${assessment.id}`)}
        >
          {/* Play icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M10.804 8 5 11.803V4.197L10.804 8z"/>
          </svg>  Play
        </button>

        <button
          style={{ ...styles.iconActionBtn, background: "#16a34a" }}
          title="Open Assessment"
          onClick={() => alert("Assessment opened for students")}
        >
          {/* Eye icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
            <path d="M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
          </svg>  View
        </button>
      </div>

      </div>

      {/* Add Question */}
      <div style={styles.card}>
        <h3 style={{ marginBottom: 12 }}>Add Question</h3>
        <form onSubmit={handleAddQuestion} style={styles.form}>
          <textarea
            placeholder="Question text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            style={styles.textarea}
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Video URL (optional)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.addBtn}>
            Add Question
          </button>
        </form>
      </div>

      {/* Questions List */}
      <div style={styles.card}>
      <div style={styles.sectionHeader}>Questions</div>

      <div style={styles.cardBody}>


        {questions.length === 0 && <p>No questions yet.</p>}
        {questions.map((q) => (
          <div key={q.id} style={styles.questionCard}>
            <div style={styles.questionHeader}>
              <strong>{q.question_text}</strong>
              <div style={styles.btnGroup}>
                <button style={styles.editBtn} onClick={() => {
                  const newText = prompt("Edit question text", q.question_text);
                  if (!newText) return;
                  handleEditQuestion(q.id, newText, q.image_url, q.video_url);
                }}>
                  Edit
                </button>

                <button style={styles.deleteBtn} onClick={() => handleDeleteQuestion(q.id)}>
                  Delete
                </button>
              </div>

            </div>
            {q.image_url && <p>[Image: {q.image_url}]</p>}
            {q.video_url && <p>[Video: {q.video_url}]</p>}

            {/* Options */}
            <ul style={styles.optionList}>
              {q.options.map((o) => (
                  <li  key={o.id} style={styles.optionRow}>

                  <span>
                    {o.option_text}
                    {o.is_correct && <span style={styles.correctBadge}>Correct</span>}
                  </span>

                  <div style={styles.btnGroup}>
                    <button
                      style={styles.iconBtn}
                      onClick={() => {
                        const newText = prompt("Edit option text", o.option_text);
                        if (newText === null) return;
                        const newCorrect = window.confirm("Is this the correct option?");
                        handleEditOption(o.id, newText, newCorrect, q.id);
                      }}
                      title="Edit Option"
                    >
                      {/* Pencil Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708L4.207 14.793l-3 1a.5.5 0 0 1-.637-.637l1-3L12.146.854zM11.207 3L3 11.207V13h1.793L13 4.793 11.207 3z"/>
                      </svg>
                    </button>

                    {/* Delete option button */}
                    <button
                      style={{ ...styles.iconBtn, background: "#dc2626" }}
                      onClick={() => handleDeleteOption(o.id, q.id)}
                      title="Delete Option"
                    >
                      {/* Trash Icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5zm1 3A.5.5 0 0 1 7 8h2a.5.5 0 0 1 0 1H7a.5.5 0 0 1-.5-.5zM14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2h13v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 2V1h11v1h-11z"/>
                      </svg>
                    </button>
                  </div>

                </li>
              ))}
            </ul>

            {/* Add Option */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const optionText = e.target.option_text.value;
                const isCorrect = e.target.is_correct.checked;
                handleAddOption(q.id, optionText, isCorrect);
                e.target.reset();
              }}
              style={styles.optionForm}
            >
              <input name="option_text" placeholder="Option text" style={styles.optionInput}/>

              <label style={styles.checkboxLabel}>
                <input type="checkbox" name="is_correct" /> Correct
              </label>
              <button type="submit" style={styles.addOptionBtn}> Add Option </button>

            </form>
          </div>
        ))}
        </div>
      </div>
    </div>
    </>
  );
};

const styles = {
  container: {
    padding: 24,
    minHeight: "100vh",
    background: "#f4f6f8",
  },

card: {
    background: "#ffffff",
    borderRadius: 12,
    marginBottom: 24,
    padding: 20, // <-- add this
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
},


  sectionHeader: {
    padding: "14px 18px",
    background: "#0f766e",
    color: "#ffffff",
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: "0.3px",
  },

  cardBody: {
    padding: 18,
  },

  questionCard: {
    padding: 14,
    border: "1px solid #e5e7eb",
    marginBottom: 12,
    borderRadius: 8,
    background: "#fafafa",
    transition: "all 0.15s ease",
  },

  form: { display: "flex", flexDirection: "column", gap: 10 },

  input: {
    padding: 10,
    fontSize: 14,
    borderRadius: 6,
    border: "1px solid #d1d5db",
  },

  textarea: {
    padding: 10,
    fontSize: 14,
    minHeight: 60,
    borderRadius: 6,
    border: "1px solid #d1d5db",
  },

  addBtn: {
    padding: 10,
    background: "#16a34a",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: 6,
    fontWeight: 500,
  },

  actionBtn: {
    padding: "10px 15px",
    marginRight: 10,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: 6,
    fontWeight: 500,
  },
  questionHeader: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 8,
},

btnGroup: {
  display: "flex",
  gap: 6,
},

editBtn: {
  padding: "6px 10px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 13,
},

deleteBtn: {
  padding: "6px 10px",
  background: "#dc2626",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 13,
},

optionList: {
  listStyle: "none",
  padding: 0,
  marginTop: 8,
},

optionRow: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  background: "#fff",
  marginBottom: 6,
},

correctBadge: {
  marginLeft: 8,
  background: "#16a34a",
  color: "#fff",
  padding: "2px 6px",
  borderRadius: 4,
  fontSize: 11,
},

optionForm: {
  display: "flex",
  gap: 8,
  marginTop: 8,
  alignItems: "center",
},

checkboxLabel: {
  display: "flex",
  alignItems: "center",
  gap: 4,
  fontSize: 13,
},

optionInput: {
  flex: 1,
  padding: 8,
  borderRadius: 6,
  border: "1px solid #d1d5db",
},

addOptionBtn: {
  padding: "8px 12px",
  background: "#16a34a",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
},
iconBtn: {
  padding: "6px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
},

iconActionBtn: {
  padding: "8px 10px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
},
iconBtn: {
  padding: "6px 8px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  background: "#2563eb", // default blue
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
},



};


export default AssessmentDetail;
