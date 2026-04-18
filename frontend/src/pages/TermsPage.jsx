import { motion } from "framer-motion";

function Section({ title, children, delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay }}
      className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 ring-1 ring-white/5"
    >
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="mt-4 space-y-3 leading-7 text-slate-300">{children}</div>
    </motion.section>
  );
}

function TermsPage() {
  return (
    <div className="relative min-h-[calc(100vh-81px)] overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),linear-gradient(to_bottom,rgba(2,6,23,0.96),rgba(2,6,23,1))]" />

      <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-8 rounded-[28px] border border-white/10 bg-gradient-to-r from-cyan-500/12 via-slate-900 to-indigo-500/12 p-6 shadow-2xl shadow-black/25 ring-1 ring-white/5 sm:p-8"
        >
          <h1 className="text-2xl font-black text-white sm:text-3xl md:text-5xl">
            Terms of Use
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            By using CareerPilot AI, you agree to these terms. These terms describe the acceptable use of the platform, ownership rules, and service limitations.
          </p>
        </motion.div>

        <div className="space-y-6">
          <Section title="1. Use of the service" delay={0.05}>
            <p>
              CareerPilot AI is provided for professional development, resume analysis,
              roadmap generation, and interview practice.
            </p>
            <p>
              You agree not to misuse the service, attempt unauthorized access, automate abuse,
              overload the platform, reverse engineer protected logic, or use the site for unlawful purposes.
            </p>
          </Section>

          <Section title="2. Accounts and access" delay={0.1}>
            <p>
              You are responsible for maintaining the confidentiality of your account and login credentials.
            </p>
            <p>
              We may suspend or restrict access if we detect abuse, fraud, or behavior that threatens platform security or availability.
            </p>
          </Section>

          <Section title="3. AI-generated content" delay={0.15}>
            <p>
              AI-generated outputs are provided as guidance only and should not be treated as guaranteed professional, legal, or hiring outcomes.
            </p>
            <p>
              You remain responsible for reviewing and deciding how to use recommendations, resume edits, interview feedback, and roadmaps.
            </p>
          </Section>

          <Section title="4. Copyright and ownership" delay={0.2}>
            <p>
              You retain ownership of the resume, profile content, and other materials you upload.
            </p>
            <p>
              CareerPilot AI, including its codebase, interface design, branding, text, and platform structure,
              is protected by copyright and related intellectual property rights.
            </p>
            <p>
              You receive a limited right to use the service for personal and lawful use only. You may not copy,
              redistribute, resell, or commercially exploit the platform without permission.
            </p>
          </Section>

          <Section title="5. Service availability and changes" delay={0.25}>
            <p>
              We may improve, modify, limit, or remove features at any time, including pricing and feature access rules.
            </p>
            <p>
              Temporary outages, maintenance periods, model changes, and third-party service disruptions may affect availability.
            </p>
          </Section>

          <Section title="6. Limitation of liability" delay={0.3}>
            <p>
              The platform is provided on an “as available” basis without guarantees of uninterrupted availability or specific results.
            </p>
            <p>
              To the maximum extent permitted by law, we are not liable for indirect, consequential, or business-related losses arising from platform use.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;