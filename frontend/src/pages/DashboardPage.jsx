import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  FileText,
  Map,
  MessageSquareQuote,
  Sparkles,
  Target,
  UserCircle2,
} from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

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

function ActionCard({ icon: Icon, title, description, to, badge, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <Link
        to={to}
        className="group block rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/7"
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300 ring-1 ring-cyan-400/20">
            <Icon size={22} />
          </div>

          {badge && (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="mt-3 leading-7 text-slate-300">{description}</p>

        <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition group-hover:text-cyan-200">
          Open <ArrowRight size={16} />
        </div>
      </Link>
    </Reveal>
  );
}

function InfoCard({ title, value, subtitle, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 ring-1 ring-white/5">
        <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">{title}</p>
        <p className="mt-4 text-3xl font-bold text-white">{value}</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">{subtitle}</p>
      </div>
    </Reveal>
  );
}

function DashboardPage() {
  const { user, logout } = useAuth();

  const fieldsFilled = [
    user?.full_name,
    user?.email,
    user?.experience_level,
    user?.target_role,
    user?.bio,
    user?.skills?.length ? "skills" : "",
  ].filter(Boolean).length;

  const profileCompletion = Math.round((fieldsFilled / 6) * 100);

  return (
    <div className="relative min-h-[calc(100vh-81px)] overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.14),transparent_22%),linear-gradient(to_bottom,rgba(2,6,23,0.94),rgba(2,6,23,1))]" />
      <div className="absolute left-[-80px] top-16 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute right-[-100px] top-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 md:py-16">
        <Reveal>
          <div className="rounded-[28px] border border-white/10 bg-gradient-to-r from-cyan-500/12 via-slate-900 to-indigo-500/12 p-6 shadow-2xl shadow-black/25 ring-1 ring-white/5 sm:rounded-[36px] sm:p-8 md:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                  <Sparkles size={16} className="text-cyan-300" />
                  Your career workspace
                </div>

                <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl md:text-5xl">
                  Welcome back,
                  <span className="bg-gradient-to-r from-cyan-300 via-white to-indigo-300 bg-clip-text text-transparent">
                    {" "}
                    {user?.full_name || "User"}
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                  This dashboard is your central place for profile growth, future resume
                  analysis, skill-gap insights, roadmaps, and interview preparation.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:w-[320px] lg:grid-cols-1">
                <Link
                  to="/profile"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                  Edit Profile <ArrowRight size={18} />
                </Link>

                <button
                  onClick={logout}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <InfoCard
            delay={0.05}
            title="Profile completion"
            value={`${profileCompletion}%`}
            subtitle="The more complete your profile is, the better the future AI recommendations will be."
          />
          <InfoCard
            delay={0.12}
            title="Target role"
            value={user?.target_role || "Not set"}
            subtitle="Choose a target role to unlock more focused career analysis."
          />
          <InfoCard
            delay={0.19}
            title="Skills"
            value={user?.skills?.length || 0}
            subtitle="Your listed skills will be used later for skill-gap analysis and roadmap generation."
          />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal delay={0.08}>
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-7 shadow-2xl shadow-black/20 ring-1 ring-white/5">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                  <UserCircle2 size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Your profile snapshot</h2>
                  <p className="text-slate-300">
                    A quick overview of what is already configured.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <p className="text-sm text-slate-400">Full name</p>
                  <p className="mt-2 text-base font-medium text-white">
                    {user?.full_name || "Not set"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="mt-2 text-base font-medium text-white">
                    {user?.email || "Not set"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <p className="text-sm text-slate-400">Experience level</p>
                  <p className="mt-2 text-base font-medium text-white">
                    {user?.experience_level || "Not set"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <p className="text-sm text-slate-400">Target role</p>
                  <p className="mt-2 text-base font-medium text-white">
                    {user?.target_role || "Not set"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 md:col-span-2">
                  <p className="text-sm text-slate-400">Bio</p>
                  <p className="mt-2 text-base leading-7 text-white">
                    {user?.bio || "No bio added yet."}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 md:col-span-2">
                  <p className="text-sm text-slate-400">Skills</p>
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
                      <p className="text-base text-white">No skills added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-7 shadow-2xl shadow-black/20 ring-1 ring-white/5">
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
                Coming next
              </p>
              <h2 className="text-2xl font-bold text-white">What this dashboard will unlock</h2>
              <p className="mt-3 leading-7 text-slate-300">
                These modules are the next part of the system and will connect directly
                to your current profile.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="text-cyan-300" size={20} />
                    <p className="font-medium text-white">Resume Upload</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Upload your resume PDF and extract the content for analysis.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <div className="flex items-center gap-3">
                    <Brain className="text-cyan-300" size={20} />
                    <p className="font-medium text-white">AI Resume Review</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Discover strengths, weaknesses, and better ways to present yourself.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <div className="flex items-center gap-3">
                    <Map className="text-cyan-300" size={20} />
                    <p className="font-medium text-white">Roadmap Generator</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Get a structured weekly path toward your target role.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <div className="flex items-center gap-3">
                    <MessageSquareQuote className="text-cyan-300" size={20} />
                    <p className="font-medium text-white">Interview Coach</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Practice technical questions and receive AI feedback.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-10">
          <div className="mb-6">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
              Quick actions
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">Start from the right next step</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            <ActionCard
              icon={UserCircle2}
              title="Complete Profile"
              description="Improve your account details so future AI features can generate more useful results."
              to="/profile"
              badge="Available"
              delay={0.05}
            />
            <ActionCard
              icon={FileText}
              title="Resume Module"
              description="The next feature we are about to build: upload and manage your resume in the platform."
              to="/resume"
              badge="Next"
              delay={0.12}
            />
            <ActionCard
              icon={Target}
              title="Skill Gap Analysis"
              description="Later, compare your current profile against your desired role and identify missing skills."
              to="/skill-gap"
              badge="Available"
              delay={0.19}
            />
            <ActionCard
              icon={Brain}
              title="AI Career Insights"
              description="Future AI-powered analysis will connect your resume, skills, and career direction."
              to="/roadmap"
              badge="Available"
              delay={0.26}
            />
            <ActionCard
              icon={MessageSquareQuote}
              title="Interview Coach"
              description="Practice mock interview questions, answer in your own words, and get AI feedback with improvements and follow-up questions."
              to="/interview"
              badge="Available"
              delay={0.33}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;