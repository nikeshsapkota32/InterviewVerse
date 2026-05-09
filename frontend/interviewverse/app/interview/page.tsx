import InterviewTopBar from "@/components/interview/InterviewTopBar";
import QuestionPanel from "@/components/interview/QuestionPanel";
import CodeEditor from "@/components/interview/CodeEditor";
import WebcamPanel from "@/components/interview/WebcamPanel";
import TranscriptPanel from "@/components/interview/TranscriptPanel";

export default function InterviewPage() {
  return (
    <div className="flex h-screen flex-col">
      <InterviewTopBar />
      <div className="grid min-h-0 flex-1 grid-cols-[300px_1fr_340px] gap-px bg-border">
        <QuestionPanel />
        <CodeEditor />
        <div className="flex min-h-0 flex-col gap-px bg-border">
          <WebcamPanel />
          <TranscriptPanel />
        </div>
      </div>
    </div>
  );
}