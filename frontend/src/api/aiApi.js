import api from "./axios";

export async function analyzeResume() {
  const response = await api.post("/ai/resume-review");
  return response.data;
}

export async function getLatestResumeReview() {
  const response = await api.get("/ai/resume-review/latest");
  return response.data;
}

export async function analyzeSkillGap() {
  const response = await api.post("/ai/skill-gap");
  return response.data;
}

export async function getLatestSkillGap() {
  const response = await api.get("/ai/skill-gap/latest");
  return response.data;
}

export async function generateRoadmap() {
  const response = await api.post("/ai/generate-roadmap");
  return response.data;
}

export async function getLatestRoadmap() {
  const response = await api.get("/ai/roadmap/latest");
  return response.data;
}
