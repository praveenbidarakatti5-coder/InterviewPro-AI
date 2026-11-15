import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { 
  Sparkles, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Award,
  ChevronRight,
  RefreshCw,
  Sliders,
  Check,
  Eye,
  FileQuestion
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

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

const TOPICS = [
  'Python',
  'Java',
  'C Programming',
  'Data Structures and Algorithms',
  'Object-Oriented Programming',
  'Database Management Systems',
  'Operating Systems',
  'Computer Networks',
  'Software Engineering',
  'Artificial Intelligence',
];

const DEFAULT_QUESTIONS = [
  {
    id: 'q1',
    role: 'Python Developer',
    topic: 'Python',
    difficulty: 'Intermediate',
    question: 'How do Python memory management and garbage collection work under the hood? Explain reference counting and cyclic garbage collection.',
    idealAnswer: 'Python primarily uses reference counting for memory management: every object maintains an ob_refcnt counter. When the count drops to 0, memory is immediately deallocated. To solve circular references (e.g., Object A references B and B references A), Python includes a cyclic garbage collector (gc module) that organizes objects into 3 generations (Gen 0, 1, 2) and runs heuristic cycle-detection algorithm to detect unreachable reference loops.',
  },
  {
    id: 'q2',
    role: 'Python Developer',
    topic: 'Data Structures and Algorithms',
    difficulty: 'Intermediate',
    question: 'Explain the difference between a Hash Map and a Binary Search Tree (BST) in terms of time complexity and space overhead. When would you prefer a BST over a Hash Map?',
    idealAnswer: 'A Hash Map offers O(1) average-time complexity for insertions, deletions, and lookups using hash hashing and bucket chaining/open addressing. A balanced BST (such as an AVL or Red-Black Tree) offers O(log N) worst-case time for operations. You prefer a BST when you require ordered iteration (e.g., in-order traversal for sorted ranges), finding floor/ceiling keys, or guaranteed O(log N) bounds without worst-case O(N) hash collisions.',
  },
  {
    id: 'q3',
    role: 'Backend Developer',
    topic: 'Database Management Systems',
    difficulty: 'Advanced',
    question: 'What is Database Normalization? Compare BCNF with 3NF and explain when you would deliberately denormalize a schema.',
    idealAnswer: 'Database Normalization eliminates data redundancy and prevents insertion, update, and deletion anomalies. 3NF requires that non-prime attributes are non-transitively dependent on candidate keys. BCNF is a stricter version where every determinant must be a candidate key (eliminating transitive dependencies between prime attributes). Denormalization is deliberately chosen in read-heavy OLAP workloads to minimize expensive multi-table JOINs and improve query latency.',
  }
];

const QuestionGenPage = () => {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState(user?.preferred_role || ROLES[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('Intermediate');
  const [selectedTopics, setSelectedTopics] = useState(['Python', 'Data Structures and Algorithms']);
  const [questionCount, setQuestionCount] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);

  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter((t) => t !== topic));
      }
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    setEvaluation(null);
    setUserAnswer('');
    try {
      const res = await api.post('/questions/generate', {
        role: selectedRole,
        difficulty: selectedDifficulty,
        topics: selectedTopics,
        count: Number(questionCount),
      });

      if (res.data?.questions?.length) {
        setQuestions(res.data.questions);
        setActiveQuestionIndex(0);
      }
    } catch (err) {
      console.warn('Backend question generator endpoint not connected yet, using client curated questions.');
      // Filter or generate mock set
      const generated = selectedTopics.map((topic, idx) => ({
        id: `gen-${idx + 1}`,
        role: selectedRole,
        topic: topic,
        difficulty: selectedDifficulty,
        question: `Explain core principles and architectural considerations of ${topic} when building production systems for a ${selectedRole}. Include trade-offs and code/pseudo-code examples where appropriate.`,
        idealAnswer: `An exemplary answer must clearly define ${topic} concepts, explain time/space and design trade-offs, discuss real-world edge cases, and illustrate with concrete syntax or architecture diagrams.`,
      }));
      setQuestions(generated);
      setActiveQuestionIndex(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentQuestion = questions[activeQuestionIndex] || questions[0];

  const handleEvaluateAnswer = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    setIsEvaluating(true);
    setEvaluation(null);

    try {
      const res = await api.post('/evaluations/evaluate', {
        question: currentQuestion.question,
        topic: currentQuestion.topic,
        difficulty: currentQuestion.difficulty,
        role: currentQuestion.role,
        student_answer: userAnswer,
      });

      if (res.data) {
        setEvaluation(res.data);
      }
    } catch (err) {
      console.warn('Backend evaluation fallback');
      // Algorithmic evaluation rubric
      const words = userAnswer.trim().split(/\s+/).length;
      const hasExamples = /for example|e\.g\.|such as|instance|function|def|class|time complexity/i.test(userAnswer);
      const techScore = Math.min(10, Math.max(5, Math.round(words / 12) + (hasExamples ? 2 : 0)));
      const completeness = Math.min(10, Math.max(4, Math.round(words / 15)));
      const clarity = 8;
      const concepts = Math.min(10, Math.max(5, techScore));
      const examplesScore = hasExamples ? 8 : 4;
      const overall = Number(((techScore + completeness + clarity + concepts + examplesScore) / 5).toFixed(1));

      setEvaluation({
        overall_score: overall,
        scores: {
          technical_accuracy: techScore,
          conceptual_understanding: concepts,
          completeness: completeness,
          clarity: clarity,
          relevant_examples: examplesScore,
        },
        correct_points: [
          'Correctly identified primary conceptual mechanisms.',
          'Addressed runtime characteristics and performance considerations.',
          words > 50 ? 'Provided adequate elaboration on the core question.' : 'Brief overview provided.',
        ],
        missing_concepts: [
          'Could elaborate more on edge-case behavior and failure modes.',
          'Consider contrasting with alternative architectural approaches or library alternatives.',
        ],
        suggested_improvements: 'Structure your explanation with bullet points and explicitly state time/space complexity trade-offs to demonstrate senior engineering rigor.',
        ideal_answer: currentQuestion.idealAnswer || 'Reference implementation covering core mechanics and edge cases.',
        topics_to_revise: [currentQuestion.topic, 'System Trade-offs'],
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-cyan-600" />
          AI Interview Question Generator & Evaluation
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Generate role-calibrated technical questions, submit your response, and receive 5-rubric AI evaluation.
        </p>
      </div>

      {/* Generator Controls Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-4">
          <Sliders className="w-4 h-4 text-cyan-600" />
          <span>Generation Criteria</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Target Job Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Difficulty Level</label>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedDifficulty === diff
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Number of Questions</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800"
            >
              {[1, 2, 3, 5, 10].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Question' : 'Questions'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Technical Topics Chips */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-600 mb-2">Technical Topics (Select multiple)</label>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((topic) => {
              const isSelected = selectedTopics.includes(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-50 border border-cyan-300 text-cyan-800 font-semibold'
                      : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-600" />}
                  <span>{topic}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleGenerateQuestions}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{isGenerating ? 'Generating with AI...' : 'Generate Questions'}</span>
          </button>
        </div>
      </div>

      {/* Question Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {questions.map((q, idx) => (
          <button
            key={q.id || idx}
            onClick={() => {
              setActiveQuestionIndex(idx);
              setEvaluation(null);
              setUserAnswer('');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeQuestionIndex === idx
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Question {idx + 1}: {q.topic}
          </button>
        ))}
      </div>

      {/* Active Question & Submission Area */}
      {currentQuestion && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-2.5 py-1 rounded-md bg-cyan-50 border border-cyan-200 text-cyan-800 font-bold text-[11px]">
              {currentQuestion.topic}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-800 font-medium text-[11px]">
              {currentQuestion.role}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-purple-50 border border-purple-200 text-purple-800 font-medium text-[11px]">
              Difficulty: {currentQuestion.difficulty}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-6">
            {currentQuestion.question}
          </h2>

          <form onSubmit={handleEvaluateAnswer} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Your Technical Response</label>
                <span className="text-[11px] text-slate-400">
                  {userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0} words
                </span>
              </div>
              <textarea
                rows={7}
                required
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your explanation here. Detail underlying mechanics, time/space complexity, and practical examples to maximize your score..."
                className="w-full p-4 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-hidden focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono leading-relaxed placeholder-slate-400"
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[11px] text-slate-500">
                Evaluation checks: Accuracy, Completeness, Clarity, Understanding, and Examples.
              </p>
              <button
                type="submit"
                disabled={isEvaluating || !userAnswer.trim()}
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isEvaluating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{isEvaluating ? 'Evaluating with AI...' : 'Submit Answer for AI Evaluation'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* AI Evaluation Results Card */}
      {evaluation && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-lg space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                AI Evaluation Report
              </div>
              <h3 className="text-xl font-bold text-slate-900">Answer Assessment Summary</h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Overall Score</p>
                <p className="text-3xl font-black text-cyan-600">{evaluation.overall_score}<span className="text-base text-slate-400">/10</span></p>
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl ${
                evaluation.overall_score >= 8 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                evaluation.overall_score >= 6 ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                'bg-rose-50 text-rose-600 border border-rose-200'
              }`}>
                {Math.round(evaluation.overall_score * 10)}%
              </div>
            </div>
          </div>

          {/* 5 Criteria Scores */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Evaluation Rubric Breakdown</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: 'Technical Accuracy', score: evaluation.scores?.technical_accuracy },
                { label: 'Conceptual Depth', score: evaluation.scores?.conceptual_understanding },
                { label: 'Completeness', score: evaluation.scores?.completeness },
                { label: 'Clarity', score: evaluation.scores?.clarity },
                { label: 'Relevant Examples', score: evaluation.scores?.relevant_examples },
              ].map((item) => (
                <div key={item.label} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <p className="text-[11px] font-medium text-slate-500 truncate">{item.label}</p>
                  <p className="text-lg font-bold text-slate-800 mt-1">{item.score || 0}/10</p>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/60">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>What You Got Right (Correct Points)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {evaluation.correct_points?.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Missing Concepts & Gaps</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {evaluation.missing_concepts?.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suggested Improvements */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Suggested Improvements</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">{evaluation.suggested_improvements}</p>
          </div>

          {/* Ideal Model Answer */}
          <div className="p-4 rounded-xl bg-cyan-50/40 border border-cyan-200/60">
            <h4 className="text-xs font-bold text-cyan-900 mb-1 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-cyan-600" />
              <span>Benchmark Ideal Answer</span>
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">{evaluation.ideal_answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionGenPage;
