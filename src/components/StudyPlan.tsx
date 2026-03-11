import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Sparkles, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight,
  ArrowRight,
  Plus,
  Target,
  Zap,
  Loader2,
  Trash2,
  AlertCircle,
  Pencil
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { dbService } from '../services/dbService';

interface ScheduleItemType {
  id: string;
  time: string;
  subject: string;
  topic: string;
  duration: string;
  status: 'completed' | 'current' | 'upcoming';
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const ALL_SUBJECTS = ["Physics", "Chemistry", "Higher Math", "Biology", "English", "ICT", "Accounting", "Economics"];

const createInitialSchedule = (day: string): ScheduleItemType[] => [
  { 
    id: `${day}-1`,
    time: "08:00 AM", 
    subject: "Physics", 
    topic: "Dynamics: Newton's Laws", 
    duration: "2h", 
    status: day === 'Mon' ? "completed" : "upcoming"
  },
  { 
    id: `${day}-2`,
    time: "10:30 AM", 
    subject: "Math", 
    topic: "Trigonometry: Inverse Functions", 
    duration: "1.5h", 
    status: day === 'Mon' ? "current" : "upcoming"
  },
  { 
    id: `${day}-3`,
    time: "02:00 PM", 
    subject: "Chemistry", 
    topic: "Periodic Table: Trends", 
    duration: "1.5h",
    status: "upcoming"
  },
  { 
    id: `${day}-4`,
    time: "04:00 PM", 
    subject: "Practice", 
    topic: "Daily MCQ Set #12", 
    duration: "1h",
    status: "upcoming"
  }
];

export default function StudyPlan() {
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["Physics", "Chemistry", "Higher Math"]);
  const [activeDay, setActiveDay] = useState('Mon');
  const [weeklySchedule, setWeeklySchedule] = useState<Record<string, ScheduleItemType[]>>(() => {
    const initial: Record<string, ScheduleItemType[]> = {};
    DAYS.forEach(day => {
      initial[day] = createInitialSchedule(day);
    });
    return initial;
  });
  const [config, setConfig] = useState({ exam: 'HSC 2024', hours: '6' });
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ time: '06:00 PM', subject: 'Physics', topic: '', duration: '1h' });

  // Auto-save effect
  useEffect(() => {
    if (isGenerated) {
      const timer = setTimeout(() => {
        dbService.saveStudyPlan({
          schedule: weeklySchedule,
          config: config,
          updated_at: new Date()
        }).catch(err => console.error("Auto-save study plan failed:", err));
      }, 1000); // Debounce save
      return () => clearTimeout(timer);
    }
  }, [weeklySchedule, config, isGenerated]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Randomize topics a bit for "generation" effect
      const newWeekly: Record<string, ScheduleItemType[]> = {};
      DAYS.forEach(day => {
        newWeekly[day] = selectedSubjects.map((sub, i) => ({
          id: `${day}-${i}-${Math.random()}`,
          time: `${8 + i * 2}:00 AM`,
          subject: sub,
          topic: `Chapter ${i + 1} Deep Dive`,
          duration: '2h',
          status: 'upcoming'
        }));
      });
      setWeeklySchedule(newWeekly);
      setIsGenerating(false);
      setIsGenerated(true);
    }, 2000);
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject) 
        : [...prev, subject]
    );
  };

  const addSubject = () => {
    const nextSubject = ALL_SUBJECTS.find(s => !selectedSubjects.includes(s));
    if (nextSubject) toggleSubject(nextSubject);
  };

  const finishSession = (id: string) => {
    setWeeklySchedule(prev => {
      const currentDaySchedule = prev[activeDay];
      const newSchedule = currentDaySchedule.map(item => {
        if (item.id === id) return { ...item, status: 'completed' as const };
        return item;
      });
      
      const nextUpcomingIndex = newSchedule.findIndex(item => item.status === 'upcoming');
      if (nextUpcomingIndex !== -1) {
        newSchedule[nextUpcomingIndex].status = 'current';
      }
      
      return { ...prev, [activeDay]: newSchedule };
    });
  };

  const startSession = (id: string) => {
    setWeeklySchedule(prev => {
      const currentDaySchedule = prev[activeDay];
      const newSchedule = currentDaySchedule.map(item => {
        if (item.id === id) return { ...item, status: 'current' as const };
        if (item.status === 'current') return { ...item, status: 'upcoming' as const };
        return item;
      });
      return { ...prev, [activeDay]: newSchedule };
    });
  };

  const deleteTask = (id: string) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [activeDay]: prev[activeDay].filter(item => item.id !== id)
    }));
  };

  const handleAddTask = () => {
    if (!newTask.topic) return;

    const parseTime = (timeStr: string) => {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    if (editingTaskId) {
      setWeeklySchedule(prev => {
        const currentDaySchedule = prev[activeDay];
        const newSchedule = currentDaySchedule.map(item => 
          item.id === editingTaskId ? { ...item, ...newTask } : item
        ).sort((a, b) => parseTime(a.time) - parseTime(b.time));
        return { ...prev, [activeDay]: newSchedule };
      });
      setEditingTaskId(null);
    } else {
      const task: ScheduleItemType = {
        id: `custom-${Date.now()}`,
        ...newTask,
        status: 'upcoming'
      };

      setWeeklySchedule(prev => ({
        ...prev,
        [activeDay]: [...prev[activeDay], task].sort((a, b) => parseTime(a.time) - parseTime(b.time))
      }));
    }
    
    setShowAddTask(false);
    setNewTask({ time: '06:00 PM', subject: 'Physics', topic: '', duration: '1h' });
  };

  const startEdit = (item: ScheduleItemType) => {
    setNewTask({
      time: item.time,
      subject: item.subject,
      topic: item.topic,
      duration: item.duration
    });
    setEditingTaskId(item.id);
    setShowAddTask(true);
  };

  const currentSchedule = weeklySchedule[activeDay] || [];
  const completedCount = currentSchedule.filter(s => s.status === 'completed').length;
  const progress = currentSchedule.length > 0 ? (completedCount / currentSchedule.length) * 100 : 0;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-black mb-2">AI Study Plan</h2>
          <p className="text-slate-500">Personalized roadmap based on your exam dates and weak areas.</p>
        </div>
        {!isGenerated && (
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || selectedSubjects.length === 0}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles size={20} /> Generate New Plan
              </>
            )}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!isGenerated ? (
          <motion.div 
            key="config"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-3 gap-8"
          >
            <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-lg mb-8">Plan Configuration</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <InputGroup 
                    label="Target Exam" 
                    value={config.exam} 
                    onChange={(v) => setConfig(prev => ({ ...prev, exam: v }))} 
                  />
                  <InputGroup 
                    label="Daily Study Hours" 
                    value={config.hours} 
                    onChange={(v) => setConfig(prev => ({ ...prev, hours: v }))} 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Focus Subjects</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_SUBJECTS.map(subject => (
                      <SubjectTag 
                        key={subject}
                        label={subject} 
                        active={selectedSubjects.includes(subject)} 
                        onClick={() => toggleSubject(subject)}
                      />
                    ))}
                    <button 
                      onClick={addSubject}
                      className="size-8 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:border-blue-600 hover:text-blue-600 transition-all"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-2 text-blue-600">
                    <Target size={18} />
                    <h4 className="text-sm font-bold uppercase tracking-wider">AI Goal</h4>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Our AI will prioritize chapters you've struggled with in recent MCQ tests and ensure you cover the entire board syllabus before your exam date.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="font-bold mb-4">Why use AI Plan?</h4>
                <ul className="space-y-4">
                  <BenefitItem icon={<Zap size={16} />} text="Optimized for retention" />
                  <BenefitItem icon={<Clock size={16} />} text="Balanced study-rest ratio" />
                  <BenefitItem icon={<BookOpen size={16} />} text="Syllabus-wide coverage" />
                </ul>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="plan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Weekly Overview */}
            <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar snap-x">
              {DAYS.map((day, i) => (
                <div 
                  key={day} 
                  onClick={() => setActiveDay(day)}
                  className={cn(
                    "p-4 rounded-2xl border text-center transition-all cursor-pointer hover:scale-105 shrink-0 w-20 snap-center",
                    activeDay === day ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white border-slate-200"
                  )}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">{day}</p>
                  <p className="text-lg font-black">{12 + i}</p>
                </div>
              ))}
            </div>

            {/* Daily Progress */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">{activeDay} Progress</h3>
                <span className="text-sm font-black text-blue-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-blue-600 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Daily Schedule */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-lg">
                  {editingTaskId ? 'Edit Task' : `Roadmap: ${activeDay}, March ${12 + DAYS.indexOf(activeDay)}`}
                </h3>
                <div className="flex items-center gap-4">
                  {!editingTaskId && (
                    <>
                      <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                        <Clock size={14} /> {config.hours} Hours Total
                      </div>
                      <button 
                        onClick={() => {
                          setEditingTaskId(null);
                          setNewTask({ time: '06:00 PM', subject: 'Physics', topic: '', duration: '1h' });
                          setShowAddTask(true);
                        }}
                        className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors"
                      >
                        <Plus size={14} /> Add Task
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <AnimatePresence>
                {showAddTask && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-slate-50 border-b border-slate-100 overflow-hidden"
                  >
                    <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <InputGroup label="Time" value={newTask.time} onChange={(v) => setNewTask(p => ({ ...p, time: v }))} />
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subject</label>
                        <select 
                          value={newTask.subject}
                          onChange={(e) => setNewTask(p => ({ ...p, subject: e.target.value }))}
                          className="w-full bg-white border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                        >
                          {ALL_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <InputGroup label="Topic" value={newTask.topic} onChange={(v) => setNewTask(p => ({ ...p, topic: v }))} />
                      <div className="flex gap-2">
                        <button 
                          onClick={handleAddTask}
                          disabled={!newTask.topic}
                          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {editingTaskId ? 'Update' : 'Add'}
                        </button>
                        <button 
                          onClick={() => {
                            setShowAddTask(false);
                            setEditingTaskId(null);
                          }}
                          className="flex-1 bg-white border border-slate-200 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 active:scale-95 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="divide-y divide-slate-50">
                {currentSchedule.length > 0 ? (
                  currentSchedule.map((item) => (
                    <ScheduleItem 
                      key={item.id}
                      item={item}
                      onFinish={() => finishSession(item.id)}
                      onStart={() => startSession(item.id)}
                      onDelete={() => deleteTask(item.id)}
                      onEdit={() => startEdit(item)}
                    />
                  ))
                ) : (
                  <div className="p-12 text-center text-slate-400">
                    <AlertCircle size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-medium">No tasks scheduled for this day.</p>
                    <button onClick={() => setShowAddTask(true)} className="text-blue-600 text-sm font-bold mt-2 hover:underline">Add your first task</button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <button 
                onClick={() => {
                  setIsGenerated(false);
                  setActiveDay('Mon');
                }} 
                className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors"
              >
                Reset and Re-configure Plan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InputGroup({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
      />
    </div>
  );
}

function SubjectTag({ label, active = false, onClick }: { label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-xs font-bold border transition-all",
        active 
          ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100" 
          : "bg-white border-slate-200 text-slate-500 hover:border-blue-600 hover:text-blue-600"
      )}
    >
      {label}
    </button>
  );
}

function BenefitItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <li className="flex items-center gap-3 text-sm text-slate-600">
      <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
        {icon}
      </div>
      {text}
    </li>
  );
}

function ScheduleItem({ 
  item, 
  onFinish, 
  onStart,
  onDelete,
  onEdit
}: { 
  item: ScheduleItemType;
  onFinish: () => void;
  onStart: () => void;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const { time, subject, topic, duration, status } = item;

  return (
    <div className={cn(
      "p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 transition-colors group",
      status === 'current' ? "bg-blue-50/30" : ""
    )}>
      <div className="w-full sm:w-20 shrink-0 flex sm:flex-col items-center sm:items-start justify-between sm:justify-start">
        <p className="text-xs font-bold text-slate-400">{time}</p>
        <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{duration}</p>
      </div>
      <div className="flex-1 w-full">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn(
            "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight",
            subject === 'Physics' ? "bg-blue-100 text-blue-600" :
            subject === 'Math' ? "bg-amber-100 text-amber-600" :
            subject === 'Chemistry' ? "bg-emerald-100 text-emerald-600" :
            "bg-slate-100 text-slate-600"
          )}>
            {subject}
          </span>
          {status === 'current' && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 animate-pulse">
              <div className="size-1.5 bg-blue-600 rounded-full"></div> NOW STUDYING
            </span>
          )}
        </div>
        <h4 className={cn("font-bold text-sm", status === 'completed' ? "text-slate-400 line-through" : "text-slate-900")}>
          {topic}
        </h4>
      </div>
      <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
        <button 
          onClick={onEdit}
          className="p-2 text-slate-300 hover:text-blue-600 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
        >
          <Pencil size={18} />
        </button>
        <button 
          onClick={onDelete}
          className="p-2 text-slate-300 hover:text-red-500 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
        >
          <Trash2 size={18} />
        </button>
        
        {status === 'completed' ? (
          <CheckCircle2 size={24} className="text-emerald-500" />
        ) : status === 'current' ? (
          <button 
            onClick={onFinish}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all"
          >
            Finish Session
          </button>
        ) : (
          <button 
            onClick={onStart}
            className="flex items-center gap-1 bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
          >
            Start <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
