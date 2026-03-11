import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  RotateCcw, 
  Trophy, 
  Timer, 
  BookOpen,
  HelpCircle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MCQ } from '../types';
import { dbService } from '../services/dbService';

const MOCK_MCQS: MCQ[] = [
  {
    id: '1',
    question: "What is the unit of Force in the SI system?",
    options: ["Joule", "Watt", "Newton", "Pascal"],
    correctIndex: 2,
    explanation: "The SI unit of force is the Newton (N), named after Sir Isaac Newton."
  },
  {
    id: '2',
    question: "Which of the following is a scalar quantity?",
    options: ["Velocity", "Force", "Displacement", "Speed"],
    correctIndex: 3,
    explanation: "Speed has only magnitude, while velocity, force, and displacement have both magnitude and direction."
  },
  {
    id: '3',
    question: "The rate of change of velocity is called:",
    options: ["Speed", "Acceleration", "Momentum", "Force"],
    correctIndex: 1,
    explanation: "Acceleration is defined as the rate of change of velocity with respect to time."
  }
];

export default function MCQPractice() {
  const [step, setStep] = useState<'select' | 'quiz' | 'result'>('select');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);

  // Load history and check for saved progress
  React.useEffect(() => {
    const saved = localStorage.getItem('mcq_progress');
    if (saved) {
      setHasSavedProgress(true);
    }

    dbService.getHistory().then(({ data }) => {
      if (data) {
        setHistory(data.filter((item: any) => item.type === 'mcq').slice(0, 3));
      }
    });
  }, []);

  // Auto-save progress
  React.useEffect(() => {
    if (step === 'quiz') {
      const progress = {
        currentIndex,
        score,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('mcq_progress', JSON.stringify(progress));
    } else if (step === 'result') {
      localStorage.removeItem('mcq_progress');
      setHasSavedProgress(false);
    }
  }, [currentIndex, score, step]);

  const handleResume = () => {
    const saved = localStorage.getItem('mcq_progress');
    if (saved) {
      const { currentIndex, score } = JSON.parse(saved);
      setCurrentIndex(currentIndex);
      setScore(score);
      setStep('quiz');
    }
  };

  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === MOCK_MCQS[currentIndex].correctIndex) {
      setScore(s => s + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex < MOCK_MCQS.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setStep('result');
      // Auto-save MCQ result
      dbService.saveMCQHistory({
        title: 'Physics: Dynamics Practice',
        subject: 'Physics',
        score: score,
        total: MOCK_MCQS.length
      }).catch(err => console.error("Auto-save failed:", err));
    }
  };

  const reset = () => {
    setStep('select');
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowExplanation(false);
  };

  if (step === 'select') {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black mb-4">MCQ Practice</h2>
          <p className="text-slate-500">Select a subject and topic to start practicing.</p>
        </div>

        {hasSavedProgress && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 bg-blue-600 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-200"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <RotateCcw size={24} />
              </div>
              <div>
                <h4 className="font-bold">Resume Last Session</h4>
                <p className="text-sm text-white/80">You have an unfinished Physics Dynamics quiz.</p>
              </div>
            </div>
            <button 
              onClick={handleResume}
              className="w-full sm:w-auto px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg"
            >
              Resume Now
            </button>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            <TopicCard 
              title="Physics 1st Paper" 
              topics={["Dynamics", "Vector", "Work, Energy & Power", "Gravitation"]} 
              onSelect={() => setStep('quiz')}
            />
            <TopicCard 
              title="Chemistry 1st Paper" 
              topics={["Qualitative Chemistry", "Periodic Table", "Chemical Changes"]} 
              onSelect={() => setStep('quiz')}
            />
            <TopicCard 
              title="Higher Math" 
              topics={["Trigonometry", "Calculus", "Matrix & Determinants"]} 
              onSelect={() => setStep('quiz')}
            />
            <TopicCard 
              title="Biology 1st Paper" 
              topics={["Cell & its Structure", "Cell Division", "Botany Basics"]} 
              onSelect={() => setStep('quiz')}
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-black flex items-center gap-2">
              <Trophy className="text-amber-500" size={24} />
              Recent Performance
            </h3>
            <div className="space-y-4">
              {history.length > 0 ? (
                history.map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-sm truncate pr-2">{item.title}</h4>
                      <span className="text-xs font-black text-emerald-600 shrink-0">{Math.round((item.score / item.total) * 100)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.subject}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.score}/{item.total} Correct</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-sm text-slate-400">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'result') {
    return (
      <div className="max-w-2xl mx-auto py-10 sm:py-20 text-center px-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-6 sm:p-12 rounded-3xl border border-slate-200 shadow-xl"
        >
          <div className="size-20 sm:size-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
            <Trophy size={48} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-2">Quiz Completed!</h2>
          <p className="text-sm sm:text-slate-500 mb-6 sm:mb-8">You've finished the Physics Dynamics practice set.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8 sm:mb-10">
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl">
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Score</p>
              <p className="text-2xl sm:text-3xl font-black text-blue-600">{score} / {MOCK_MCQS.length}</p>
            </div>
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl">
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Accuracy</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-500">{Math.round((score / MOCK_MCQS.length) * 100)}%</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={reset} className="flex-1 py-3 sm:py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Try Another Topic
            </button>
            <button onClick={reset} className="flex-1 py-3 sm:py-4 rounded-xl border border-slate-200 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              <RotateCcw size={20} /> Retake Quiz
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentMCQ = MOCK_MCQS[currentIndex];

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-8 px-4">
      {/* Quiz Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="size-9 sm:size-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <BookOpen size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base">Physics: Dynamics</h3>
            <p className="text-[10px] sm:text-xs text-slate-500">Question {currentIndex + 1} of {MOCK_MCQS.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500 font-mono text-xs sm:text-sm">
          <Timer size={16} /> 04:32
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5 sm:h-2 rounded-full mb-8 sm:mb-12 overflow-hidden">
        <motion.div 
          className="bg-blue-600 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / MOCK_MCQS.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm mb-6">
        <h4 className="text-lg sm:text-xl font-bold mb-6 sm:mb-8 leading-relaxed">{currentMCQ.question}</h4>
        
        <div className="space-y-3">
          {currentMCQ.options.map((option, idx) => {
            const isCorrect = idx === currentMCQ.correctIndex;
            const isSelected = idx === selectedOption;
            
            let stateClass = "border-slate-200 hover:border-blue-200 hover:bg-blue-50/30";
            if (selectedOption !== null) {
              if (isCorrect) stateClass = "border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20";
              else if (isSelected) stateClass = "border-red-500 bg-red-50 text-red-700 ring-2 ring-red-500/20";
              else stateClass = "border-slate-100 opacity-50";
            }

            return (
              <button 
                key={idx}
                disabled={selectedOption !== null}
                onClick={() => handleOptionSelect(idx)}
                className={`w-full p-4 sm:p-5 rounded-xl sm:rounded-2xl border text-left text-sm sm:text-base font-medium transition-all flex items-center justify-between group ${stateClass}`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className={`size-7 sm:size-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold transition-colors ${
                    isSelected ? "bg-white/50" : "bg-slate-100 group-hover:bg-blue-100"
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option}
                </div>
                {selectedOption !== null && isCorrect && <CheckCircle2 size={20} className="text-emerald-500" />}
                {selectedOption !== null && isSelected && !isCorrect && <XCircle size={20} className="text-red-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-8"
          >
            <div className="flex items-center gap-2 mb-3 text-blue-600">
              <Lightbulb size={18} />
              <h5 className="text-sm font-bold uppercase tracking-wider">AI Explanation</h5>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {currentMCQ.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Actions */}
      <div className="flex justify-end">
        <button 
          disabled={selectedOption === null}
          onClick={handleNext}
          className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:shadow-none"
        >
          {currentIndex === MOCK_MCQS.length - 1 ? "Finish Quiz" : "Next Question"} <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

function TopicCard({ title, topics, onSelect }: { title: string, topics: string[], onSelect: () => void }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-600 transition-all group shadow-sm">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="space-y-2 mb-6">
        {topics.map((t, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-slate-500">
            <ChevronRight size={14} className="text-blue-600" />
            {t}
          </div>
        ))}
      </div>
      <button 
        onClick={onSelect}
        className="w-full py-3 rounded-xl bg-slate-50 text-slate-600 font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-all"
      >
        Start Practice
      </button>
    </div>
  );
}
