import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Bot, 
  Code2, 
  FileText, 
  BarChart3, 
  HelpCircle, 
  Award,
  Zap,
  ShieldCheck,
  Target
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-cyan-500/20">
              IP
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Interview<span className="text-cyan-400">Pro</span> AI
              </span>
              <p className="text-[10px] text-slate-400 font-medium">AI-Powered Career Readiness</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-900 to-slate-900 -z-10"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-8 shadow-inner">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Next-Generation Career Readiness</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
            Practice Smarter. <br />
            Prepare Better. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-indigo-300 to-purple-400">
              Get Hired.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
            InterviewPro AI simulates real-world engineering interviews with adaptive AI interviewers. 
            Receive rigorous multi-rubric feedback, run live code against test cases in Python, C, and Java, 
            and identify your skill gaps before actual recruitment drives.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-base shadow-xl shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>Create Free Student Account</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700/90 border border-slate-700 text-white font-semibold text-base transition-all flex items-center justify-center gap-2"
            >
              <span>Live Student Demo</span>
            </Link>
          </div>

          {/* Social Proof Badges */}
          <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-8 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Tailored to 7+ Engineering Roles</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Multi-Rubric Evaluation (5 Metrics)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>Python, C, & Java Code Sandbox</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>PyMuPDF Resume Skill Matching</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Modules Grid */}
      <section className="py-20 bg-slate-950/60 border-y border-slate-800/80 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">Complete Interview Ecosystem</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">
              Everything you need to master your technical interviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all hover:shadow-xl hover:shadow-cyan-500/5 group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Question Generator</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Generate targeted questions filtered by job role, topic (DSA, DBMS, OS, AI), and difficulty with instant practice modes.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all hover:shadow-xl hover:shadow-indigo-500/5 group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Granular Answer Evaluation</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                No keyword matching. Evaluates technical depth, conceptual accuracy, clarity, and examples with an ideal model answer.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all hover:shadow-xl hover:shadow-purple-500/5 group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Adaptive Mock Interviews</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Simulate real technical, HR, or coding rounds. The AI maintains conversational context and asks intelligent follow-ups.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all hover:shadow-xl hover:shadow-emerald-500/5 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Coding Practice & Sandbox</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Write and execute solutions in Python, C, and Java in an isolated sandbox with automated test case evaluation.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all hover:shadow-xl hover:shadow-amber-500/5 group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">PyMuPDF Resume Analyzer</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Upload your PDF resume to extract skills, detect missing competencies for your target role, and face resume-specific questions.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-7 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 transition-all hover:shadow-xl hover:shadow-rose-500/5 group">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Readiness Score & Analytics</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Transparent multi-factor score formula that tracks your improvement over time with Recharts interactive visualizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">Structured Preparation</h2>
            <p className="text-3xl font-extrabold text-white">How InterviewPro AI Prepares You</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-700/60 text-center">
              <div className="w-10 h-10 rounded-full bg-cyan-500 text-slate-950 font-black text-sm flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h4 className="font-bold text-white text-base mb-2">Select Your Target Role</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose from Python Developer, Java Developer, Full Stack, Data Analyst, or AI/ML Engineer to calibrate expectations.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-700/60 text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-white font-black text-sm flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h4 className="font-bold text-white text-base mb-2">Simulate Real Interviews</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Practice single questions or full adaptive mock sessions. The AI challenges your answers with realistic follow-ups.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-800/40 border border-slate-700/60 text-center">
              <div className="w-10 h-10 rounded-full bg-purple-500 text-white font-black text-sm flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h4 className="font-bold text-white text-base mb-2">Master Your Weak Areas</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Follow your personalized learning roadmap generated dynamically from your lowest-scoring topics and code submissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-6 bg-linear-to-r from-cyan-600 via-indigo-600 to-purple-700 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Ace Your Next Technical Interview?
          </h2>
          <p className="text-cyan-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of engineering students preparing smarter with actionable AI diagnostics.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-slate-900 font-bold text-base hover:bg-slate-100 shadow-xl transition-all"
          >
            <span>Get Started for Free</span>
            <ArrowRight className="w-5 h-5 text-indigo-600" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 px-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} InterviewPro AI — AI-Powered Interview Preparation Platform.</p>
          <p className="text-slate-400">Built for Engineering Students & Software Developers.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
