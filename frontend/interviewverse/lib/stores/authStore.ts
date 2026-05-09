"use client";
import { create } from "zustand";
import { authApi, type UserOut } from "@/lib/api";

interface AuthState {
  user: UserOut | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  loadFromStorage: () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("iv_token");
    const userStr = localStorage.getItem("iv_user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as UserOut;
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem("iv_token");
        localStorage.removeItem("iv_user");
      }
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authApi.login(email, password);
      localStorage.setItem("iv_token", data.access_token);
      localStorage.setItem("iv_user", JSON.stringify(data.user));
      set({ user: data.user, token: data.access_token, isAuthenticated: true, isLoading: false });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Login failed";
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  signup: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await authApi.signup(name, email, password);
      localStorage.setItem("iv_token", data.access_token);
      localStorage.setItem("iv_user", JSON.stringify(data.user));
      set({ user: data.user, token: data.access_token, isAuthenticated: true, isLoading: false });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Signup failed";
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  logout: () => {
    localStorage.removeItem("iv_token");
    localStorage.removeItem("iv_user");
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
