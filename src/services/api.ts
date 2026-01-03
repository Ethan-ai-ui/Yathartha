// API Service - Connect Frontend to Backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

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

// Auth API
export const authAPI = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/signup/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Signup failed");
    }
    return response.json();
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Login failed");
    }
    return response.json();
  },

  logout: async (token: string): Promise<void> => {
    await fetch(`${API_URL}/auth/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getProfile: async (token: string) => {
    const response = await fetch(`${API_URL}/auth/profile/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch profile");
    return response.json();
  },

  updateProfile: async (token: string, data: any) => {
    const response = await fetch(`${API_URL}/auth/update-profile/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update profile");
    return response.json();
  },

  requestOTP: async (email: string) => {
    const response = await fetch(`${API_URL}/auth/request-otp/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error("Failed to request OTP");
    return response.json();
  },

  verifyOTP: async (email: string, otp: string) => {
    const response = await fetch(`${API_URL}/auth/verify-otp/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    if (!response.ok) throw new Error("Failed to verify OTP");
    return response.json();
  },

  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    const response = await fetch(`${API_URL}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!response.ok) throw new Error("Failed to refresh token");
    return response.json();
  },

  changePassword: async (
    token: string,
    oldPassword: string,
    newPassword: string
  ) => {
    const response = await fetch(`${API_URL}/auth/change-password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    });
    if (!response.ok) throw new Error("Failed to change password");
    return response.json();
  },
};

// Submissions API
export const submissionsAPI = {
  submit: async (token: string, data: SubmissionData & { file?: File }) => {
    const formData = new FormData();
    formData.append("content_type", data.content_type);
    formData.append("language", data.language);

    if (data.file) {
      formData.append("file", data.file);
    } else {
      formData.append("content", data.content);
    }

    const response = await fetch(`${API_URL}/submissions/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to submit content");
    return response.json();
  },

  getSubmissions: async (token: string, page = 1) => {
    const response = await fetch(`${API_URL}/submissions/?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch submissions");
    return response.json();
  },

  getSubmission: async (token: string, id: number) => {
    const response = await fetch(`${API_URL}/submissions/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch submission");
    return response.json();
  },

  getResults: async (token: string, id: number) => {
    const response = await fetch(`${API_URL}/submissions/${id}/results/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch results");
    return response.json();
  },

  flagSubmission: async (token: string, id: number, reason: string) => {
    const response = await fetch(`${API_URL}/submissions/${id}/flag/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) throw new Error("Failed to flag submission");
    return response.json();
  },

  getStatistics: async (token: string) => {
    const response = await fetch(`${API_URL}/submissions/statistics/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch statistics");
    return response.json();
  },
};

// Analytics API
export const analyticsAPI = {
  getOverview: async (token: string) => {
    const response = await fetch(`${API_URL}/reports/overview/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch overview");
    return response.json();
  },

  getTrends: async (token: string, days = 30) => {
    const response = await fetch(`${API_URL}/reports/trends/?days=${days}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch trends");
    return response.json();
  },

  getTopContent: async (token: string, limit = 10) => {
    const response = await fetch(`${API_URL}/reports/top-content/?limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch top content");
    return response.json();
  },

  getReports: async (token: string, page = 1) => {
    const response = await fetch(`${API_URL}/reports/?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch reports");
    return response.json();
  },
};

// Admin API
export const adminAPI = {
  getDashboard: async (token: string) => {
    const response = await fetch(`${API_URL}/admin/dashboard/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch admin dashboard");
    return response.json();
  },

  getModerationQueue: async (token: string, page = 1) => {
    const response = await fetch(`${API_URL}/admin/moderation-queue/?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch moderation queue");
    return response.json();
  },

  updateModerationStatus: async (
    token: string,
    id: number,
    status: "approved" | "rejected" | "in_progress"
  ) => {
    const response = await fetch(`${API_URL}/admin/moderation-queue/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update moderation status");
    return response.json();
  },

  banUser: async (
    token: string,
    userId: number,
    reason: string,
    duration?: number
  ) => {
    const response = await fetch(`${API_URL}/admin/bans/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user: userId,
        reason,
        duration_days: duration,
      }),
    });
    if (!response.ok) throw new Error("Failed to ban user");
    return response.json();
  },

  getReports: async (token: string, page = 1) => {
    const response = await fetch(`${API_URL}/admin/reports/?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch admin reports");
    return response.json();
  },
};

export default { authAPI, submissionsAPI, analyticsAPI, adminAPI };
