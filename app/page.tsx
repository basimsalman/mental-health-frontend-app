use client";

import { useRef, useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://mental-health-backend-h88t.onrender.com";

type AnalysisResult = {
  modality: string;
  risk_score: number;
  risk_level: string;
  confidence: number;
  emotion_state: string;
  features: Record<string, string | number>;
  detail: string;
  disclaimer: string;
};

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleLogin = async () => {
    try {
      await axios.post(`${API_BASE_URL}/login/`, {
        username,
        password,
      });

      setLoggedIn(true);
    } catch {
      alert("Invalid username or password");
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    setResult(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select audio, image, or video first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post<AnalysisResult>(
        `${API_BASE_URL}/analyze-media/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Upload failed. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoggedIn(false);
    setUsername("");
    setPassword("");
    setFile(null);
    setPreviewUrl("");
    setResult(null);
  };

  if (!loggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
          <p className="mb-3 inline-block rounded-full bg-indigo-500/20 px-3 py-1 text-sm text-indigo-200">
            Research Access
          </p>

          <h1 className="text-3xl font-bold">
            AI-Based Psychological State System
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-300">
            Система ИИ-моделирования психологического состояния человека
          </p>

          <p className="mt-4 text-sm text-slate-400">
            Sign in to use the research prototype.
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
            Demo login: aqeel / 1234
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-8 shadow-2xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
                PhD Research Prototype
              </p>

              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                AI-Based Model of the Human Psychological State System
              </h1>

              <p className="mt-2 text-xl font-semibold text-white/90">
                Система ИИ-моделирования психологического состояния человека
              </p>

              <p className="mt-4 max-w-3xl text-lg text-white/90">
                Upload audio, video, or image data to estimate interpretable
                indicators related to the human psychological state, including
                voice volume, speech rate, facial activity, and movement
                signals.
              </p>

              <p className="mt-3 max-w-3xl text-base text-white/80">
                Загрузите аудио, видео или изображение для оценки
                интерпретируемых показателей психологического состояния
                человека, включая громкость голоса, скорость речи, мимику и
                двигательные признаки.
              </p>
            </div>

            <button
              onClick={logout}
              className="rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
            <h2 className="text-2xl font-semibold">Upload Media</h2>
            <p className="mt-1 text-lg font-medium text-slate-300">
              Загрузка медиафайла
            </p>

            <p className="mt-3 text-sm text-slate-300">
              Supported files: audio, image, and video.
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Поддерживаемые файлы: аудио, изображение и видео.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleSelectFile}
                className="rounded-xl bg-indigo-500 px-5 py-3 font-semibold text-white transition hover:bg-indigo-400"
              >
                Select File / Выбрать файл
              </button>

              <button
                onClick={handleUpload}
                className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-400"
              >
                Upload & Analyze / Анализировать
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-slate-900/60 p-4">
              <p className="text-sm text-slate-300">
                Selected file / Выбранный файл
              </p>

              <p className="mt-2 break-all font-medium">
                {file ? file.name : "No file selected / Файл не выбран"}
              </p>

              {file && (
                <p className="mt-2 text-sm text-slate-400">
                  Type / Тип: {file.type || "unknown"}
                </p>
              )}
            </div>

            {loading && (
              <div className="mt-6 rounded-2xl border border-indigo-400/30 bg-indigo-500/10 p-4 text-indigo-200">
                Processing media... / Обработка медиафайла...
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
            <h2 className="text-2xl font-semibold">Preview</h2>
            <p className="mt-1 text-lg font-medium text-slate-300">
              Предварительный просмотр
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              {!file && (
                <p className="text-slate-400">
                  No preview available. / Предварительный просмотр недоступен.
                </p>
              )}

              {file?.type.startsWith("image/") && (
                <img
                  src={previewUrl}
                  alt="Selected preview"
                  className="max-h-80 w-full rounded-xl object-contain"
                />
              )}

              {file?.type.startsWith("audio/") && (
                <audio controls src={previewUrl} className="w-full" />
              )}

              {file?.type.startsWith("video/") && (
                <video
                  controls
                  src={previewUrl}
                  className="max-h-80 w-full rounded-xl"
                />
              )}
            </div>
          </div>
        </section>

        {result && (
          <section className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-6 shadow-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Analysis Result</h2>
                <p className="mt-1 text-lg font-medium text-emerald-100/80">
                  Результат анализа
                </p>
                <p className="mt-1 text-sm text-emerald-100/80">
                  Research output only. Not a diagnosis.
                </p>
              </div>

              <RiskBadge level={result.risk_level} />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <ResultCard title="Risk Score / Оценка риска" value={result.risk_score} />
              <ResultCard title="Risk Level / Уровень риска" value={result.risk_level} />
              <ResultCard title="Confidence / Уверенность" value={result.confidence} />
              <ResultCard title="Modality / Тип данных" value={result.modality} />
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <h3 className="text-lg font-semibold">
                Estimated Psychological State
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Оценочное психологическое состояние
              </p>
              <p className="mt-3 text-slate-200">{result.emotion_state}</p>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-5">
              <h3 className="text-lg font-semibold">Measured Features</h3>
              <p className="mt-1 text-sm text-slate-400">
                Измеряемые признаки
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {Object.entries(result.features).map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-xl border border-white/10 bg-white/5 p-3"
                  >
                    <p className="text-sm text-slate-400">
                      {key.replaceAll("_", " ")}
                    </p>
                    <p className="mt-1 text-lg font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-sm text-slate-300">
                Risk Score / Оценка риска
              </p>
              <div className="h-4 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500"
                  style={{ width: `${Math.max(5, result.risk_score * 100)}%` }}
                />
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-sm text-slate-300">
                Confidence / Уверенность
              </p>
              <div className="h-4 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-emerald-500"
                  style={{ width: `${Math.max(5, result.confidence * 100)}%` }}
                />
              </div>
            </div>

            <p className="mt-6 text-sm text-slate-200">{result.detail}</p>

            <p className="mt-3 text-sm font-semibold text-yellow-200">
              {result.disclaimer}
            </p>

            <p className="mt-1 text-sm font-semibold text-yellow-200">
              Только для исследовательских целей. Не является медицинским
              диагнозом.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

function ResultCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
      <p className="text-sm text-slate-300">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function RiskBadge({ level }: { level: string }) {
  const styles =
    level === "High"
      ? "border-red-400/30 bg-red-500/20 text-red-200"
      : level === "Moderate"
      ? "border-yellow-400/30 bg-yellow-500/20 text-yellow-200"
      : "border-green-400/30 bg-green-500/20 text-green-200";

  return (
    <div className={`rounded-full border px-5 py-2 font-semibold ${styles}`}>
      {level} Risk / Уровень риска
    </div>
  );
}