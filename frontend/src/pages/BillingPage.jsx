import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Lock, Sparkles } from "lucide-react";
import { getAccessStatus } from "../api/accessApi";
import { getErrorMessage } from "../utils/apiErrors";

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

function BillingPage() {
  const [accessStatus, setAccessStatus] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAccessStatus = async () => {
      try {
        const data = await getAccessStatus();
        setAccessStatus(data);
      } catch (err) {
        setError(getErrorMessage(err, "Failed to load access status"));
      } finally {
        setIsLoading(false);
      }
    };

    loadAccessStatus();
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-81px)] overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),linear-gradient(to_bottom,rgba(2,6,23,0.96),rgba(2,6,23,1))]" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 md:py-16">
        <Reveal>
          <div className="rounded-[28px] border border-white/10 bg-gradient-to-r from-cyan-500/12 via-slate-900 to-indigo-500/12 p-6 shadow-2xl shadow-black/25 ring-1 ring-white/5 sm:rounded-[36px] sm:p-8 md:p-10">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                <Sparkles size={16} className="text-cyan-300" />
                Access and future billing
              </div>

              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl md:text-5xl">
                One free use per AI feature,
                <span className="bg-gradient-to-r from-cyan-300 via-white to-indigo-300 bg-clip-text text-transparent">
                  {" "}then paid plans later
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Payments are not live yet. Right now, each AI feature can be used once for free.
                Once the free use is finished, the platform will show a locked access popup until subscriptions are added.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal delay={0.08}>
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-7 shadow-2xl shadow-black/20 ring-1 ring-white/5">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
                Planned pricing
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Future Pro plan
              </h2>

              <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
                <p className="text-sm text-cyan-200">Planned monthly price</p>
                <p className="mt-2 text-4xl font-black text-white">
                  ${accessStatus?.future_plan_price_usd ?? 1}
                  <span className="text-lg font-medium text-cyan-100">/month</span>
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 text-cyan-300" size={20} />
                  <p className="text-slate-200">One free use for Resume Review</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 text-cyan-300" size={20} />
                  <p className="text-slate-200">One free use for Skill Gap</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 text-cyan-300" size={20} />
                  <p className="text-slate-200">One free use for Roadmap</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 text-cyan-300" size={20} />
                  <p className="text-slate-200">One free interview answer cycle</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm leading-7 text-amber-100">
                Payments are coming later. For now this page is informational only.
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-7 shadow-2xl shadow-black/20 ring-1 ring-white/5">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-300">
                Current usage
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Free access status
              </h2>

              {isLoading ? (
                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-slate-300">
                  Loading access status...
                </div>
              ) : error ? (
                <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-6 text-red-200">
                  {error}
                </div>
              ) : (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {Object.entries(accessStatus?.features || {}).map(([featureKey, featureValue]) => (
                    <div
                      key={featureKey}
                      className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
                    >
                      <div className="mb-3 flex items-center gap-2 text-cyan-300">
                        <Lock size={18} />
                        <p className="font-medium uppercase tracking-[0.18em]">
                          {featureKey.replaceAll("_", " ")}
                        </p>
                      </div>

                      <p className="text-slate-300">
                        Used: <span className="font-semibold text-white">{featureValue.used}</span>
                      </p>
                      <p className="mt-1 text-slate-300">
                        Free limit: <span className="font-semibold text-white">{featureValue.free_limit}</span>
                      </p>
                      <p className="mt-1 text-slate-300">
                        Remaining: <span className="font-semibold text-white">{featureValue.remaining_free_uses}</span>
                      </p>
                      <p className="mt-3 text-sm text-slate-400">
                        {featureValue.locked ? "Locked after free use" : "Still available for free"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

export default BillingPage;