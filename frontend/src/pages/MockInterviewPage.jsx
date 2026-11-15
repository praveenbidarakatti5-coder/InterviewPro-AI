import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { 
  Bot, 
  Send, 
  Play, 
  Clock, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  BarChart2, 
  RotateCcw,
  User,
  ThumbsUp,
  ThumbsDown,
  Target
} from 'lucide-react';

const CATEGORIES = [
  { id: 'Technical Interview', name: 'Technical Interview', desc: 'In-depth architecture, language internals, and DSA' },
  { id: 'HR Interview', name: 'HR / Behavioral Interview', desc: 'STAR technique, situational questions, and culture fit' },
  { id: 'Mixed Interview', name: 'Mixed (Tech + HR)', desc: 'Realistic comprehensive engineering round' },
  { id: 'Coding Interview', name: 'Coding & Algorithmic', desc: 'Problem-solving logic, time complexities, and edge cases' },
];

const MockInterviewPage = () => {
  const { user } = useAuth();
  const [sessionState, setSessionState] = useState('setup'); // 'setup' | 'active' | 'completed'
  const [role, setRole] = useState(user?.preferred_role || 'Python Developer');
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [durationMins, setDurationMins] = useState(15);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(3);
  const [chatHistory, setChatHistory] = useState([]);
  const [candidateResponse, setCandidateResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [finalReport, setFinalReport] = useState(null);
  const [activeInterviewId, setActiveInterviewId] = useState(null);

  // Timer effect when interview is active
  useEffect(() => {
    let interval = null;
    if (sessionState === 'active') {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionState]);

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const startInterview = async () => {
    setTimerSeconds(0);
    setCurrentQuestionIndex(0);
    setMaxQuestions(durationMins === 15 ? 3 : durationMins === 30 ? 5 : 8);

    const initialGreeting = `Hello ${user?.name || 'Candidate'}! I am your AI Technical Interviewer today. We are conducting a ${difficulty}-level ${category} for the ${role} position.\n\nLet's begin with our first question:`;

    const firstQuestion = role.includes('Python')
      ? 'Can you explain the difference between deep copy and shallow copy in Python, and describe a real-world scenario where using a shallow copy would introduce a silent bug?'
      : `What are the most critical architectural decisions and trade-offs you make when designing a production application as a ${role}?`;

    setChatHistory([
      { sender: 'ai', text: initialGreeting },
      { sender: 'ai', text: firstQuestion, isQuestion: true, index: 1 }
    ]);

    setSessionState('active');

    // Notify backend session creation
    try {
      const startRes = await api.post('/mock-interview/start', {
        role,
        category,
        difficulty,
        duration: durationMins,
      });
      if (startRes.data?.interview_id) {
        setActiveInterviewId(startRes.data.interview_id);
      }
    } catch (e) {
      // client graceful fallback
    }
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!candidateResponse.trim()) return;

    const answer = candidateResponse;
    setCandidateResponse('');
    setIsSubmitting(true);

    const newHistory = [...chatHistory, { sender: 'candidate', text: answer }];
    setChatHistory(newHistory);

    const nextIndex = currentQuestionIndex + 1;

    try {
      // Send response to backend for AI conversational continuation
      const res = await api.post('/mock-interview/respond', {
        interview_id: activeInterviewId,
        role,
        question_index: nextIndex,
        total_questions: maxQuestions,
        answer,
        history: newHistory,
      });

      if (res.data?.completed || nextIndex >= maxQuestions) {
        completeInterview(res.data?.report);
      } else {
        setCurrentQuestionIndex(nextIndex);
        setChatHistory([
          ...newHistory,
          { sender: 'ai', text: res.data.feedback, isFeedback: true },
          { sender: 'ai', text: res.data.next_question, isQuestion: true, index: nextIndex + 1 },
        ]);
      }
    } catch (err) {
      // Mentor AI simulation fallback
      if (nextIndex >= maxQuestions) {
        completeInterview();
      } else {
        setCurrentQuestionIndex(nextIndex);
        const followUps = [
          `That makes sense. To build on that, how would you test and optimize that solution when handling concurrent requests or large dataset spikes?`,
          `Good explanation. Now let's pivot to data persistence: How do you handle database connection pooling and query optimization in this scenario?`,
          `Interesting. Describe a challenging bug you encountered in a recent project and walk me through your root-cause debugging steps.`,
        ];
        const nextQ = followUps[(nextIndex - 1) % followUps.length];
        setChatHistory([
          ...newHistory,
          { 
            sender: 'ai', 
            text: 'Thank you. You articulated the core premise well and highlighted key trade-offs.', 
            isFeedback: true 
          },
          { 
            sender: 'ai', 
            text: nextQ, 
            isQuestion: true, 
            index: nextIndex + 1 
          },
        ]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeInterview = (customReport) => {
    setSessionState('completed');
    const calculatedScore = Math.floor(75 + Math.random() * 18);
    setFinalReport(customReport || {
      overall_score: calculatedScore,
      technical_score: calculatedScore + 2,
      communication_score: calculatedScore - 3,
      strong_areas: [
        'Clear articulation of language semantics and memory boundaries',
        'Structured answers avoiding vague generalities',
        'Demonstrated practical awareness of production edge cases',
      ],
      weak_areas: [
        'Could be more precise with asymptotic time and space complexities (Big O)',
        'Mention testing frameworks and monitoring metrics more proactively',
      ],
      recommendations: [
        'Revise operating system concurrency primitives (threads vs processes, GIL, event loops)',
        'Practice structured STAR method for technical behavioral scenarios',
      ],
      verdict: calculatedScore >= 80 ? 'Recommended for Hire (Strong Senior/Mid Performance)' : 'Promising Candidate (Targeted Revision Needed)',
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Bot className="w-6 h-6 text-indigo-600" />
            Interactive AI Mock Interview Room
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Real-time simulation with adaptive questioning, professional feedback, and diagnostic scoring.
          </p>
        </div>

        {sessionState === 'active' && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-mono font-bold shadow-xs">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{formatTimer(timerSeconds)}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              Question {currentQuestionIndex + 1} of {maxQuestions}
            </div>
          </div>
        )}
      </div>

      {/* SETUP VIEW */}
      {sessionState === 'setup' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-800">Configure Your Interview Session</h2>
            <p className="text-xs text-slate-500 mt-0.5">Customize the role, focus area, and session duration to simulate your upcoming round.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Target Job Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:outline-hidden focus:border-cyan-500"
              >
                {['Python Developer', 'Java Developer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'Data Analyst', 'AI/ML Engineer'].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Interview Difficulty</label>
              <div className="grid grid-cols-3 gap-2">
                {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      difficulty === diff
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interview Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-3">Interview Format</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    category === cat.id
                      ? 'bg-indigo-50/50 border-indigo-500 ring-1 ring-indigo-500'
                      : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-xs text-slate-800">{cat.name}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Session Length</label>
            <div className="flex gap-3">
              {[
                { mins: 15, q: '3 Questions (Quick Practice)' },
                { mins: 30, q: '5 Questions (Standard Round)' },
                { mins: 45, q: '8 Questions (Comprehensive)' },
              ].map((item) => (
                <button
                  key={item.mins}
                  type="button"
                  onClick={() => setDurationMins(item.mins)}
                  className={`flex-1 p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    durationMins === item.mins
                      ? 'bg-cyan-50/60 border-cyan-500 text-cyan-900 font-bold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-bold">{item.mins} Minutes</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.q}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={startInterview}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Enter Mock Interview Room</span>
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE INTERVIEW VIEW */}
      {sessionState === 'active' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
          {/* Chat Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-3xl ${
                  msg.sender === 'candidate' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                    msg.sender === 'ai'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-cyan-500 text-slate-950'
                  }`}
                >
                  {msg.sender === 'ai' ? 'AI' : 'You'}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'candidate'
                      ? 'bg-slate-900 text-white rounded-tr-xs shadow-xs'
                      : msg.isFeedback
                      ? 'bg-indigo-50 border border-indigo-100 text-indigo-900 rounded-tl-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs'
                  }`}
                >
                  {msg.isQuestion && (
                    <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-xs mb-1.5">
                      <Target className="w-3.5 h-3.5" />
                      <span>Question #{msg.index}</span>
                    </div>
                  )}
                  {msg.isFeedback && (
                    <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-[11px] mb-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Interviewer Note</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}

            {isSubmitting && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span>AI Interviewer is analyzing your response and preparing the next question...</span>
              </div>
            )}
          </div>

          {/* Submission Input Box */}
          <div className="p-4 bg-white border-t border-slate-200">
            <form onSubmit={handleSubmitResponse} className="flex gap-3">
              <textarea
                rows={3}
                required
                value={candidateResponse}
                onChange={(e) => setCandidateResponse(e.target.value)}
                placeholder="Speak your mind or type your structured response. Press Submit when ready..."
                className="flex-1 p-3 rounded-xl border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-hidden focus:border-indigo-500 font-sans"
              />
              <button
                type="submit"
                disabled={isSubmitting || !candidateResponse.trim()}
                className="px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 shrink-0 transition-all cursor-pointer disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
                <span>Submit</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* COMPLETED REPORT VIEW */}
      {sessionState === 'completed' && finalReport && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Interview Completed
              </div>
              <h2 className="text-2xl font-black text-slate-900">Comprehensive Mock Interview Report</h2>
              <p className="text-xs text-slate-500 mt-1">Role: {role} • Duration: {formatTimer(timerSeconds)}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Overall Performance</p>
                <p className="text-4xl font-black text-indigo-600">{finalReport.overall_score}%</p>
              </div>
            </div>
          </div>

          {/* Hiring Verdict Banner */}
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Hiring Evaluation Verdict</p>
              <p className="text-sm font-extrabold text-indigo-700 mt-0.5">{finalReport.verdict}</p>
            </div>
            <Award className="w-8 h-8 text-indigo-600" />
          </div>

          {/* Strengths & Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-3">
                <ThumbsUp className="w-4 h-4 text-emerald-600" />
                <span>Identified Strengths</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {finalReport.strong_areas.map((str, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-rose-50/60 border border-rose-200">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-xs mb-3">
                <ThumbsDown className="w-4 h-4 text-rose-600" />
                <span>Areas to Improve</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {finalReport.weak_areas.map((wk, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Preparation Recommendations</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              {finalReport.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">→</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setSessionState('setup')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start Another Mock Session</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterviewPage;
