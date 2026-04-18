import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Sparkles,
  Target,
  Wrench,
  Download,
} from "lucide-react";
import { Link } from "react-router";
import { analyzeSkillGap, getLatestSkillGap } from "../api/aiApi";
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

function SkillListCard({ title, items }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
      <p className="text-lg font-semibold text-white">{title}</p>
      <ul className="mt-4 space-y-3 text-slate-300">
        {items?.length ? (
          items.map((item) => <li key={item}>• {item}</li>)
        ) : (
          <li>Nothing to show yet.</li>
        )}
      </ul>
    </div>
  );
}

function SkillGapPage() {
  const { user } = useAuth();

  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const loadSkillGap = async () => {
      try {
        const data = await getLatestSkillGap();
        setAnalysis(data);
      } catch (err) {
        if (err.response?.status !== 404) {
          setError(getErrorMessage(err, "Failed to load skill gap analysis"));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadSkillGap();
  }, []);

  const handleAnalyze = async () => {
    setMessage("");
    setError("");
    setIsAnalyzing(true);

    try {
      const data = await analyzeSkillGap();
      setAnalysis(data);
      setMessage("Skill gap analysis generated successfully");
    } catch (err) {
      if (isFeatureLockedError(err)) {
        return;
      }

      setError(getErrorMessage(err, "Failed to generate skill gap analysis"));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownload = async () => {
    setMessage("");
    setError("");
    setIsDownloading(true);

    try {
      await downloadAiReport("skill_gap");
      setMessage("Skill gap PDF downloaded successfully");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to download skill gap PDF"));
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
                AI skill gap analysis
              </div>

              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl md:text-5xl">
                Find the gap between your
                <span className="bg-gradient-to-r from-cyan-300 via-white to-indigo-300 bg-clip-text text-transparent">
                  {" "}
                  current skills
                </span>
                {" "}and your target role
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                This analysis compares your profile and resume against your chosen role
                and tells you what you already have, what is missing, and what to focus on next.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal delay={0.08}>
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-7 shadow-2xl shadow-black/20 ring-1 ring-white/5 backdrop-blur">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
                Analysis control
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Generate your skill gap report
              </h2>
              <p className="mt-2 text-slate-300">
                The system uses your target role, profile details, and resume text.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <p className="text-sm text-slate-400">Target role</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {user?.target_role || "Not set"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <p className="text-sm text-slate-400">Current profile skills</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {user?.skills?.length ? (
                      user.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-white">No profile skills added yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {missingTargetRole && (
                <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                  Set a target role in your profile before running this analysis.
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
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || missingTargetRole}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Brain size={18} />
                  {isAnalyzing ? "Analyzing..." : "Analyze Skill Gap"}
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading || !analysis}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Download size={18} />
                  {isDownloading ? "Downloading..." : "Download PDF Report"}
                </button>

                <Link
                  to="/profile"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
                >
                  Update Profile <ArrowRight size={18} />
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
                Skill gap overview
              </h2>
              <p className="mt-2 text-slate-300">
                See your current readiness for the role you want.
              </p>

              {isLoading ? (
                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-slate-300">
                  Loading analysis...
                </div>
              ) : analysis ? (
                <div className="mt-6 space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
                      <p className="text-sm text-cyan-200">Target role</p>
                      <p className="mt-2 text-2xl font-bold text-white">
                        {analysis.content.target_role}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5">
                      <p className="text-sm text-emerald-200">Readiness score</p>
                      <p className="mt-2 text-2xl font-bold text-white">
                        {analysis.content.readiness_score}/100
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                    <p className="text-lg font-semibold text-white">Summary</p>
                    <p className="mt-3 leading-7 text-slate-300">
                      {analysis.content.summary}
                    </p>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-3">
                    <SkillListCard
                      title="Matched Skills"
                      items={analysis.content.matched_skills}
                    />
                    <SkillListCard
                      title="Missing Skills"
                      items={analysis.content.missing_skills}
                    />
                    <SkillListCard
                      title="Priority Skills"
                      items={analysis.content.priority_skills}
                    />
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                    <div className="mb-3 flex items-center gap-2 text-cyan-300">
                      <CheckCircle2 size={18} />
                      <p className="font-medium">Next Steps</p>
                    </div>

                    <ul className="space-y-3 text-slate-300">
                      {analysis.content.next_steps.map((step) => (
                        <li key={step}>• {step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-slate-300">
                  No skill gap analysis generated yet.
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

export default SkillGapPage;