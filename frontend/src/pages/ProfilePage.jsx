import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Briefcase,
  FileText,
  Save,
  Sparkles,
  User2,
  Wrench,
} from "lucide-react";
import { updateProfile } from "../api/userApi";
import { useAuth } from "../context/AuthContext";

function getErrorMessage(err, fallback) {
  const detail = err.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail[0]?.msg || fallback;
  }

  return detail || fallback;
}

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

function ProfilePage() {
  const { user, updateStoredUser } = useAuth();

  const [formData, setFormData] = useState({
    full_name: "",
    experience_level: "",
    target_role: "",
    skills: "",
    bio: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        experience_level: user.experience_level || "",
        target_role: user.target_role || "",
        skills: user.skills?.join(", ") || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const skillsList = useMemo(() => {
    return formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }, [formData.skills]);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        full_name: formData.full_name,
        experience_level: formData.experience_level,
        target_role: formData.target_role,
        skills: skillsList,
        bio: formData.bio,
      };

      const updatedUser = await updateProfile(payload);
      updateStoredUser(updatedUser);
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update profile"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-81px)] overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.14),transparent_24%),linear-gradient(to_bottom,rgba(2,6,23,0.95),rgba(2,6,23,1))]" />
      <div className="absolute left-[-90px] top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute right-[-120px] bottom-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-16">
        <Reveal>
          <div className="rounded-[36px] border border-white/10 bg-gradient-to-r from-cyan-500/12 via-slate-900 to-indigo-500/12 p-8 shadow-2xl shadow-black/25 ring-1 ring-white/5 md:p-10">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                <Sparkles size={16} className="text-cyan-300" />
                Build a stronger professional profile
              </div>

              <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                Shape the profile behind your
                <span className="bg-gradient-to-r from-cyan-300 via-white to-indigo-300 bg-clip-text text-transparent">
                  {" "}
                  career direction
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Your profile will power future AI features like resume analysis,
                skill-gap detection, roadmaps, and interview coaching.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal delay={0.08}>
            <form
              onSubmit={handleSubmit}
              className="rounded-[32px] border border-white/10 bg-white/5 p-7 shadow-2xl shadow-black/20 ring-1 ring-white/5 backdrop-blur"
            >
              <div className="mb-8">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
                  Profile form
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">Update your details</h2>
                <p className="mt-2 text-slate-300">
                  Add the information that best represents your current level and goals.
                </p>
              </div>

              <div className="grid gap-5">
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
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Experience Level
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-300 focus-within:border-cyan-400/40">
                    <BadgeCheck size={18} className="text-cyan-300" />
                    <input
                      type="text"
                      name="experience_level"
                      value={formData.experience_level}
                      onChange={handleChange}
                      placeholder="student / junior / mid / senior"
                      className="w-full bg-transparent outline-none placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Target Role
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-300 focus-within:border-cyan-400/40">
                    <Briefcase size={18} className="text-cyan-300" />
                    <input
                      type="text"
                      name="target_role"
                      value={formData.target_role}
                      onChange={handleChange}
                      placeholder="backend developer"
                      className="w-full bg-transparent outline-none placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Skills
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-300 focus-within:border-cyan-400/40">
                    <Wrench size={18} className="text-cyan-300" />
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="python, fastapi, mongodb"
                      className="w-full bg-transparent outline-none placeholder:text-slate-500"
                    />
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    Separate skills with commas.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Bio
                  </label>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 focus-within:border-cyan-400/40">
                    <div className="mb-2 flex items-center gap-2 text-cyan-300">
                      <FileText size={18} />
                      <span className="text-sm">Professional Summary</span>
                    </div>

                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Write a short professional summary about yourself..."
                      className="min-h-[160px] w-full resize-none bg-transparent text-slate-200 outline-none placeholder:text-slate-500"
                    />
                  </div>
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Save size={18} />
                {isSubmitting ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="space-y-6">
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-7 shadow-2xl shadow-black/20 ring-1 ring-white/5">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
                  Live preview
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">How your profile looks</h2>
                <p className="mt-2 leading-7 text-slate-300">
                  This preview reflects the information that will later support AI analysis.
                </p>

                <div className="mt-6 rounded-[28px] border border-white/10 bg-slate-900/70 p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/20">
                      <User2 size={24} />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-white">
                        {formData.full_name || "Your name"}
                      </p>
                      <p className="text-slate-400">
                        {formData.target_role || "Target role not set"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-5">
                    <div>
                      <p className="text-sm text-slate-400">Experience level</p>
                      <p className="mt-1 text-base text-white">
                        {formData.experience_level || "Not set"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-400">Bio</p>
                      <p className="mt-1 text-base leading-7 text-white">
                        {formData.bio || "Your professional summary will appear here."}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-400">Skills</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {skillsList.length ? (
                          skillsList.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-white">No skills added yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] border border-white/10 bg-white/5 p-7 shadow-2xl shadow-black/20 ring-1 ring-white/5">
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
                  Why this matters
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">A better profile means better results</h2>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-slate-300">
                    A complete target role helps roadmap generation become more focused.
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-slate-300">
                    Skills will later be compared against the role you want.
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-slate-300">
                    Your bio helps the platform understand how to position you better.
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;