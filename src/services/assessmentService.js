
const KEY = "assessments";

export const getAssessments = () => {
  return JSON.parse(localStorage.getItem(KEY)) || [];
};

export const saveAssessment = (assessment) => {
  const data = getAssessments();
  data.push(assessment);
  localStorage.setItem(KEY, JSON.stringify(data));
};

export const deleteAssessment = (id) => {
  const data = getAssessments().filter(a => a.id !== id);
  localStorage.setItem(KEY, JSON.stringify(data));
};
