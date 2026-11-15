import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  HelpCircle, 
  Bot, 
  Code2, 
  FileText, 
  Map, 
  BarChart3, 
  UserCircle,
  Sparkles
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Question Gen', path: '/questions', icon: HelpCircle },
  { name: 'Mock Interview', path: '/mock-interview', icon: Bot, badge: 'AI Live' },
  { name: 'Coding Practice', path: '/coding', icon: Code2 },
  { name: 'Resume Analyzer', path: '/resume', icon: FileText, badge: 'PDF' },
  { name: 'Learning Roadmap', path: '/roadmap', icon: Map },
  { name: 'Performance Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Profile & Role', path: '/profile', icon: UserCircle },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      <div className="p-4 flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-3">
          Preparation Modules
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Pro Tip Card */}
      <div className="p-4 m-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Daily Tip</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Focus on explaining the <em>why</em>, not just the <em>what</em>. Interviewers look for trade-off awareness.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
