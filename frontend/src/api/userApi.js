import api from "./axios";

export async function getProfile() {
  const response = await api.get("/users/profile");
  return response.data;
}

export async function updateProfile(payload) {
  const response = await api.put("/users/profile", payload);
  return response.data;
}
