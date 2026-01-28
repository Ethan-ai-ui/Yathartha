// src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

// ----------------- TYPES -----------------
export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    is_verified: boolean;
  };
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  role: "citizen" | "journalist" | "ngo" | "admin";
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SubmissionData {
  content_type: "text" | "image" | "video" | "audio" | "link";
  content: string;
  language: "en" | "ne" | "hi";
}

// ----------------- AUTH API -----------------
export const authAPI = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/signup/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Signup failed");
    }
    return res.json();
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const res = await fetch(`${API_URL}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Login failed");
    }
    return res.json();
  },

  logout: async (token: string) => {
    await fetch(`${API_URL}/auth/logout/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  refreshToken: async (refreshToken: string) => {
    const res = await fetch(`${API_URL}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!res.ok) throw new Error("Failed to refresh token");
    return res.json();
  },

  getProfile: async (token: string) => {
    const res = await fetch(`${API_URL}/auth/profile/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
  },
};

// ----------------- SUBMISSIONS API -----------------
export const submissionsAPI = {
  submit: async (token: string, data: SubmissionData & { file?: File }) => {
    const formData = new FormData();
    formData.append("content_type", data.content_type);
    formData.append("language", data.language);
    if (data.file) formData.append("file", data.file);
    else formData.append("content", data.content);

    const res = await fetch(`${API_URL}/submissions/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to submit content");
    return res.json();
  },

  getSubmissions: async (token: string, page = 1) => {
    const res = await fetch(`${API_URL}/submissions/?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch submissions");
    return res.json();
  },

  getSubmission: async (token: string, id: number) => {
    const res = await fetch(`${API_URL}/submissions/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch submission");
    return res.json();
  },

  getResults: async (token: string, id: number) => {
    const res = await fetch(`${API_URL}/submissions/${id}/results/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch results");
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

// ----------------- ANALYTICS API -----------------
export const analyticsAPI = {
  getOverview: async (token: string) => {
    const res = await fetch(`${API_URL}/reports/analytics/overview/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch analytics overview");
    return res.json();
  },

  getReports: async (token: string, page = 1) => {
    const res = await fetch(`${API_URL}/reports/?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch reports");
    return res.json();
  },
};

// ----------------- ADMIN API -----------------
export const adminAPI = {
  getDashboard: async (token: string) => {
    const res = await fetch(`${API_URL}/admin/dashboard/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch admin dashboard");
    return res.json();
  },
};

// ----------------- COMMUNITY API -----------------
export const communityAPI = {
  getReports: async () => {
    const res = await fetch(`${API_URL}/reports/reports/`);
    if (!res.ok) throw new Error("Failed to fetch community reports");
    return res.json();
  },
};

// ----------------- DEFAULT EXPORT -----------------
export default {
  authAPI,
  submissionsAPI,
  analyticsAPI,
  adminAPI,
  communityAPI,
};
