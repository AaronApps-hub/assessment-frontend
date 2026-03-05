import React, { useEffect, useState } from "react";
import AdminHeader from "../components/Admin/AdminHeader";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function TakeAssessment() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [percent, setPercent] = useState(0); // animated percentage
  const [timeLeft, setTimeLeft] = useState(0); // in seconds

  // Fetch assessment and previous attempts
  useEffect(() => {
    const fetchAssessment = async () => {
      if (!token) return setLoading(false);

      try {
        const [assessmentRes, attemptRes] = await Promise.all([
          fetch(`https://assessment-backend-production-8042.up.railway.app/api/assessments/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`https://assessment-backend-production-8042.up.railway.app/api/attempts/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!assessmentRes.ok) throw new Error(await assessmentRes.text());
        if (!attemptRes.ok) throw new Error(await attemptRes.text());

        const assessmentData = await assessmentRes.json();
        const attemptData = await attemptRes.json();

        setAssessment(assessmentData.assessment);
        setQuestions(assessmentData.questions || []);

        // Initialize timer if duration is provided
        if (assessmentData.assessment.duration) {
          setTimeLeft(assessmentData.assessment.duration * 60);
        }

        // Load previous answers if any
        if (attemptData.hasAttempt) {
          const loadedAnswers = {};
          attemptData.answers.forEach(a => {
            loadedAnswers[a.question_id] = a.selected_option_id;
          });
          setAnswers(loadedAnswers);
          setSubmitted(true);
          setScore(attemptData.attempt.score);

          // animate percentage
          const finalPercent = Math.round(
            (attemptData.attempt.score / assessmentData.questions.length) * 100
          );
          setPercent(finalPercent);
        }

      } catch (err) {
        console.error(err);
        alert("Failed to load assessment: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id, token]);

  // Timer countdown
  useEffect(() => {
    if (!timeLeft || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (loading) return <Centered text="Loading assessment..." />;

  if (!assessment || questions.length === 0)
    return <Centered text="No questions found." />;

  const visibleQuestions = questions.slice(currentIndex, currentIndex + 2);

  const selectAnswer = (qid, optionId) => {
    setAnswers({ ...answers, [qid]: optionId });
  };

  const handleSubmit = async () => {
    if (submitted) return; // prevent multiple submits

    let totalCorrect = 0;
    questions.forEach((q) => {
      const selected = answers[q.id];
      if (q.options.find((o) => o.id === selected && o.is_correct)) {
        totalCorrect++;
      }
    });

    try {
      const answersPayload = Object.entries(answers).map(
        ([questionId, optionId]) => ({
          question_id: Number(questionId),
          selected_option_id: optionId,
        })
      );

      const res = await fetch("https://assessment-backend-production-8042.up.railway.app/api/attempts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assessment_id: id,
          score: totalCorrect,
          answers: answersPayload,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

    } catch (err) {
      console.error("Saving attempt failed:", err);
      alert("Failed to save attempt");
    }

    setScore(totalCorrect);
    setSubmitted(true);

    // Animate percentage circle
    const finalPercent = Math.round((totalCorrect / questions.length) * 100);
    let count = 0;

    const interval = setInterval(() => {
      count++;
      if (count > finalPercent) clearInterval(interval);
      else setPercent(count);
    }, 20);
  };

  // Result screen
  if (submitted) {
    const radius = 70;
    const stroke = 10;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset =
      circumference - (percent / 100) * circumference;

    return (
      <>
        <AdminHeader />
        <div style={styles.page}>
          <div style={styles.card}>
            <h2 style={styles.title}>{assessment.title} - Results</h2>
            <div style={styles.resultCard}>
              <svg height={radius * 2} width={radius * 2}>
                <circle
                  stroke="#e5e7eb"
                  fill="transparent"
                  strokeWidth={stroke}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />
                <circle
                  stroke="#16a34a"
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  strokeDasharray={circumference + " " + circumference}
                  style={{ strokeDashoffset, transition: "stroke-dashoffset 0.3s linear" }}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />
                <text
                  x="50%"
                  y="50%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fontSize="24"
                  fontWeight="600"
                  fill="#111"
                >
                  {percent}%
                </text>
              </svg>
              <p style={styles.scoreText}>
                You scored {score} out of {questions.length}
              </p>
              <button style={styles.backButton} onClick={() => navigate(-1)}>
                Back
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Question screen
  return (
    <>
      <AdminHeader />
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.title}>{assessment.title}</h2>
          <div style={styles.points}>
              {/* Duration */}
              <div style={styles.point}>
                <span style={styles.icon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 7v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
                {assessment.duration || 0} Minutes
              </div>

              {/* Questions */}
              <div style={styles.point}>
                <span style={styles.icon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
                {questions.length} Questions
              </div>

              {/* Status */}
              <div style={styles.point}>
                Status: {assessment.is_active ? "Active" : "Inactive"}
              </div>
            </div>



          {/* Timer display */}
          {!submitted && (
            <div
              style={{
                marginBottom: 16,
                fontWeight: 600,
                color: timeLeft <= 300 ? "#b91c1c" : "#16a34a",
                fontSize: 16, background:"#f4f5b5", padding:"8px", margin:"0px",
              }}
            >
              Time Remaining: {formatTime(timeLeft)}
            </div>
          )}

          {visibleQuestions.map((q, i) => (
            <div key={q.id} style={styles.questionCard}>
              <p>
                {currentIndex + i + 1}. {q.question_text}
              </p>

              {q.options.map((o) => (
                <label key={o.id} style={styles.option}>
                  <input
                    type="radio"
                    checked={answers[q.id] === o.id}
                    onChange={() => selectAnswer(q.id, o.id)}
                  />
                  {o.option_text}
                </label>
              ))}
            </div>
          ))}

          <div style={styles.navRow}>
            <button
              style={styles.secondaryBtn}
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 2))}
            >
              Previous
            </button>

            {currentIndex + 2 >= questions.length ? (
              <button style={styles.successBtn} onClick={handleSubmit}>
                Submit
              </button>
            ) : (
              <button
                style={styles.primaryBtn}
                onClick={() => setCurrentIndex(currentIndex + 2)}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Center helper
function Centered({ children, text }) {
  return (
    <div style={styles.centerWrap}>{text ? <p>{text}</p> : children}</div>
  );
}

// Styles (unchanged)
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #eef2ff, #f9fafb)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 700,
    background: "#ffffff",
    padding: "28px 32px",
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  title: { margin: 0, fontSize: 24, fontWeight: 700, color: "#111827" , padding:"0"},
  resultCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 18,
    padding: "24px 20px",
    borderRadius: 14,
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
  },
points: {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "0",
  marginTop: "0",
},

point: {
  display: "flex",
  alignItems: "center",
  padding: "5px 14px",
  background: "#f9fafb",
  border: "1px solid #e5e7eb", 
  fontWeight: 600,
  fontSize: "14px",
  color: "#111827",
  transition: "all 0.2s ease",
  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
},

icon: {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  borderRadius: "8px",
  background: "#eef2ff",
  color: "#2563eb",
  flexShrink: 0,
},

  scoreText: { fontSize: 18, fontWeight: 600, color: "#111827", textAlign: "center", margin: 0 },
  backButton: { marginTop: 6, padding: "10px 18px", borderRadius: 8, border: "none", fontWeight: 600, background: "#2563eb", color: "#fff", cursor: "pointer", transition: "all 0.2s ease" },
  questionCard: { border: "1px solid #e5e7eb", borderRadius: 10, padding: 14, background: "#fafafa" },
  option: { display: "flex", gap: 8, marginTop: 8, cursor: "pointer" },
  navRow: { display: "flex", justifyContent: "space-between", marginTop: 20 },
  primaryBtn: { background: "#2563eb", color: "#fff", border: "none", padding: "10px 16px", borderRadius: 8, fontWeight: 600, cursor: "pointer" },
  secondaryBtn: { background: "#e5e7eb", border: "none", padding: "10px 16px", borderRadius: 8, fontWeight: 600, cursor: "pointer" },
  successBtn: { background: "#16a34a", color: "#fff", border: "none", padding: "10px 16px", borderRadius: 8, fontWeight: 600, cursor: "pointer" },
  centerWrap: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" },
};
