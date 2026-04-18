import { Link } from "react-router";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-slate-950/70">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <div>
            © {year} CareerPilot AI. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/terms" className="transition hover:text-white">
              Terms of Use
            </Link>
            <Link to="/privacy" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/billing" className="transition hover:text-white">
              Billing
            </Link>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-6 text-slate-400">
          CareerPilot AI is a student portfolio project created for educational,
          demonstration, and showcase purposes only. It is not an official
          commercial service, and its AI-generated outputs are provided for
          guidance only. All third-party names, trademarks, and platforms remain
          the property of their respective owners.
        </div>
      </div>
    </footer>
  );
}

export default Footer;