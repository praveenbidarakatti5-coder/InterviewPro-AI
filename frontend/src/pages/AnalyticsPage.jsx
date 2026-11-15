import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  Layers,
  HelpCircle,
  Code2
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

const scoreHistoryData = [
  { attempt: 'Mock 1', score: 62, coding: 50, avg: 56 },
  { attempt: 'Mock 2', score: 68, coding: 70, avg: 69 },
  { attempt: 'Mock 3', score: 71, coding: 80, avg: 75 },
  { attempt: 'Mock 4', score: 79, coding: 85, avg: 82 },
  { attempt: 'Mock 5', score: 85, coding: 92, avg: 88 },
];

const topicMasteryData = [
  { topic: 'Python', mastery: 85, benchmark: 80 },
  { topic: 'OOP Concepts', mastery: 78, benchmark: 75 },
  { topic: 'DSA', mastery: 72, benchmark: 75 },
  { topic: 'Operating Sys', mastery: 65, benchmark: 70 },
  { topic: 'DBMS & SQL', mastery: 58, benchmark: 75 },
  { topic: 'Networks', mastery: 62, benchmark: 65 },
];

const AnalyticsPage = () => {
  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-cyan-600" />
          Performance Analytics & Readiness Diagnostic
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Detailed metrics, historical interview trajectories, and transparent readiness scoring.
        </p>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Readiness Score</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-black text-cyan-600">76%</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +14% this month
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Status: <span className="font-bold text-slate-800">Interview Ready (Intermediate)</span>
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Coding Pass Rate</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-black text-purple-600">83%</span>
            <span className="text-xs text-slate-400">12 of 15 Solved</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Supported Languages: <span className="font-bold text-slate-800">Python, C, Java</span>
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Evaluation</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-black text-indigo-600">7.8</span>
            <span className="text-sm font-bold text-slate-400">/ 10</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Evaluated on: <span className="font-bold text-slate-800">5-Metric Rubric</span>
          </p>
        </div>
      </div>

      {/* Transparent Formula Breakdown Card */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-lg">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Target className="w-4 h-4" />
          <span>Transparent Readiness Score Calculation</span>
        </div>
        <h2 className="text-lg font-bold text-white mb-2">How Your Readiness Score (76%) is Derived</h2>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed mb-6">
          Unlike arbitrary black-box scores, InterviewPro AI computes your score using verifiable weighting criteria across all completed exercises:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-cyan-400 font-bold block text-sm">35% Weight</span>
            <span className="text-slate-300 block mt-1">Technical Accuracy</span>
            <span className="text-slate-500 text-[10px]">Avg: 8.2 / 10</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-indigo-400 font-bold block text-sm">25% Weight</span>
            <span className="text-slate-300 block mt-1">Mock Interview Performance</span>
            <span className="text-slate-500 text-[10px]">Avg: 78%</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-purple-400 font-bold block text-sm">25% Weight</span>
            <span className="text-slate-300 block mt-1">Coding Test Pass Rate</span>
            <span className="text-slate-500 text-[10px]">Pass: 83%</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-emerald-400 font-bold block text-sm">15% Weight</span>
            <span className="text-slate-300 block mt-1">Role Skill Coverage</span>
            <span className="text-slate-500 text-[10px]">Coverage: 75%</span>
          </div>
        </div>
      </div>

      {/* Score Progression Line Chart */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Historical Score Progression</h3>
            <p className="text-xs text-slate-500">Track improvement across technical mock interviews and coding rounds</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Upward Trend
          </span>
        </div>

        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scoreHistoryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="attempt" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis domain={[40, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                  border: 'none',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="score" name="Mock Interview Score" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="coding" name="Coding Accuracy" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Topic Comparison Bar Chart */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Topic Mastery vs Role Benchmark</h3>
            <p className="text-xs text-slate-500">Compare your proficiency against target industry requirements</p>
          </div>
        </div>

        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topicMasteryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="topic" stroke="#94a3b8" fontSize={11} tickLine={false} />
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
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="mastery" name="Your Mastery (%)" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              <Bar dataKey="benchmark" name="Target Benchmark (%)" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strongest vs Weakest Topics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Strongest Technical Topics</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-white border border-emerald-100">
              <span className="font-semibold text-slate-800">Python Internals & Standard Library</span>
              <span className="font-bold text-emerald-600">85%</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-white border border-emerald-100">
              <span className="font-semibold text-slate-800">Object-Oriented Programming (OOP)</span>
              <span className="font-bold text-emerald-600">78%</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider mb-3">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Weakest Topics (Requires Revision)</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-white border border-rose-100">
              <span className="font-semibold text-slate-800">Database Normalization & Indexing (DBMS)</span>
              <span className="font-bold text-rose-600">58%</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-white border border-rose-100">
              <span className="font-semibold text-slate-800">Operating System Concurrency & Deadlocks</span>
              <span className="font-bold text-rose-600">65%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
