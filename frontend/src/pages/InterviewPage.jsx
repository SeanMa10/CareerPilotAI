import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  MessageSquareQuote,
  Send,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router";
import {
  getInterviewHistory,
  getInterviewSession,
  replyInterview,
  startInterview,
} from "../api/interviewApi";
import { useAuth } from "../context/AuthContext";
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

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function MessageBubble({ message }) {
  if (message.type === "feedback") {
    return (
      <div className="rounded-[20px] border border-cyan-400/20 bg-cyan-400/10 p-4 sm:rounded-3xl sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-200">
            AI Feedback
          </p>
          {message.score !== null && message.score !== undefined ? (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-semibold text-white">
              {message.score}/100
            </span>
          ) : null}
        </div>

        <p className="leading-7 text-slate-100">{message.text}</p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="font-medium text-white">What was good</p>
            <ul className="mt-3 space-y-2 text-slate-300">
              {message.strengths?.length ? (
                message.strengths.map((item) => <li key={item}>• {item}</li>)
              ) : (
                <li>No strengths listed.</li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <p className="font-medium text-white">What to improve</p>
            <ul className="mt-3 space-y-2 text-slate-300">
              {message.improvements?.length ? (
                message.improvements.map((item) => <li key={item}>• {item}</li>)
              ) : (
                <li>No improvement points listed.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (message.sender === "user") {
    return (
      <div className="ml-auto w-full max-w-full rounded-[20px] border border-white/10 bg-white/8 p-4 text-slate-100 sm:max-w-3xl sm:rounded-3xl">
        <p className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">
          Your Answer
        </p>
        <p className="leading-7">{message.text}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full rounded-[20px] border border-white/10 bg-slate-900/70 p-4 text-slate-100 sm:max-w-3xl sm:rounded-3xl">
      <p className="mb-2 text-xs uppercase tracking-[0.22em] text-cyan-300">
        {message.type === "intro" ? "AI Intro" : "AI Question"}
      </p>
      <p className="leading-7">{message.text}</p>
    </div>
  );
}

function InterviewPage() {
  const { user } = useAuth();

  const [roleInput, setRoleInput] = useState(user?.target_role || "");
  const [answer, setAnswer] = useState("");
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadHistory = async () => {
    const history = await getInterviewHistory();
    setSessions(history);
    return history;
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const history = await loadHistory();

        if (history.length > 0) {
          const latestSession = await getInterviewSession(history[0].id);
          setCurrentSession(latestSession);
          setRoleInput(latestSession.role || user?.target_role || "");
        }
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load interview sessions"));
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [user?.target_role]);

  const handleStartInterview = async () => {
    setMessage("");
    setError("");
    setIsStarting(true);

    try {
      const data = await startInterview({ role: roleInput });
      setCurrentSession(data);
      setAnswer("");
      setRoleInput(data.role);
      setMessage("Interview session started successfully");
      await loadHistory();
    } catch (err) {
      if (isFeatureLockedError(err)) {
        return;
      }

      setError(getErrorMessage(err, "Failed to start interview"));
    } finally {
      setIsStarting(false);
    }
  };

  const handleSendAnswer = async () => {
    if (!currentSession) {
      setError("Start or open an interview session first");
      return;
    }

    if (!answer.trim()) {
      setError("Please write an answer before sending");
      return;
    }

    setMessage("");
    setError("");
    setIsSending(true);

    try {
      const updatedSession = await replyInterview({
        session_id: currentSession.id,
        answer: answer.trim(),
      });

      setCurrentSession(updatedSession);
      setAnswer("");
      setMessage("Answer submitted successfully");
      await loadHistory();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to send answer"));
    } finally {
      setIsSending(false);
    }
  };

  const handleOpenSession = async (sessionId) => {
    setMessage("");
    setError("");

    try {
      const session = await getInterviewSession(sessionId);
      setCurrentSession(session);
      setRoleInput(session.role);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to open session"));
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
                AI interview coach
              </div>

              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl md:text-5xl">
                Practice interviews with
                <span className="bg-gradient-to-r from-cyan-300 via-white to-indigo-300 bg-clip-text text-transparent">
                  {" "}
                  real feedback
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Start a mock interview, answer technical questions, and get structured
                feedback with strengths, improvements, and follow-up questions.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal delay={0.08}>
            <div className="space-y-6">
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-7 shadow-2xl shadow-black/20 ring-1 ring-white/5 backdrop-blur">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
                  Interview control
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  Start a new interview session
                </h2>
                <p className="mt-2 text-slate-300">
                  Use your target role or type a custom role for this session.
                </p>

                <div className="mt-6">
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Interview role
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-300 focus-within:border-cyan-400/40">
                    <Brain size={18} className="text-cyan-300" />
                    <input
                      type="text"
                      value={roleInput}
                      onChange={(event) => setRoleInput(event.target.value)}
                      placeholder="AI Developer"
                      className="w-full bg-transparent outline-none placeholder:text-slate-500"
                    />
                  </div>
                </div>

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
                    onClick={handleStartInterview}
                    disabled={isStarting || !roleInput.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <MessageSquareQuote size={18} />
                    {isStarting ? "Starting..." : "Start Interview"}
                  </button>

                  <Link
                    to="/roadmap"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
                  >
                    Open Roadmap <ArrowRight size={18} />
                  </Link>
                </div>
              </div>

              <div className="rounded-[32px] border border-white/10 bg-white/5 p-7 shadow-2xl shadow-black/20 ring-1 ring-white/5">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
                  Session history
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  Previous interviews
                </h2>

                <div className="mt-6 space-y-3">
                  {sessions.length ? (
                    sessions.map((session) => (
                      <button
                        key={session.id}
                        onClick={() => handleOpenSession(session.id)}
                        className="block w-full rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-left transition hover:border-cyan-400/30 hover:bg-slate-900/80"
                      >
                        <p className="font-semibold text-white">{session.role}</p>
                        <p className="mt-1 text-sm text-slate-400">
                          Messages: {session.message_count}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          Updated: {formatDate(session.updated_at)}
                        </p>
                      </button>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-slate-300">
                      No interview sessions yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-7 shadow-2xl shadow-black/20 ring-1 ring-white/5">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
                Live session
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Interview conversation
              </h2>
              <p className="mt-2 text-slate-300">
                Continue the session with new answers and feedback.
              </p>

              {isLoading ? (
                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-slate-300">
                  Loading interview data...
                </div>
              ) : currentSession ? (
                <div className="mt-6">
                  <div className="mb-5 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <p className="text-sm text-slate-400">Interview role</p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {currentSession.role}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {currentSession.messages.map((messageItem, index) => (
                      <MessageBubble
                        key={`${messageItem.type}-${messageItem.created_at}-${index}`}
                        message={messageItem}
                      />
                    ))}
                  </div>

                  <div className="mt-6 rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
                    <label className="mb-2 block text-sm font-medium text-slate-200">
                      Your next answer
                    </label>

                    <textarea
                      value={answer}
                      onChange={(event) => setAnswer(event.target.value)}
                      placeholder="Write your answer here..."
                      className="min-h-37.5 w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-200 outline-none placeholder:text-slate-500 sm:min-h-42.5"
                    />

                    <button
                      type="button"
                      onClick={handleSendAnswer}
                      disabled={isSending}
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Send size={18} />
                      {isSending ? "Sending..." : "Send Answer"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-slate-300">
                  Start an interview session to begin practicing.
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

export default InterviewPage;