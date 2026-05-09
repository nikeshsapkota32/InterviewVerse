"use client";
import { create } from "zustand";
import { interviewApi, resultsApi, createInterviewSocket } from "@/lib/api";

interface TestResult {
  name: string;
  status: string;
  execution_time: string;
  expected?: string;
  actual?: string;
  error?: string;
}

interface TranscriptMessage {
  time: string;
  who: "ai" | "user";
  text: string;
}

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  tags: string[];
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  time_limit_minutes: number;
}

interface InterviewState {
  sessionId: string | null;
  problem: Problem | null;
  code: string;
  language: string;
  micOn: boolean;
  cameraOn: boolean;
  isRunning: boolean;
  testResults: TestResult[];
  allPassed: boolean;
  passedCount: number;
  totalCount: number;
  transcript: TranscriptMessage[];
  hint: string | null;
  isLoadingHint: boolean;
  isSubmitting: boolean;
  socket: WebSocket | null;
  results: object | null;
  isLoadingResults: boolean;
  elapsedSeconds: number;

  startInterview: (params?: { problem_id?: string; difficulty?: string }) => Promise<string>;
  setCode: (code: string) => void;
  setLanguage: (lang: string) => void;
  toggleMic: () => void;
  toggleCamera: () => void;
  submitCode: () => Promise<void>;
  requestHint: (question?: string) => Promise<void>;
  endInterview: (durationSeconds: number) => Promise<string>;
  loadResults: (sessionId: string) => Promise<void>;
  connectSocket: (sessionId: string) => void;
  sendTranscriptMessage: (text: string) => void;
  addTranscriptMessage: (msg: TranscriptMessage) => void;
  tickTimer: () => void;
  reset: () => void;
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  sessionId: null,
  problem: null,
  code: "",
  language: "python",
  micOn: true,
  cameraOn: true,
  isRunning: false,
  testResults: [],
  allPassed: false,
  passedCount: 0,
  totalCount: 0,
  transcript: [],
  hint: null,
  isLoadingHint: false,
  isSubmitting: false,
  socket: null,
  results: null,
  isLoadingResults: false,
  elapsedSeconds: 0,

  startInterview: async (params = {}) => {
    const { data } = await interviewApi.create({
      problem_id: params.problem_id,
      difficulty: params.difficulty as "Easy" | "Medium" | "Hard" | undefined,
      interview_type: "Coding",
    });
    set({
      sessionId: data.session_id,
      problem: data.problem,
      code: "",
      transcript: [],
      testResults: [],
      isRunning: true,
      elapsedSeconds: 0,
    });
    return data.session_id;
  },

  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language }),
  toggleMic: () => set((s) => ({ micOn: !s.micOn })),
  toggleCamera: () => set((s) => ({ cameraOn: !s.cameraOn })),

  submitCode: async () => {
    const { sessionId, code, language } = get();
    if (!sessionId) return;
    set({ isSubmitting: true });
    try {
      const { data } = await interviewApi.submitCode(sessionId, code, language);
      set({
        testResults: data.test_results,
        allPassed: data.all_passed,
        passedCount: data.passed_count,
        totalCount: data.total_count,
        isSubmitting: false,
      });
    } catch {
      set({ isSubmitting: false });
    }
  },

  requestHint: async (question) => {
    const { sessionId, code } = get();
    if (!sessionId) return;
    set({ isLoadingHint: true, hint: null });
    try {
      const { data } = await interviewApi.getHint(sessionId, code, question);
      set({ hint: data.hint, isLoadingHint: false });
    } catch {
      set({ isLoadingHint: false });
    }
  },

  endInterview: async (durationSeconds) => {
    const { sessionId, code, transcript } = get();
    if (!sessionId) throw new Error("No active session");
    const { data } = await interviewApi.end(sessionId, code, transcript, durationSeconds);
    set({ isRunning: false });
    get().socket?.close();
    return data.result_id;
  },

  loadResults: async (sessionId) => {
    set({ isLoadingResults: true });
    try {
      const { data } = await resultsApi.get(sessionId);
      set({ results: data, isLoadingResults: false });
    } catch {
      set({ isLoadingResults: false });
    }
  },

  connectSocket: (sessionId) => {
    const existing = get().socket;
    if (existing) existing.close();

    const socket = createInterviewSocket(sessionId);

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "ai_message") {
        get().addTranscriptMessage({ time: _formatTime(get().elapsedSeconds), who: "ai", text: msg.text });
      } else if (msg.type === "transcript_update") {
        set({ transcript: msg.transcript });
      }
    };

    socket.onerror = () => console.error("WebSocket error");
    set({ socket });
  },

  sendTranscriptMessage: (text) => {
    const { socket, elapsedSeconds } = get();
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "transcript", text, elapsed_seconds: elapsedSeconds }));
    }
    get().addTranscriptMessage({ time: _formatTime(elapsedSeconds), who: "user", text });
  },

  addTranscriptMessage: (msg) => {
    set((s) => ({ transcript: [...s.transcript, msg] }));
  },

  tickTimer: () => set((s) => ({ elapsedSeconds: s.elapsedSeconds + 1 })),

  reset: () => {
    get().socket?.close();
    set({
      sessionId: null,
      problem: null,
      code: "",
      transcript: [],
      testResults: [],
      isRunning: false,
      socket: null,
      results: null,
      elapsedSeconds: 0,
      hint: null,
    });
  },
}));

function _formatTime(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
