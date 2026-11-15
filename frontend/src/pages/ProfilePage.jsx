import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Briefcase, 
  Save, 
  CheckCircle2, 
  Plus, 
  X, 
  Award,
  Sparkles
} from 'lucide-react';

const ROLES = [
  'Python Developer',
  'Java Developer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data Analyst',
  'AI/ML Engineer',
];

const INITIAL_SKILLS = [
  { name: 'Python', level: 'Advanced' },
  { name: 'Data Structures & Algorithms', level: 'Intermediate' },
  { name: 'SQL & Database Design', level: 'Intermediate' },
  { name: 'Object-Oriented Programming', level: 'Advanced' },
  { name: 'C Programming', level: 'Intermediate' },
  { name: 'FastAPI REST APIs', level: 'Beginner' },
];

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [preferredRole, setPreferredRole] = useState(user?.preferred_role || ROLES[0]);
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    setSkills([...skills, { name: newSkillName.trim(), level: newSkillLevel }]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillNameToRemove) => {
    setSkills(skills.filter((s) => s.name !== skillNameToRemove));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    await updateProfile({
      name,
      preferred_role: preferredRole,
      skills,
    });

    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Student Profile & Settings</h1>
        <p className="text-slate-500 text-xs mt-1">
          Configure your target engineering role, skills inventory, and personal preferences
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile changes and target role updated successfully!</span>
        </div>
      )}

      {/* Basic Profile Information */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h2 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-cyan-600" />
          Personal Details & Target Career
        </h2>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-hidden focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email (Primary Account)</label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-cyan-600" />
              Target Job Role (Calibrates AI Question Complexity)
            </label>
            <select
              value={preferredRole}
              onChange={(e) => setPreferredRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-hidden focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Technical Skills Inventory */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <h2 className="text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          Technical Skills Inventory
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Skills listed here feed into your readiness calculations and help tailor mock interview questions.
        </p>

        {/* Existing Skills Badges */}
        <div className="flex flex-wrap gap-2.5 mb-6">
          {skills.map((skill) => (
            <span
              key={skill.name}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700"
            >
              <span className="font-semibold">{skill.name}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                skill.level === 'Advanced' 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : skill.level === 'Intermediate' 
                  ? 'bg-cyan-50 text-cyan-700' 
                  : 'bg-amber-50 text-amber-700'
              }`}>
                {skill.level}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill.name)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>

        {/* Add Skill Input Form */}
        <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
          <input
            type="text"
            placeholder="Add new technical skill (e.g., Docker, Spring Boot, PyTorch)"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-cyan-500"
          />
          <select
            value={newSkillLevel}
            onChange={(e) => setNewSkillLevel(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-hidden focus:border-cyan-500"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
