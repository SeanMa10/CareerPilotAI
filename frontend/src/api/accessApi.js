import api from "./axios";

export async function getAccessStatus() {
  const response = await api.get("/access/status");
  return response.data;
}
