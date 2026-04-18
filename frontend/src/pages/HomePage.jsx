import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  FileText,
  Map,
  MessageSquareQuote,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: FileText,
    title: "Smart Resume Review",
    description:
      "Upload your resume and get an AI review with strengths, weaknesses, and specific improvement points.",
  },
  {
    icon: Target,
    title: "Skill Gap Detection",
    description:
      "See exactly which skills are missing between where you are today and the role you want next.",
  },
  {
    icon: Map,
    title: "Personal Career Roadmap",
    description:
      "Generate a focused action plan with weekly steps so you know what to learn and build next.",
  },
  {
    icon: MessageSquareQuote,
    title: "Interview Practice",
    description:
      "Train with AI interview questions, answer in your own words, and get useful feedback instantly.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create your account",
    text: "Open your profile, add your background, and define your target role.",
  },
  {
    number: "02",
    title: "Upload your resume",
    text: "The system reads your resume and prepares it for smart AI analysis.",
  },
  {
    number: "03",
    title: "Get actionable feedback",
    text: "Receive insights about your strengths, weak spots, and next improvements.",
  },
  {
    number: "04",
    title: "Follow your roadmap",
    text: "Use the recommendations to improve your skills, projects, and interview readiness.",
  },
];

const benefits = [
  "Clear next step instead of random learning",
  "Practical AI feedback you can act on",
  "Professional project portfolio piece",
  "Focused growth for students and juniors",
];

function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      <p className="mb-4 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-sm font-medium text-cyan-300">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-8 text-slate-300 md:text-lg">
        {description}
      </p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, index }) {
  return (
    <Reveal delay={index * 0.08}>
      <div className="group h-full rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 ring-1 ring-white/5 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/7">
        <div className="mb-5 inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-300 ring-1 ring-cyan-400/20">
          <Icon size={24} />
        </div>
        <h3 className="mb-3 text-xl font-semibold text-white">{title}</h3>
        <p className="leading-7 text-slate-300">{description}</p>
      </div>
    </Reveal>
  );
}

function StepCard({ number, title, text, index }) {
  return (
    <Reveal delay={index * 0.08}>
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl ring-1 ring-white/5">
        <div className="mb-5 text-sm font-semibold tracking-[0.25em] text-cyan-300">
          {number}
        </div>
        <h3 className="mb-3 text-xl font-semibold text-white">{title}</h3>
        <p className="leading-7 text-slate-300">{text}</p>
      </div>
    </Reveal>
  );
}

function StatCard({ value, label, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center ring-1 ring-white/5">
        <p className="text-3xl font-bold text-white md:text-4xl">{value}</p>
        <p className="mt-2 text-sm text-slate-300">{label}</p>
      </div>
    </Reveal>
  );
}

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="overflow-x-hidden bg-slate-950">
      <section className="relative isolate">
        <div className="absolute inset-0 overflow-hidden">
          <video
            className="h-full w-full object-cover opacity-25"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-slate-950/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.16),transparent_25%),linear-gradient(to_bottom,rgba(2,6,23,0.15),rgba(2,6,23,1))]" />
        </div>

        <div className="absolute left-[-120px] top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-[-100px] top-36 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 md:pb-32 md:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 shadow-lg shadow-black/20 backdrop-blur">
              <Sparkles size={16} className="text-cyan-300" />
              AI Career Growth Platform for students and junior developers
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-7xl">
              Build your next
              <span className="bg-gradient-to-r from-cyan-300 via-white to-indigo-300 bg-clip-text text-transparent">
                {" "}
                tech career step
              </span>
              <br />
              with clarity.
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8 md:mt-8 md:text-xl">
              CareerPilot AI helps users understand where they are, what is missing,
              and what to do next through resume analysis, skill-gap detection,
              career roadmaps, and interview practice.
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:items-center sm:gap-4 sm:flex-row">
              <Link
                to={isAuthenticated ? "/dashboard" : "/signup"}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-xl shadow-white/10 transition hover:translate-y-[-2px] hover:bg-slate-200"
              >
                {isAuthenticated ? "Go to Dashboard" : "Start for Free"}
                <ArrowRight size={18} />
              </Link>

              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:border-white/20 hover:bg-white/10"
              >
                Explore Features
              </a>
            </div>
          </motion.div>

          <div className="mt-16 grid gap-4 md:mt-24 md:grid-cols-3">
            <StatCard value="Resume → Action" label="Turn passive CV feedback into concrete next steps" delay={0.1} />
            <StatCard value="Weekly Plan" label="Build a structured learning roadmap instead of guessing" delay={0.2} />
            <StatCard value="Interview Ready" label="Practice technical answers and improve with AI feedback" delay={0.3} />
          </div>
        </div>
      </section>

      <section id="features" className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
        <SectionHeading
          eyebrow="What this platform does"
          title="A smart assistant for career direction, not just another website"
          description="The goal is to help users move from confusion to action. Each feature is designed to show what to improve, what to build, and how to present yourself better."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} index={index} {...feature} />
          ))}
        </div>
      </section>

      <section className="relative border-y border-white/5 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 md:grid-cols-2 md:items-center md:py-32">
          <Reveal>
            <div>
              <p className="mb-4 inline-flex rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-1 text-sm font-medium text-indigo-300">
                Why this can help
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                Most students know they need to improve,
                <span className="text-cyan-300"> but not where to start.</span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-300">
                CareerPilot AI is built to reduce that uncertainty. Instead of random
                tutorials, scattered advice, and generic resume templates, the user gets
                a focused direction based on real goals and current skills.
              </p>

              <div className="mt-8 space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 text-cyan-300" size={20} />
                    <p className="text-slate-200">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-2xl shadow-black/25 ring-1 ring-white/5">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

              <div className="relative space-y-5">
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                    <Brain size={22} />
                  </div>
                  <div>
                    <p className="font-medium text-white">AI analysis</p>
                    <p className="text-sm text-slate-300">
                      Detects strengths, weak points, and opportunities.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="rounded-2xl bg-indigo-400/10 p-3 text-indigo-300">
                    <Target size={22} />
                  </div>
                  <div>
                    <p className="font-medium text-white">Career targeting</p>
                    <p className="text-sm text-slate-300">
                      Aligns the profile with the role the user really wants.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <p className="font-medium text-white">Actionable roadmap</p>
                    <p className="text-sm text-slate-300">
                      Gives a realistic plan instead of vague motivation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <SectionHeading
          eyebrow="How it works"
          title="A simple user journey from profile to progress"
          description="The product flow is designed to feel simple, practical, and useful from the first login."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <StepCard key={step.number} index={index} {...step} />
          ))}
        </div>
      </section>

      <section id="why-built" className="border-y border-white/5 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-[1.15fr_0.85fr] md:items-center md:py-32">
          <Reveal>
            <div>
              <p className="mb-4 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-sm font-medium text-cyan-300">
                Why I built it
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                This project was built to solve a real problem for people at the start of their career.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-300">
                Many students and junior developers know they need a better resume,
                stronger projects, and more interview confidence. But most of them do not
                have a structured path. The idea behind CareerPilot AI is to turn that messy
                process into a guided experience that feels modern, useful, and motivating.
              </p>

              <p className="mt-6 text-lg leading-8 text-slate-300">
                From a portfolio perspective, this project also demonstrates full-stack development,
                authentication, file handling, AI integration, user flows, and product thinking —
                all in one real product-style application.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-400/10 via-slate-900 to-indigo-500/10 p-8 shadow-2xl shadow-black/30 ring-1 ring-white/5">
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
                    Core vision
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-white">
                    Help users stop guessing and start progressing.
                  </p>
                </div>

                <div className="h-px bg-white/10" />

                <div className="space-y-4">
                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="font-medium text-white">Real user value</p>
                    <p className="mt-1 text-sm leading-7 text-slate-300">
                      Better resumes, clearer goals, smarter learning direction.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="font-medium text-white">Strong portfolio value</p>
                    <p className="mt-1 text-sm leading-7 text-slate-300">
                      Shows product thinking, backend architecture, AI integration, and polished UX.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <Reveal>
          <div className="overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-r from-cyan-500/15 via-slate-900 to-indigo-500/15 p-8 shadow-2xl shadow-black/25 ring-1 ring-white/5 md:p-12">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
                Ready to start
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                Build a better resume, a clearer plan, and a stronger direction.
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                CareerPilot AI is designed to help users move from uncertainty to action.
                Start now and turn your next career step into a structured process.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/signup"}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                  {isAuthenticated ? "Open Dashboard" : "Create Account"}
                  <ArrowRight size={18} />
                </Link>

                <a
                  href="#features"
                  className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Read more
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

export default HomePage;