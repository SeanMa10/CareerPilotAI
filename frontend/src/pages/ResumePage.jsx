import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  CheckCircle2,
  FileText,
  Files,
  Sparkles,
  UploadCloud,
  Download,
} from "lucide-react";
import { analyzeResume, getLatestResumeReview } from "../api/aiApi";
import { getMyResume, uploadResume } from "../api/resumeApi";
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

function formatBytes(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function ResumePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resume, setResume] = useState(null);
  const [review, setReview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [message, setMessage] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [error, setError] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [isDownloadingReview, setIsDownloadingReview] = useState(false);

  const previewText = useMemo(() => {
    if (!resume?.preview_text) {
      return "No extracted text preview yet.";
    }

    return resume.preview_text;
  }, [resume]);

  const handleDownloadReview = async () => {
    setReviewMessage("");
    setReviewError("");
    setIsDownloadingReview(true);

    try {
      await downloadAiReport("resume_review");
      setReviewMessage("Resume review PDF downloaded successfully");
    } catch (err) {
      setReviewError(getErrorMessage(err, "Failed to download resume review PDF"));
    } finally {
      setIsDownloadingReview(false);
    }
  };

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const resumeData = await getMyResume();
        setResume(resumeData);
      } catch (err) {
        if (err.response?.status !== 404) {
          setError(getErrorMessage(err, "Failed to load resume"));
        }
      }

      try {
        const reviewData = await getLatestResumeReview();
        setReview(reviewData);
      } catch (err) {
        if (err.response?.status !== 404) {
          setReviewError(getErrorMessage(err, "Failed to load AI review"));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPageData();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setMessage("");
    setError("");
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please choose a PDF file first");
      return;
    }

    setMessage("");
    setError("");
    setIsUploading(true);

    try {
      const data = await uploadResume(selectedFile);
      setResume(data);
      setSelectedFile(null);
      setReview(null);
      setReviewMessage("");
      setReviewError("");
      setMessage("Resume uploaded and parsed successfully");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to upload resume"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async () => {
    setReviewMessage("");
    setReviewError("");
    setIsAnalyzing(true);

    try {
      const data = await analyzeResume();
      setReview(data);
      setReviewMessage("AI resume review generated successfully");
    } catch (err) {
      if (isFeatureLockedError(err)) {
        return;
      }

      setReviewError(getErrorMessage(err, "Failed to analyze resume"));
    } finally {
      setIsAnalyzing(false);
    }
  };

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
                Resume upload and AI analysis
              </div>

              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl md:text-5xl">
                Turn your resume into
                <span className="bg-gradient-to-r from-cyan-300 via-white to-indigo-300 bg-clip-text text-transparent">
                  {" "}
                  practical AI feedback
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Upload your PDF, extract the text, and generate an AI review with
                strengths, weaknesses, suggestions, and a score.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal delay={0.08} className="min-w-0">
            <form
              onSubmit={handleUpload}
              className="min-w-0 rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 ring-1 ring-white/5 backdrop-blur sm:rounded-4xl sm:p-7"
            >
              <div className="mb-8">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
                  Upload
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  Choose your PDF resume
                </h2>
                <p className="mt-2 text-slate-300">
                  Upload a PDF file up to 5MB. Uploading a new one replaces the current resume.
                </p>
              </div>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-white/15 bg-slate-900/60 px-6 py-12 text-center transition hover:border-cyan-400/30 hover:bg-slate-900/80">
                <div className="mb-4 rounded-2xl bg-cyan-400/10 p-4 text-cyan-300 ring-1 ring-cyan-400/20">
                  <UploadCloud size={28} />
                </div>

                <p className="text-lg font-semibold text-white">
                  {selectedFile ? selectedFile.name : "Click to choose a PDF"}
                </p>
                <p className="mt-2 text-sm text-slate-400">PDF only · Max 5MB</p>

                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

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

              <button
                type="submit"
                disabled={isUploading}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isUploading ? "Uploading..." : "Upload Resume"}
              </button>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !resume}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Brain size={18} />
                {isAnalyzing ? "Analyzing..." : "Analyze Resume with AI"}
              </button>

              
                <button
                  type="button"
                  onClick={handleDownloadReview}
                  disabled={isDownloadingReview || !review}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Download size={18} />
                  {isDownloadingReview ? "Downloading..." : "Download PDF Report"}
                </button>
              
            </form>
          </Reveal>

          <Reveal delay={0.14} className="min-w-0">
            <div className="rounded-4xl border border-white/10 bg-white/5 p-7 shadow-2xl shadow-black/20 ring-1 ring-white/5">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
                Current resume
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">Resume overview</h2>
              <p className="mt-2 text-slate-300">
                Your latest uploaded resume and extracted content summary.
              </p>

              {isLoading ? (
                <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-slate-300">
                  Loading resume...
                </div>
              ) : resume ? (
                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                        <FileText size={22} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-lg font-semibold text-white">
                          {resume.original_filename}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          Uploaded: {formatDate(resume.uploaded_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                      <p className="text-sm text-slate-400">Pages</p>
                      <p className="mt-2 text-2xl font-bold text-white">
                        {resume.page_count}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                      <p className="text-sm text-slate-400">Size</p>
                      <p className="mt-2 text-2xl font-bold text-white">
                        {formatBytes(resume.size_bytes)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                      <p className="text-sm text-slate-400">Status</p>
                      <div className="mt-2 inline-flex items-center gap-2 text-emerald-300">
                        <CheckCircle2 size={18} />
                        <span className="font-semibold">Parsed</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                    <div className="mb-3 flex items-center gap-2 text-cyan-300">
                      <Files size={18} />
                      <p className="font-medium">Extracted text preview</p>
                    </div>

                    <div className="max-h-90 overflow-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm leading-7 whitespace-pre-wrap wrap-break-word text-slate-200">
                      {previewText || "No extractable text found in this PDF."}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-slate-300">
                  No resume uploaded yet.
                </div>
              )}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="mt-8">
          <div className="min-w-0 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 ring-1 ring-white/5 sm:rounded-4xl sm:p-7">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
              AI review
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Resume analysis results
            </h2>
            <p className="mt-2 text-slate-300">
              Generate a practical review based on your current resume and profile.
            </p>

            {reviewMessage && (
              <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {reviewMessage}
              </div>
            )}

            {reviewError && (
              <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {reviewError}
              </div>
            )}

            {review ? (
              <div className="mt-6 space-y-6">
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
                  <p className="text-sm text-cyan-200">Resume score</p>
                  <p className="mt-2 text-4xl font-black text-white">
                    {review.content.score}/100
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                  <p className="text-lg font-semibold text-white">Summary</p>
                  <p className="mt-3 leading-7 text-slate-300">
                    {review.content.summary}
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                    <p className="text-lg font-semibold text-white">Strengths</p>
                    <ul className="mt-4 space-y-3 text-slate-300">
                      {review.content.strengths.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                    <p className="text-lg font-semibold text-white">Weaknesses</p>
                    <ul className="mt-4 space-y-3 text-slate-300">
                      {review.content.weaknesses.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                    <p className="text-lg font-semibold text-white">Suggestions</p>
                    <ul className="mt-4 space-y-3 text-slate-300">
                      {review.content.suggestions.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-slate-300">
                No AI review generated yet.
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export default ResumePage;