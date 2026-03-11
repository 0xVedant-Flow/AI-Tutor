import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  BookOpen, 
  ChevronRight, 
  Calendar,
  MoreVertical,
  Download,
  Trash2,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { dbService } from '../services/dbService';

export default function HistoryView() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dbService.getHistory().then(({ data }) => {
      if (data) setHistory(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 sm:mb-12 gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black mb-2">Learning History</h2>
          <p className="text-sm sm:text-base text-slate-500">Review your past AI conversations and MCQ results.</p>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search history..." 
              className="bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 w-full lg:w-64"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 shrink-0">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="font-bold">Loading your history...</p>
          </div>
        ) : history.length > 0 ? (
          history.map((item) => (
            <HistoryItem 
              key={item.id}
              type={item.type} 
              title={item.title} 
              subject={item.subject} 
              date={new Date(item.created_at).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })} 
              score={item.type === 'mcq' ? `${item.score}/${item.total}` : undefined}
            />
          ))
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400">
            <Calendar size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold">No history found yet.</p>
            <p className="text-sm mt-1">Start a chat or take a quiz to see it here!</p>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="mt-12 flex justify-center">
          <button className="text-sm font-bold text-blue-600 hover:underline">Load More History</button>
        </div>
      )}
    </div>
  );
}

function HistoryItem({ type, title, subject, date, score }: { type: 'chat' | 'mcq', title: string, subject: string, date: string, score?: string }) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:border-blue-200 transition-all group cursor-pointer shadow-sm">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className={cn(
          "size-10 sm:size-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
          type === 'chat' ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" : "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white"
        )}>
          {type === 'chat' ? <MessageSquare size={24} /> : <BookOpen size={24} />}
        </div>
        
        <div className="flex-1 min-w-0">
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
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Calendar size={10} /> {date}
            </span>
          </div>
          <h4 className="font-bold text-sm truncate group-hover:text-blue-600 transition-colors">{title}</h4>
        </div>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6">
        {score && (
          <div className="text-left sm:text-right shrink-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Score</p>
            <p className="text-sm font-black text-emerald-600">{score}</p>
          </div>
        )}

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
            <Download size={18} />
          </button>
          <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
            <Trash2 size={18} />
          </button>
          <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
