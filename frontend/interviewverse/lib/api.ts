import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach auth token if present
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("iv_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface UserOut {
  id: string;
  name: string;
  email: string;
  initials: string;
  plan: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserOut;
}

export const authApi = {
  signup: (name: string, email: string, password: string) =>
    api.post<AuthResponse>("/api/auth/signup", { name, email, password }),
  login: (email: string, password: string) =>
    api.post<AuthResponse>("/api/auth/login", { email, password }),
};

// ─── Dashboard ───────────────────────────────────────────────────────────────

export const dashboardApi = {
  get: () => api.get("/api/dashboard"),
};

// ─── Interviews ──────────────────────────────────────────────────────────────

export interface CreateInterviewParams {
  problem_id?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  interview_type?: "Coding" | "System Design" | "Behavioral";
}

export const interviewApi = {
  create: (params: CreateInterviewParams) => api.post("/api/interviews", params),
  getProblem: (sessionId: string) => api.get(`/api/interviews/${sessionId}/problem`),
  submitCode: (sessionId: string, code: string, language: string) =>
    api.post(`/api/interviews/${sessionId}/submit-code`, { code, language }),
  getHint: (sessionId: string, code?: string, question?: string) =>
    api.post(`/api/interviews/${sessionId}/hint`, { code, question }),
  end: (sessionId: string, code?: string, transcript?: object[], duration_seconds?: number) =>
    api.post(`/api/interviews/${sessionId}/end`, { code, transcript, duration_seconds }),
};

// ─── Results ─────────────────────────────────────────────────────────────────

export const resultsApi = {
  get: (sessionId: string) => api.get(`/api/results/${sessionId}`),
};

// ─── Resume ──────────────────────────────────────────────────────────────────

export const resumeApi = {
  analyze: (text: string) => {
    const form = new FormData();
    form.append("text", text);
    return api.post("/api/resume/analyze", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  analyzeFile: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.post("/api/resume/analyze", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// ─── WebSocket ───────────────────────────────────────────────────────────────

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

export function createInterviewSocket(sessionId: string) {
  return new WebSocket(`${WS_URL}/ws/${sessionId}`);
}
