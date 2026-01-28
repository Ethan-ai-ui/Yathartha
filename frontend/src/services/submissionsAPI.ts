// src/services/submissionsAPI.ts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const submissionsAPI = {
  getSubmissions: async (token: string) => {
    const res = await fetch(`${API_URL}/submissions/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch submissions");
    return res.json();
  },

  getSubmission: async (token: string, id: number) => {
    const res = await fetch(`${API_URL}/submissions/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch submission");
    return res.json();
  },

  submit: async (token: string, data: FormData) => {
    const res = await fetch(`${API_URL}/submissions/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data, // don't set Content-Type manually for FormData
    });
    if (!res.ok) throw new Error("Failed to submit");
    return res.json();
  },

  flagSubmission: async (token: string, id: number, reason: string) => {
    const res = await fetch(`${API_URL}/submissions/${id}/flag/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) throw new Error("Failed to flag submission");
    return res.json();
  },
};

export default submissionsAPI;
