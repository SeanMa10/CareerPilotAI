import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail, Sparkles, User2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/apiErrors";

function SignupPage() {
  const navigate = useNavigate();
  const { signupAction } = useAuth();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    accept_terms: false,
    accept_privacy: false,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.accept_terms || !formData.accept_privacy) {
      setError("You must accept the Terms of Use and Privacy Policy to create an account.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signupAction(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err, "Signup failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-81px)] overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.16),transparent_24%),linear-gradient(to_bottom,rgba(2,6,23,0.95),rgba(2,6,23,1))]" />
      <div className="absolute left-[-100px] top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute right-[-120px] bottom-10 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-81px)] max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="hidden lg:block"
        >
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur">
              <Sparkles size={16} className="text-cyan-300" />
              Start your journey with CareerPilot AI
            </div>

            <h1 className="text-5xl font-black tracking-tight text-white">
              Turn career confusion into
              <span className="bg-gradient-to-r from-cyan-300 via-white to-indigo-300 bg-clip-text text-transparent">
                {" "}
                clear next steps
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              Create your account to build a profile, upload your resume,
              get AI insights, and improve your readiness for real software roles.
            </p>

            <div className="mt-10 grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200">
                Build a profile around your real goals
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200">
                Prepare for AI-powered resume and skill analysis
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200">
                Use the platform under clear terms and privacy rules
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="mx-auto w-full max-w-md px-1 sm:px-0"
        >
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 ring-1 ring-white/5 backdrop-blur-xl sm:rounded-[32px] sm:p-8">
            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
                Sign Up
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                Create your account
              </h2>
              <p className="mt-3 text-slate-300">
                Start building your AI-powered career path.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Full Name
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-300 focus-within:border-cyan-400/40">
                  <User2 size={18} className="text-cyan-300" />
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full bg-transparent outline-none placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Email
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-300 focus-within:border-cyan-400/40">
                  <Mail size={18} className="text-cyan-300" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full bg-transparent outline-none placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Password
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-300 focus-within:border-cyan-400/40">
                  <Lock size={18} className="text-cyan-300" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    className="w-full bg-transparent outline-none placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                <label className="flex items-start gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    name="accept_terms"
                    checked={formData.accept_terms}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <span>
                    I agree to the{" "}
                    <Link to="/terms" className="font-medium text-cyan-300 hover:text-cyan-200">
                      Terms of Use
                    </Link>
                    .
                  </span>
                </label>

                <label className="flex items-start gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    name="accept_privacy"
                    checked={formData.accept_privacy}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <span>
                    I agree to the{" "}
                    <Link to="/privacy" className="font-medium text-cyan-300 hover:text-cyan-200">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
                {!isSubmitting && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-cyan-300 transition hover:text-cyan-200"
              >
                Log in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SignupPage;