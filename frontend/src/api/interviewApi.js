import api from "./axios";

export async function startInterview(payload) {
  const response = await api.post("/interviews/start", payload);
  return response.data;
}

export async function replyInterview(payload) {
  const response = await api.post("/interviews/reply", payload);
  return response.data;
}

export async function getInterviewHistory() {
  const response = await api.get("/interviews/history");
  return response.data;
}

export async function getInterviewSession(sessionId) {
  const response = await api.get(`/interviews/${sessionId}`);
  return response.data;
}
