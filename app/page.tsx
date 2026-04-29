"use client";

import { useRef, useState } from "react";
import axios from "axios";

type AnalysisResult = {
  risk_score: number;
  confidence: number;
  modality: string;
  detail: string;
};

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleLogin = async () => {
    try {
      await axios.post("https://mental-health-backend-h88t.onrender.com/login/", {
        username,
        password,
      });

      setLoggedIn(true);
    } catch {
      alert("Invalid username or password");
    }
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const data = new FormData();
    data.append("file", file);

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(
        "http://localhost:8000/analyze-media/",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setResult(response.data);
    } catch {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  if (!loggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
          <p className="mb-3 inline-block rounded-full bg-indigo-500/20 px-3 py-1 text-sm text-indigo-200">
            Secure Research Access
          </p>

          <h1 className="text-3xl font-bold">Login</h1>
          <p className="mt-2 text-sm text-slate-300">
            Please login to use the multimodal screening prototype.
          </p>

          <div className="mt-6 space-y-4">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-indigo-400"
            />

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-indigo-400"
            />

            <button
              onClick={handleLogin}
              className="w-full rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white transition hover:bg-indigo-400"
            >
              Login
            </button>
          </div>

          <p className="mt-5 text-xs text-slate-400">
            Research use only. Not for medical diagnosis.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-8 shadow-2xl">
          <p className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
            PhD Research Prototype
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Multimodal Risk Screening Platform
          </h1>

          <p className="mt-4 max-w-3xl text-lg text-white/90">
            Upload an audio, video, or image file to estimate research risk
            indicators. This tool is for academic research only and is not a
            medical diagnosis.
          </p>

          <button
            onClick={() => {
              setLoggedIn(false);
              setUsername("");
              setPassword("");
              setFile(null);
              setResult(null);
            }}
            className="mt-6 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30"
          >
            Logout
          </button>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
          <h2 className="mb-2 text-2xl font-semibold">Upload Media</h2>

          <p className="mb-6 text-sm text-slate-300">
            Supported types: audio, video, image
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/*,image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleSelectClick}
              className="rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white transition hover:bg-indigo-400"
            >
              Select File
            </button>

            <button
              onClick={handleUpload}
              className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-400"
            >
              Upload & Analyze
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-300">Selected file</p>
            <p className="mt-2 break-all text-base font-medium text-white">
              {file ? file.name : "No file selected yet"}
            </p>

            {file && (
              <p className="mt-2 text-sm text-slate-400">
                Type: {file.type || "unknown"}
              </p>
            )}
          </div>

          {loading && (
            <div className="mt-6 rounded-2xl border border-indigo-400/30 bg-indigo-500/10 p-4 text-indigo-200">
              Processing your media...
            </div>
          )}
        </section>

        {result && (
          <section className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-6 shadow-xl">
            <h2 className="text-2xl font-semibold">Analysis Result</h2>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <ResultCard title="Risk Score" value={result.risk_score} />
              <ResultCard title="Confidence" value={result.confidence} />
              <ResultCard title="Modality" value={result.modality} />
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-sm text-slate-300">Detail</p>
              <p className="mt-2 text-white">{result.detail}</p>
            </div>

            <p className="mt-6 text-sm text-slate-200">
              This tool is for academic research use only and does not provide
              diagnosis, treatment advice, or emergency support.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

type ResultCardProps = {
  title: string;
  value: string | number;
};

function ResultCard({ title, value }: ResultCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
      <p className="text-sm text-slate-300">{title}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}