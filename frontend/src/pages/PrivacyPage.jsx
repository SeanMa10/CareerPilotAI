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

function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            This page explains which data is collected, why it is stored, and how it is used inside CareerPilot AI.
          </p>
        </motion.div>

        <div className="space-y-6">
          <Section title="1. Data we collect" delay={0.05}>
            <p>
              We may store account data such as your full name, email address, password hash, profile details,
              target role, listed skills, uploaded resume content, AI reports, interview sessions, and feature usage counters.
            </p>
            <p>
              We also store legal acceptance metadata such as accepted terms version, privacy version, acceptance timestamp,
              IP address, and user-agent when you create an account.
            </p>
          </Section>

          <Section title="2. Why we store this data" delay={0.1}>
            <p>
              Your data is stored to authenticate your account, personalize AI features, save progress,
              display reports, and protect the platform from abuse.
            </p>
          </Section>

          <Section title="3. AI processing" delay={0.15}>
            <p>
              Resume text, profile data, roadmap requests, skill gap requests, and interview answers may be sent to AI providers
              in order to generate platform results.
            </p>
            <p>
              These requests are used only to operate the features you choose to use inside the platform.
            </p>
          </Section>

          <Section title="4. Security and protection" delay={0.2}>
            <p>
              We use password hashing, access controls, security headers, request validation, and abuse protections such as rate limiting.
            </p>
            <p>
              No system can guarantee absolute security, but reasonable steps are taken to protect stored user data.
            </p>
          </Section>

          <Section title="5. Retention" delay={0.25}>
            <p>
              Your profile, uploads, AI outputs, and usage data may remain stored while your account is active
              unless deletion tools are later added or administrative deletion is requested.
            </p>
          </Section>

          <Section title="6. Payments" delay={0.3}>
            <p>
              At the current stage, payments are not active. When subscriptions go live, the billing workflow and related payment handling
              details will be added to this policy.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPage;