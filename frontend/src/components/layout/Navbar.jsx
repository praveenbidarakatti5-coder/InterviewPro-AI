import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-4">
        <div 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-navy-900 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            IP
          </div>
          <span className="font-bold text-slate-800 text-lg hidden sm:inline">
            Interview<span className="text-cyan-600">Pro</span> AI
          </span>
        </div>

        <div className="hidden md:flex items-center pl-4 border-l border-slate-200">
          <span className="text-xs font-medium px-2.5 py-1 bg-cyan-50 text-cyan-700 rounded-full border border-cyan-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            Target: {user?.preferred_role || 'Python Developer'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Mock interview CTA */}
        <button
          onClick={() => navigate('/mock-interview')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Start Mock Interview
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <button 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-medium text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.name || 'Candidate'}</p>
              <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{user?.email}</p>
            </div>
          </button>

          <button
            onClick={handleLogout}
            title="Log out"
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
