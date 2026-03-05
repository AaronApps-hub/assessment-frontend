import React, { useState } from "react"; 
import { useAuth } from "../../context/AuthContext";

const AssessmentForm = () => {
  const { user, token } = useAuth(); // get token too

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
     console.log("TITLE:", title);
  console.log("DESCRIPTION:", description);

    if (!user || !token) {
      alert("You must be logged in as admin");
      return;
    }

    try {
      const res = await fetch("https://assessment-backend-production-8042.up.railway.app/api/assessments", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // token from context
        },
        body: JSON.stringify({
          title,
          description,
          is_active: isActive ? 1 : 0,
          show_results: showResults ? 1 : 0
        }),
      });


      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      alert(data.message);

      // Reset form
      setTitle("");
      setDescription("");
      setIsActive(true);
      setShowResults(false);

    } catch (error) {
      console.error("Error creating assessment:", error);
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="Assessment title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={styles.input}
      />

      <textarea
        placeholder="Assessment description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={styles.textarea}
      />

      <label style={styles.checkbox}>
        <input
          type="checkbox"
          checked={isActive}
          onChange={() => setIsActive(!isActive)}
        />
        Active
      </label>

      <label style={styles.checkbox}>
        <input
          type="checkbox"
          checked={showResults}
          onChange={() => setShowResults(!showResults)}
        />
        Show results to students
      </label>

      <button type="submit" style={styles.button}>
        Create Assessment
      </button>
    </form>
  );
};

const styles = {
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px", fontSize: "14px" },
  textarea: { padding: "10px", minHeight: "80px", fontSize: "14px" },
  checkbox: { display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" },
  button: { padding: "10px", background: "#222", color: "#fff", border: "none", cursor: "pointer" },
};

export default AssessmentForm;
