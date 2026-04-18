import { motion, AnimatePresence } from "framer-motion";
import { Lock, Sparkles, X } from "lucide-react";
import { Link } from "react-router";

function FeaturePaywallModal({ open, data, onClose }) {
  if (!open) return null;

  const title = data?.feature_key
    ? data.feature_key.replaceAll("_", " ")
    : "premium feature";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-lg rounded-[28px] border border-white/10 bg-slate-950 p-6 shadow-2xl ring-1 ring-white/10 sm:p-8"
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300 ring-1 ring-cyan-400/20">
                <Lock size={22} />
              </div>

              <div>
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-300">
                  Free usage finished
                </p>
                <h2 className="mt-1 text-2xl font-bold text-white">
                  {title}
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-cyan-300">
              <Sparkles size={16} />
              <span className="text-sm font-medium">Access notice</span>
            </div>

            <p className="leading-7 text-slate-200">
              {data?.message ||
                "You already used your free access for this feature. Paid plans will be available soon."}
            </p>

            <p className="mt-3 text-sm text-slate-400">
              For now, the payment flow is not live yet. Your account will be able to upgrade from the Billing page once subscriptions are enabled.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/billing"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Open Billing
            </Link>

            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default FeaturePaywallModal;