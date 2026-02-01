const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

type FetchWithAuth = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

// Helper to extract useful error messages from backend
async function handleResponse(res: Response) {
  const contentType = res.headers.get("content-type");

  let data: unknown = null;
  if (contentType && contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  }

  if (!res.ok) {
    console.error("API Error:", data || res.statusText);

    let message = (() => {
      if (typeof data === "object" && data !== null && "detail" in data) {
        return (data as { detail?: string }).detail;
      }
      if (typeof data === "object" && data !== null) {
        return JSON.stringify(data);
      }
      if (typeof data === "string") {
        return data;
      }
      return res.statusText;
    })();

    if (!message || message === "null" || message === "{}") {
      message = `Unknown error (status ${res.status})`;
    }

    throw new Error(message);
  }

  // If data is null and response is ok, return an empty object for consistency
  return data !== null ? data : {};
}

const submissionsAPI = {
  getSubmissions: async (fetchWithAuth: FetchWithAuth) => {
    const res = await fetchWithAuth(`${API_URL}/submissions/`);
    return handleResponse(res);
  },

  getSubmission: async (fetchWithAuth: FetchWithAuth, id: number) => {
    const res = await fetchWithAuth(`${API_URL}/submissions/${id}/`);
    return handleResponse(res);
  },

  submit: async (fetchWithAuth: FetchWithAuth, data: FormData) => {
    const res = await fetchWithAuth(`${API_URL}/submissions/`, {
      method: "POST",
      body: data, // Let browser set multipart headers automatically
    });
    return handleResponse(res);
  },

  flagSubmission: async (
    fetchWithAuth: FetchWithAuth,
    id: number,
    reason: string
  ) => {
    const res = await fetchWithAuth(`${API_URL}/submissions/${id}/flag/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    });
    return handleResponse(res);
  },
};

export default submissionsAPI;
