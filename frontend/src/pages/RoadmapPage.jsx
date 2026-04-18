import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Brain, CalendarDays, Sparkles, Download, } from "lucide-react";
import { Link } from "react-router";
import { generateRoadmap, getLatestRoadmap } from "../api/aiApi";
import { useAuth } from "../context/AuthContext";
import { downloadAiReport } from "../api/exportApi";
import { getErrorMessage, isFeatureLockedError } from "../utils/apiErrors";


function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function WeekCard({ week }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-6 shadow-xl shadow-black/20">
      <div className="mb-4 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200">
        Week {week.week_number}
      </div>

      <h3 className="text-xl font-bold text-white">{week.title}</h3>

      <div className="mt-5">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Goals</p>
        <ul className="mt-3 space-y-2 text-slate-300">
          {week.goals.map((goal) => (
            <li key={goal}>• {goal}</li>
          ))}
        </ul>
      </div>

      <div className="mt-5">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Tasks</p>
        <ul className="mt-3 space-y-2 text-slate-300">
          {week.tasks.map((task) => (
            <li key={task}>• {task}</li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
          Project suggestion
        </p>
        <p className="mt-2 leading-7 text-white">{week.project_suggestion}</p>
      </div>
    </div>
  );
}

function RoadmapPage() {
  const { user } = useAuth();

  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const loadRoadmap = async () => {
      try {
        const data = await getLatestRoadmap();
        setRoadmap(data);
      } catch (err) {
        if (err.response?.status !== 404) {
          setError(getErrorMessage(err, "Failed to load roadmap"));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadRoadmap();
  }, []);

  const handleGenerate = async () => {
    setMessage("");
    setError("");
    setIsGenerating(true);

    try {
      const data = await generateRoadmap();
      setRoadmap(data);
      setMessage("Roadmap generated successfully");
    } catch (err) {
      if (isFeatureLockedError(err)) {
        return;
      }

      setError(getErrorMessage(err, "Failed to generate roadmap"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    setMessage("");
    setError("");
    setIsDownloading(true);

    try {
      await downloadAiReport("roadmap");
      setMessage("Roadmap PDF downloaded successfully");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to download roadmap PDF"));
    } finally {
      setIsDownloading(false);
    }
  };

  const missingTargetRole = !user?.target_role?.trim();

  return (
    <div className="relative min-h-[calc(100vh-81px)] overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.14),transparent_24%),linear-gradient(to_bottom,rgba(2,6,23,0.95),rgba(2,6,23,1))]" />
      <div className="absolute left-[-90px] top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute right-[-120px] bottom-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 md:py-16">
        <Reveal>
          <div className="rounded-[28px] border border-white/10 bg-gradient-to-r from-cyan-500/12 via-slate-900 to-indigo-500/12 p-6 shadow-2xl shadow-black/25 ring-1 ring-white/5 sm:rounded-[36px] sm:p-8 md:p-10">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                <Sparkles size={16} className="text-cyan-300" />
                AI roadmap generator
              </div>

              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl md:text-5xl">
                Build your next
                <span className="bg-gradient-to-r from-cyan-300 via-white to-indigo-300 bg-clip-text text-transparent">
                  {" "}
                  8-week roadmap
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Generate a structured weekly plan based on your target role, profile,
                resume, and skill gap analysis.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal delay={0.08}>
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-7 shadow-2xl shadow-black/20 ring-1 ring-white/5 backdrop-blur">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
                Roadmap control
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Generate your weekly plan
              </h2>
              <p className="mt-2 text-slate-300">
                The roadmap is personalized to your current profile and target role.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <p className="text-sm text-slate-400">Target role</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {user?.target_role || "Not set"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <p className="text-sm text-slate-400">Experience level</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {user?.experience_level || "Not set"}
                  </p>
                </div>
              </div>

              {missingTargetRole && (
                <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                  Set a target role in your profile before generating a roadmap.
                </div>
              )}

              {message && (
                <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  {message}
                </div>
              )}

              {error && (
                <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating || missingTargetRole}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Brain size={18} />
                  {isGenerating ? "Generating..." : "Generate Roadmap"}
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading || !roadmap}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Download size={18} />
                  {isDownloading ? "Downloading..." : "Download PDF Report"}
                </button>

                <Link
                  to="/skill-gap"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
                >
                  Open Skill Gap <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-7 shadow-2xl shadow-black/20 ring-1 ring-white/5">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
                Results
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Your roadmap overview
              </h2>
              <p className="mt-2 text-slate-300">
                A structured plan to improve your readiness week by week.
              </p>

              {isLoading ? (
                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-slate-300">
                  Loading roadmap...
                </div>
              ) : roadmap ? (
                <div className="mt-6 space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
                      <p className="text-sm text-cyan-200">Target role</p>
                      <p className="mt-2 text-2xl font-bold text-white">
                        {roadmap.content.target_role}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5">
                      <p className="text-sm text-emerald-200">Duration</p>
                      <p className="mt-2 text-2xl font-bold text-white">
                        {roadmap.content.duration_weeks} weeks
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                    <div className="mb-3 flex items-center gap-2 text-cyan-300">
                      <CalendarDays size={18} />
                      <p className="font-medium">Summary</p>
                    </div>

                    <p className="leading-7 text-slate-300">
                      {roadmap.content.summary}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-slate-300">
                  No roadmap generated yet.
                </div>
              )}
            </div>
          </Reveal>
        </div>

        {roadmap?.content?.weeks?.length ? (
          <Reveal delay={0.2} className="mt-8">
            <div className="mb-6">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
                8-week plan
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Weekly roadmap breakdown
              </h2>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              {roadmap.content.weeks.map((week) => (
                <WeekCard key={week.week_number} week={week} />
              ))}
            </div>
          </Reveal>
        ) : null}
      </div>
    </div>
  );
}

export default RoadmapPage;