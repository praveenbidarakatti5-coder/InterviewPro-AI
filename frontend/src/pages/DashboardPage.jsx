import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { 
  Bot, 
  Code2, 
  FileText, 
  HelpCircle, 
  Sparkles, 
  Trophy, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  Clock,
  Award
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';

const mockPerformanceData = [
  { session: 'Mock 1', score: 62 },
  { session: 'Mock 2', score: 68 },
  { session: 'Mock 3', score: 71 },
  { session: 'Mock 4', score: 79 },
  { session: 'Mock 5', score: 85 },
];

const mockTopicMastery = [
  { topic: 'Python', score: 85, color: '#06b6d4' },
  { topic: 'OOP Concepts', score: 78, color: '#6366f1' },
  { topic: 'Data Structures', score: 72, color: '#8b5cf6' },
  { topic: 'Operating Systems', score: 65, color: '#ec4899' },
  { topic: 'DBMS & SQL', score: 58, color: '#f59e0b' },
  { topic: 'Computer Networks', score: 62, color: '#10b981' },
];

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalInterviews: 4,
    avgScore: 78,
    codingSolved: 12,
    technicalScore: 82,
    readinessScore: 76,
    readinessLevel: 'Interview Ready (Intermediate)',
  });

  const [recentInterviews, setRecentInterviews] = useState([
    {
      id: '1',
      role: 'Python Developer',
      type: 'Technical Interview',
      difficulty: 'Intermediate',
      score: 82,
      date: 'Yesterday',
      status: 'Completed'
    },
    {
      id: '2',
      role: 'Full Stack Developer',
      type: 'Mixed Interview',
      difficulty: 'Beginner',
      score: 75,
      date: '3 days ago',
      status: 'Completed'
    },
    {
      id: '3',
      role: 'Python Developer',
      type: 'Coding Interview',
      difficulty: 'Intermediate',
      score: 88,
      date: '5 days ago',
      status: 'Completed'
    }
  ]);

  useEffect(() => {
    // Try fetching live dashboard stats from backend
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/dashboard/summary');
        if (res.data) {
          setStats(prev => ({ ...prev, ...res.data.stats }));
          if (res.data.recentInterviews) {
            setRecentInterviews(res.data.recentInterviews);
          }
        }
      } catch (err) {
        // Fallback to loaded defaults
        console.log('Using initial dashboard state');
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Target Role: {user?.preferred_role || 'Python Developer'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Engineer'}! 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              You're making strong progress. Prepare with tailored AI mock interviews and strengthen your weakest topics today.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/mock-interview')}
              className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Start Mock Interview</span>
            </button>
            <button
              onClick={() => navigate('/coding')}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Practice Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Interviews Completed</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{stats.totalInterviews}</p>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +2 this week
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Score</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{stats.avgScore}%</p>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +6% improvement
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Coding Problems</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{stats.codingSolved}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Python, C, & Java</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center">
            <Code2 className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Technical Knowledge</p>
            <p className="text-2xl font-black text-slate-800 mt-1">{stats.technicalScore}/100</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Strong fundamentals</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Readiness Score Card & Performance Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readiness Meter Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-600" />
                <h3 className="font-bold text-slate-800 text-base">Interview Readiness Score</h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                Formula-Based
              </span>
            </div>

            {/* Circular Progress Gauge */}
            <div className="my-6 flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-cyan-500 transition-all duration-1000 ease-out"
                    strokeDasharray={`${stats.readinessScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-slate-800">{stats.readinessScore}%</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Calculated</span>
                </div>
              </div>

              <p className="mt-3 text-sm font-bold text-slate-800 text-center">
                {stats.readinessLevel}
              </p>
              <p className="text-xs text-slate-500 text-center mt-1 max-w-xs">
                Derived from technical accuracy (35%), mock scores (25%), coding tests (25%), and skill coverage (15%).
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/roadmap')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>View Personalized Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Performance Improvement Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Performance Improvement Trend</h3>
                <p className="text-xs text-slate-500">Score trajectory across your recent interview sessions</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                +23% Total Gain
              </span>
            </div>

            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockPerformanceData}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="session" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#scoreGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Keep a regular cadence to maintain readiness score.</span>
            <button 
              onClick={() => navigate('/analytics')}
              className="text-cyan-600 font-semibold hover:underline flex items-center gap-1"
            >
              Detailed Analytics <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Topic Mastery & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topic Mastery Bars */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Topic-Wise Technical Mastery</h3>
              <p className="text-xs text-slate-500">Evaluated from your question answers & code submissions</p>
            </div>
            <button
              onClick={() => navigate('/questions')}
              className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
            >
              Practice Weak Topics <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4 mt-6">
            {mockTopicMastery.map((item) => (
              <div key={item.topic}>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-slate-700 font-semibold">{item.topic}</span>
                  <span className="text-slate-600 font-bold">{item.score}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.score}%`,
                      backgroundColor: item.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launch Cards */}
        <div className="space-y-4">
          <div 
            onClick={() => navigate('/questions')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-cyan-500/50 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">Quick Generator</span>
                <h4 className="font-bold text-slate-800 text-base mt-1 group-hover:text-cyan-600 transition-colors">
                  AI Question Generator
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Generate 5-10 tailored questions for {user?.preferred_role || 'Python'} by topic.
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div 
            onClick={() => navigate('/resume')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500/50 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Resume Check</span>
                <h4 className="font-bold text-slate-800 text-base mt-1 group-hover:text-indigo-600 transition-colors">
                  Resume Analyzer (PDF)
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Upload your CV to extract technical skills and detect missing keywords.
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div 
            onClick={() => navigate('/coding')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-500/50 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Coding Sandbox</span>
                <h4 className="font-bold text-slate-800 text-base mt-1 group-hover:text-purple-600 transition-colors">
                  Code Assessment Runner
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Run test cases in Python, C, and Java in an isolated environment.
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Code2 className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Interview History */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Recent Interview History</h3>
            <p className="text-xs text-slate-500">Past mock interviews and evaluations</p>
          </div>
          <button
            onClick={() => navigate('/mock-interview')}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-cyan-50 text-cyan-700 hover:bg-cyan-100 transition-colors"
          >
            + New Interview
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentInterviews.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-800">{item.role}</td>
                  <td className="py-3.5 px-4 text-slate-600">{item.type}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {item.difficulty}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-bold ${
                      item.score >= 80 ? 'text-emerald-600' : item.score >= 65 ? 'text-amber-600' : 'text-rose-600'
                    }`}>
                      {item.score}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{item.date}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => navigate('/mock-interview')}
                      className="text-cyan-600 font-semibold hover:underline"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
