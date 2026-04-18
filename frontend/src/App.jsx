import { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import FeaturePaywallModal from "./components/common/FeaturePaywallModal";
import Footer from "./components/layout/Footer";
import BillingPage from "./pages/BillingPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import InterviewPage from "./pages/InterviewPage";
import LoginPage from "./pages/LoginPage";
import PrivacyPage from "./pages/PrivacyPage";
import ProfilePage from "./pages/ProfilePage";
import ResumePage from "./pages/ResumePage";
import RoadmapPage from "./pages/RoadmapPage";
import SignupPage from "./pages/SignupPage";
import SkillGapPage from "./pages/SkillGapPage";
import TermsPage from "./pages/TermsPage";
import ProtectedRoute from "./routes/ProtectedRoute";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function MobileNavLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
    >
      {children}
    </Link>
  );
}

function App() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featureLockData, setFeatureLockData] = useState(null);

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = mobileMenuOpen ? "hidden" : originalOverflow;

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handler = (event) => {
      setFeatureLockData(event.detail || {});
    };

    window.addEventListener("feature-locked", handler);

    return () => {
      window.removeEventListener("feature-locked", handler);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <ScrollToTop />

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold shadow-lg ring-1 ring-white/10">
              CP
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight sm:text-lg">
                CareerPilot AI
              </p>
              <p className="text-xs text-slate-400">AI-powered career growth</p>
            </div>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link to="/" className="text-sm text-slate-300 transition hover:text-white">
              Home
            </Link>

            {isHomePage && !isAuthenticated && (
              <>
                <a href="#features" className="text-sm text-slate-300 transition hover:text-white">
                  Features
                </a>
                <a href="#how-it-works" className="text-sm text-slate-300 transition hover:text-white">
                  How it works
                </a>
                <a href="#why-built" className="text-sm text-slate-300 transition hover:text-white">
                  Why I built it
                </a>
              </>
            )}

            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/5"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/5"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/5"
                >
                  Profile
                </Link>
                <Link
                  to="/resume"
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/5"
                >
                  Resume
                </Link>
                <Link
                  to="/skill-gap"
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/5"
                >
                  Skill Gap
                </Link>
                <Link
                  to="/roadmap"
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/5"
                >
                  Roadmap
                </Link>
                <Link
                  to="/interview"
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/5"
                >
                  Interview
                </Link>
                <Link
                  to="/billing"
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/5"
                >
                  Billing
                </Link>
                <button
                  onClick={logout}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-2.5 text-white transition hover:bg-white/10 md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 backdrop-blur-xl md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-3">
              <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>
                Home
              </MobileNavLink>

              {isHomePage && !isAuthenticated && (
                <>
                  <a
                    href="#features"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
                  >
                    Features
                  </a>
                  <a
                    href="#how-it-works"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
                  >
                    How it works
                  </a>
                  <a
                    href="#why-built"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
                  >
                    Why I built it
                  </a>
                </>
              )}

              {!isAuthenticated ? (
                <>
                  <MobileNavLink to="/login" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </MobileNavLink>
                  <MobileNavLink to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </MobileNavLink>
                </>
              ) : (
                <>
                  <MobileNavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </MobileNavLink>
                  <MobileNavLink to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    Profile
                  </MobileNavLink>
                  <MobileNavLink to="/resume" onClick={() => setMobileMenuOpen(false)}>
                    Resume
                  </MobileNavLink>
                  <MobileNavLink to="/skill-gap" onClick={() => setMobileMenuOpen(false)}>
                    Skill Gap
                  </MobileNavLink>
                  <MobileNavLink to="/roadmap" onClick={() => setMobileMenuOpen(false)}>
                    Roadmap
                  </MobileNavLink>
                  <MobileNavLink to="/interview" onClick={() => setMobileMenuOpen(false)}>
                    Interview
                  </MobileNavLink>
                  <MobileNavLink to="/billing" onClick={() => setMobileMenuOpen(false)}>
                    Billing
                  </MobileNavLink>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="overflow-x-hidden">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resume"
            element={
              <ProtectedRoute>
                <ResumePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/skill-gap"
            element={
              <ProtectedRoute>
                <SkillGapPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <RoadmapPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <InterviewPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/billing"
            element={
              <ProtectedRoute>
                <BillingPage />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Footer />
      </main>

      <FeaturePaywallModal
        open={!!featureLockData}
        data={featureLockData}
        onClose={() => setFeatureLockData(null)}
      />
    </div>
  );
}

export default App;