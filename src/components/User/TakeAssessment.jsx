import { getAssessments } from "../../services/assessmentService";

const TakeAssessment = () => {
  const assessments = getAssessments();

  return (
    <div>
      <h3>Available Assessments</h3>
      {assessments
        .filter(a => a.isActive)
        .map(a => (
          <div key={a.id}>{a.title}</div>
        ))}
    </div>
  );
};

export default TakeAssessment;
