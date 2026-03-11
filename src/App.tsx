import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  BookOpen, 
  Calendar, 
  History, 
  User, 
  LogOut, 
  Bell, 
  Settings as SettingsIcon, 
  Search,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { View } from './types';

// Components
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AITutor from './components/AITutor';
import MCQPractice from './components/MCQPractice';
import StudyPlan from './components/StudyPlan';
import HistoryView from './components/HistoryView';
import Profile from './components/Profile';
import SettingsView from './components/Settings';
import Login from './components/Login';
import { authService } from './services/authService';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    authService.getSession().then(({ session }) => {
      setSession(session);
      if (session) setCurrentView('dashboard');
    });

    const { data: { subscription } } = authService.onAuthStateChange((session) => {
      setSession(session);
      if (session) setCurrentView('dashboard');
      else setCurrentView('landing');
    });

    return () => subscription.unsubscribe();
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'landing': return <LandingPage onStart={() => setCurrentView('auth')} />;
      case 'auth': return <Login onSuccess={() => setCurrentView('dashboard')} />;
      case 'dashboard': return <Dashboard setView={setCurrentView} />;
      case 'chat': return <AITutor />;
      case 'mcq': return <MCQPractice />;
      case 'plan': return <StudyPlan />;
      case 'history': return <HistoryView />;
      case 'profile': return <Profile />;
      case 'settings': return <SettingsView />;
      default: return <Dashboard setView={setCurrentView} />;
    }
  };

  if (currentView === 'landing') {
    return <LandingPage onStart={() => setCurrentView('auth')} />;
  }

  if (currentView === 'auth') {
    return <Login onSuccess={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="flex h-screen bg-[#f5f7f8] text-slate-900 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-50 fixed inset-y-0 left-0 lg:relative",
          isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-20"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0">
            <GraduationCap size={24} />
          </div>
          {isSidebarOpen && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="font-bold text-lg leading-tight">AI Tutor</h1>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">SSC/HSC Prep</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={currentView === 'dashboard'} 
            collapsed={!isSidebarOpen}
            onClick={() => setCurrentView('dashboard')}
          />
          <NavItem 
            icon={<MessageSquare size={20} />} 
            label="Ask AI Tutor" 
            active={currentView === 'chat'} 
            collapsed={!isSidebarOpen}
            onClick={() => setCurrentView('chat')}
          />
          <NavItem 
            icon={<BookOpen size={20} />} 
            label="MCQ Practice" 
            active={currentView === 'mcq'} 
            collapsed={!isSidebarOpen}
            onClick={() => setCurrentView('mcq')}
          />
          <NavItem 
            icon={<Calendar size={20} />} 
            label="Study Plan" 
            active={currentView === 'plan'} 
            collapsed={!isSidebarOpen}
            onClick={() => setCurrentView('plan')}
          />
          <NavItem 
            icon={<History size={20} />} 
            label="History" 
            active={currentView === 'history'} 
            collapsed={!isSidebarOpen}
            onClick={() => setCurrentView('history')}
          />
          <NavItem 
            icon={<SettingsIcon size={20} />} 
            label="Settings" 
            active={currentView === 'settings'} 
            collapsed={!isSidebarOpen}
            onClick={() => setCurrentView('settings')}
          />
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100">
          <NavItem 
            icon={<User size={20} />} 
            label="Profile" 
            active={currentView === 'profile'} 
            collapsed={!isSidebarOpen}
            onClick={() => setCurrentView('profile')}
          />
          <NavItem 
            icon={<LogOut size={20} />} 
            label="Logout" 
            collapsed={!isSidebarOpen}
            onClick={() => authService.signOut()}
          />
          
          {isSidebarOpen && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Pro Plan</p>
              <p className="text-xs text-slate-500 mt-1">Unlimited AI Queries</p>
              <button className="mt-3 w-full bg-blue-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                Upgrade Now
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-2 sm:gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-all active:scale-95 group"
            >
              <Menu size={20} className="group-hover:text-blue-600 transition-colors" />
            </button>
            <div className="relative w-full max-w-md hidden lg:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, questions, or notes..." 
                className="w-full bg-slate-100 border-2 border-transparent rounded-xl pl-10 pr-4 py-2 text-sm focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600 rounded-xl relative hidden sm:block transition-all active:scale-95">
              <Bell size={20} />
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button 
              onClick={() => setCurrentView('settings')}
              className={cn(
                "p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600 rounded-xl hidden sm:block transition-all active:scale-95",
                currentView === 'settings' && "bg-blue-50 text-blue-600"
              )}
            >
              <SettingsIcon size={20} />
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-1 sm:mx-2 hidden sm:block"></div>
            <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer p-1 pr-2 rounded-xl hover:bg-slate-50 transition-all">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{session?.user?.email?.split('@')[0] || 'Tarikul Islam'}</p>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-tight">HSC Candidate</p>
              </div>
              <div className="size-8 sm:size-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs sm:text-sm border border-blue-200 shadow-sm group-hover:scale-105 transition-transform">
                {session?.user?.email?.[0].toUpperCase() || 'TI'}
              </div>
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-4 sm:p-8 max-w-7xl mx-auto w-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavItem({ 
  icon, 
  label, 
  active = false, 
  collapsed = false,
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  collapsed?: boolean;
  onClick?: () => void;
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full group relative",
        active 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
        collapsed && "justify-center px-0"
      )}
    >
      <span className={cn(
        "transition-colors",
        active ? "text-white" : "text-slate-500 group-hover:text-blue-600"
      )}>
        {icon}
      </span>
      {!collapsed && <span className="text-sm font-bold">{label}</span>}
      {active && !collapsed && (
        <motion.div 
          layoutId="activeNav"
          className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
        />
      )}
    </button>
  );
}
