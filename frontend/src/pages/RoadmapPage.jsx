import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Map, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  AlertTriangle, 
  Sparkles, 
  BookOpen, 
  Layers,
  ChevronRight,
  TrendingUp,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

const INITIAL_ROADMAP_ITEMS = [
  {
    id: 'r1',
    topic: 'Database Management Systems (DBMS)',
    score: 58,
    priority: 'High Priority',
    title: 'Master Normalization & SQL Query Optimization',
    tasks: [
      { id: 't1', title: 'Revise 1NF, 2NF, 3NF, and BCNF normalization anomalies', done: false },
      { id: 't2', title: 'Practice complex SQL queries with INNER, LEFT, and FULL OUTER JOINs', done: true },
      { id: 't3', title: 'Study B-Tree and Hash indexing trade-offs and query execution plans', done: false },
      { id: 't4', title: 'Understand ACID properties and transaction isolation levels', done: false },
    ]
  },
  {
    id: 'r2',
    topic: 'Operating Systems (OS)',
    score: 65,
    priority: 'High Priority',
    title: 'Deep-Dive Concurrency, Threads & Deadlocks',
    tasks: [
      { id: 't5', title: 'Review CPU scheduling algorithms (Round Robin, Multi-level Feedback Queues)', done: true },
      { id: 't6', title: 'Study the 4 necessary conditions for Deadlock and Banker\'s algorithm', done: false },
      { id: 't7', title: 'Understand Virtual Memory, Paging, and Page Replacement algorithms (LRU)', done: false },
    ]
  },
  {
    id: 'r3',
    topic: 'Data Structures and Algorithms (DSA)',
    score: 72,
    priority: 'Medium Priority',
    title: 'Refine Tree Traversals & Dynamic Programming',
    tasks: [
      { id: 't8', title: 'Implement Binary Tree Inorder, Preorder, Postorder iteratively and recursively', done: true },
      { id: 't9', title: 'Solve 5 medium Graph BFS/DFS problems on cycle detection', done: false },
      { id: 't10', title: 'Practice Memoization vs Tabulation on 0/1 Knapsack variations', done: false },
    ]
  },
  {
    id: 'r4',
    topic: 'Python Internals & OOP',
    score: 85,
    priority: 'Low Priority (Maintenance)',
    title: 'Advanced Memory & Concurrency Optimization',
    tasks: [
      { id: 't11', title: 'Understand the Global Interpreter Lock (GIL) and asyncio event loop', done: true },
      { id: 't12', title: 'Explore Python metaclasses, dunder methods, and memory slots (__slots__)', done: true },
    ]
  }
];

const RoadmapPage = () => {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState(INITIAL_ROADMAP_ITEMS);

  const toggleTask = (topicId, taskId) => {
    setRoadmap((prev) =>
      prev.map((item) => {
        if (item.id === topicId) {
          return {
            ...item,
            tasks: item.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Map className="w-6 h-6 text-cyan-600" />
          Personalized Learning & Revision Roadmap
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Dynamic study plan prioritized by your lowest-scoring topics across interviews and assessments.
        </p>
      </div>

      {/* Target Role & Progress Banner */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Curated Strategy</span>
          <h2 className="text-xl font-bold mt-1">Target: {user?.preferred_role || 'Python Developer'}</h2>
          <p className="text-xs text-slate-400 mt-0.5">Focusing on closing knowledge gaps in DBMS and Operating Systems</p>
        </div>

        <Link
          to="/questions"
          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shrink-0"
        >
          <span>Practice Weak Topics Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Roadmap Modules List */}
      <div className="space-y-6">
        {roadmap.map((module) => {
          const totalTasks = module.tasks.length;
          const completedTasks = module.tasks.filter((t) => t.done).length;
          const progressPercent = Math.round((completedTasks / totalTasks) * 100);

          return (
            <div key={module.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      module.priority.includes('High')
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : module.priority.includes('Medium')
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {module.priority}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{module.topic}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-800">{module.title}</h3>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-700">{completedTasks} of {totalTasks} Completed</span>
                  <div className="w-32 h-2 rounded-full bg-slate-100 overflow-hidden mt-1.5">
                    <div
                      className="h-full bg-cyan-500 rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Task Checkboxes */}
              <div className="space-y-2.5 mt-4">
                {module.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(module.id, task.id)}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-colors cursor-pointer ${
                      task.done
                        ? 'bg-slate-50/70 border-slate-200 text-slate-400 line-through'
                        : 'bg-white border-slate-200 hover:border-cyan-400 text-slate-700'
                    }`}
                  >
                    {task.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                    <span className="text-xs font-medium">{task.title}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapPage;
