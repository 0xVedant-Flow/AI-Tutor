import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  CreditCard, 
  Palette, 
  GraduationCap, 
  Check, 
  AlertTriangle, 
  LogOut, 
  ChevronRight,
  Camera,
  Globe,
  Zap,
  Trash2,
  Lock,
  Smartphone,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { cn } from '../lib/utils';
import { dbService } from '../services/dbService';

type SettingsTab = 'profile' | 'account' | 'learning' | 'notifications' | 'subscription' | 'security' | 'appearance';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubject, setNewSubject] = useState('');

  // Form States
  const [profileData, setProfileData] = useState({
    fullName: 'Tarikul Islam',
    class: 'Class 12',
    school: 'Dhaka Residential Model College',
    subjects: ['Physics', 'Chemistry', 'Math', 'Biology', 'ICT']
  });

  const [learningPrefs, setLearningPrefs] = useState({
    language: 'Bangla',
    style: 'Short',
    difficulty: 'Medium',
    defaultSubject: 'Physics'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    studyReminders: true,
    examPrep: true,
    newMCQ: false
  });

  const [appearance, setAppearance] = useState({
    theme: 'light',
    uiScale: 50
  });

  // Load settings
  React.useEffect(() => {
    dbService.getSettings().then(({ data }) => {
      if (data) {
        if (data.profile) setProfileData(data.profile);
        if (data.learning) setLearningPrefs(data.learning);
        if (data.notifications) setNotifications(data.notifications);
        if (data.appearance) {
          setAppearance(data.appearance);
          applyTheme(data.appearance.theme);
          applyScale(data.appearance.uiScale);
        }
      }
    });
  }, []);

  const applyTheme = (theme: string) => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      if (systemTheme === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
    }
  };

  const applyScale = (scale: number) => {
    const root = window.document.documentElement;
    root.style.fontSize = `${(scale / 100) * 16}px`;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await dbService.saveSettings({
        profile: profileData,
        learning: learningPrefs,
        notifications: notifications,
        appearance: appearance,
        updated_at: new Date()
      });
      applyScale(appearance.uiScale);
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Save settings failed:", error);
      setIsSaving(false);
    }
  };

  const handleAddSubject = () => {
    if (newSubject.trim() && !profileData.subjects.includes(newSubject.trim())) {
      setProfileData({
        ...profileData,
        subjects: [...profileData.subjects, newSubject.trim()]
      });
      setNewSubject('');
      setShowAddSubject(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'account', label: 'Account', icon: <SettingsIcon size={18} /> },
    { id: 'learning', label: 'Learning Preferences', icon: <GraduationCap size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'subscription', label: 'Subscription', icon: <CreditCard size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight">Settings</h2>
        <p className="text-slate-500 mt-1">Manage your account and learning preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                  activeTab === tab.id 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                    : "text-slate-600 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Settings Content */}
        <main className="flex-1">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="p-8 sm:p-10"
              >
                {activeTab === 'profile' && (
                  <ProfileSettings 
                    data={profileData} 
                    setData={setProfileData} 
                    onSave={handleSave} 
                    isSaving={isSaving}
                    onAddSubject={() => setShowAddSubject(true)}
                  />
                )}
                {activeTab === 'account' && <AccountSettings onDelete={() => setShowDeleteModal(true)} />}
                {activeTab === 'learning' && (
                  <LearningSettings 
                    data={learningPrefs} 
                    setData={setLearningPrefs} 
                    onSave={handleSave} 
                    isSaving={isSaving} 
                  />
                )}
                {activeTab === 'notifications' && (
                  <NotificationSettings 
                    data={notifications} 
                    setData={setNotifications} 
                    onSave={handleSave}
                    isSaving={isSaving}
                  />
                )}
                {activeTab === 'subscription' && <SubscriptionSettings />}
                {activeTab === 'security' && <SecuritySettings />}
                {activeTab === 'appearance' && (
                  <AppearanceSettings 
                    data={appearance} 
                    setData={(d: any) => {
                      setAppearance(d);
                      applyTheme(d.theme);
                    }}
                    onSave={handleSave}
                    isSaving={isSaving}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Add Subject Modal */}
      <AnimatePresence>
        {showAddSubject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddSubject(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl"
            >
              <h3 className="text-2xl font-black text-slate-900 mb-6">Add New Subject</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Enter subject name (e.g. Higher Math)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddSubject(false)}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddSubject}
                    className="flex-1 px-6 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
                  >
                    Add Subject
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Message Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-50"
          >
            <div className="size-6 bg-white/20 rounded-full flex items-center justify-center">
              <Check size={14} />
            </div>
            <span className="font-bold text-sm">Changes saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl"
            >
              <div className="size-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Delete Account?</h3>
              <p className="text-slate-500 mb-8">
                This action is permanent and cannot be undone. All your progress, MCQ history, and study plans will be deleted forever.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-6 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-100 transition-all"
                >
                  Delete Forever
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfileSettings({ 
  data, 
  setData, 
  onSave, 
  isSaving,
  onAddSubject
}: { 
  data: any, 
  setData: (d: any) => void, 
  onSave: () => void, 
  isSaving: boolean,
  onAddSubject: () => void
}) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-black mb-1 text-slate-900">Profile Information</h3>
        <p className="text-sm text-slate-500">Update your personal details and how others see you.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-100">
        <div className="relative group">
          <div className="size-24 rounded-3xl bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-black border-4 border-white shadow-md overflow-hidden">
            {data.fullName ? data.fullName.split(' ').map((n: string) => n[0]).join('') : 'U'}
          </div>
          <button className="absolute -bottom-2 -right-2 size-8 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all">
            <Camera size={16} />
          </button>
        </div>
        <div>
          <h4 className="font-bold text-slate-900">Profile Picture</h4>
          <p className="text-xs text-slate-500 mt-1">JPG, GIF or PNG. Max size of 2MB.</p>
          <div className="flex gap-2 mt-3">
            <button className="text-xs font-bold text-blue-600 hover:underline">Upload New</button>
            <span className="text-slate-300">•</span>
            <button className="text-xs font-bold text-red-500 hover:underline">Remove</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
          <input 
            type="text" 
            value={data.fullName}
            onChange={(e) => setData({ ...data, fullName: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
          <input 
            type="email" 
            defaultValue="tarikul@example.com"
            disabled
            className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-500 cursor-not-allowed"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Class</label>
          <select 
            value={data.class}
            onChange={(e) => setData({ ...data, class: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none text-slate-900"
          >
            <option>Class 9</option>
            <option>Class 10</option>
            <option>Class 11</option>
            <option>Class 12</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">School Name</label>
          <input 
            type="text" 
            value={data.school}
            onChange={(e) => setData({ ...data, school: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-slate-900"
          />
        </div>
        <div className="sm:col-span-2 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subjects</label>
          <div className="flex flex-wrap gap-2">
            {data.subjects.map((subject: string) => (
              <button 
                key={subject} 
                onClick={() => setData({ ...data, subjects: data.subjects.filter((s: string) => s !== subject) })}
                className="px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100 hover:bg-blue-100 transition-colors flex items-center gap-1"
              >
                {subject} <span className="opacity-50">×</span>
              </button>
            ))}
            <button 
              onClick={onAddSubject}
              className="px-4 py-2 rounded-full border border-dashed border-slate-300 text-slate-400 text-xs font-bold hover:border-blue-400 hover:text-blue-600 transition-all"
            >
              + Add Subject
            </button>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button 
          onClick={onSave}
          disabled={isSaving}
          className="bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

function AccountSettings({ onDelete }: { onDelete: () => void }) {
  const handleAction = (action: string) => {
    alert(`${action} functionality would be implemented with a real authentication system.`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-black mb-1 text-slate-900">Account Settings</h3>
        <p className="text-sm text-slate-500">Manage your account credentials and status.</p>
      </div>

      <div className="space-y-6">
        <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
          <h4 className="font-bold text-slate-900 mb-4">Email Address</h4>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-700">tarikul@example.com</p>
              <p className="text-xs text-slate-500 mt-1">Your email address is verified.</p>
            </div>
            <button 
              onClick={() => handleAction('Change Email')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Change Email
            </button>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
          <h4 className="font-bold text-slate-900 mb-4">Password</h4>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-700">••••••••••••</p>
              <p className="text-xs text-slate-500 mt-1">Last changed 3 months ago.</p>
            </div>
            <button 
              onClick={() => handleAction('Change Password')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Change Password
            </button>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-red-100 bg-red-50/30">
          <h4 className="font-bold text-red-600 mb-2">Danger Zone</h4>
          <p className="text-xs text-slate-500 mb-4">Deleting your account will remove all of your information from our database. This cannot be undone.</p>
          <button 
            onClick={onDelete}
            className="text-xs font-bold text-red-600 px-4 py-2 rounded-lg border border-red-200 hover:bg-red-600 hover:text-white transition-all"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

function LearningSettings({ 
  data, 
  setData, 
  onSave, 
  isSaving 
}: { 
  data: any, 
  setData: (d: any) => void, 
  onSave: () => void, 
  isSaving: boolean 
}) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-black mb-1">Learning Preferences</h3>
        <p className="text-sm text-slate-500">Customize how the AI Tutor interacts with you.</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Preferred Language</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setData({ ...data, language: 'Bangla' })}
                className={cn(
                  "px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all",
                  data.language === 'Bangla' ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-100 text-slate-500 hover:border-slate-200"
                )}
              >
                Bangla
              </button>
              <button 
                onClick={() => setData({ ...data, language: 'English' })}
                className={cn(
                  "px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all",
                  data.language === 'English' ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-100 text-slate-500 hover:border-slate-200"
                )}
              >
                English
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Explanation Style</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setData({ ...data, style: 'Short' })}
                className={cn(
                  "px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all",
                  data.style === 'Short' ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-100 text-slate-500 hover:border-slate-200"
                )}
              >
                Short
              </button>
              <button 
                onClick={() => setData({ ...data, style: 'Detailed' })}
                className={cn(
                  "px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all",
                  data.style === 'Detailed' ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-100 text-slate-500 hover:border-slate-200"
                )}
              >
                Detailed
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Difficulty Level</label>
          <div className="grid grid-cols-3 gap-2">
            {['Easy', 'Medium', 'Hard'].map(level => (
              <button 
                key={level}
                onClick={() => setData({ ...data, difficulty: level })}
                className={cn(
                  "px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all",
                  data.difficulty === level ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-100 text-slate-500 hover:border-slate-200"
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Default Subject</label>
          <select 
            value={data.defaultSubject}
            onChange={(e) => setData({ ...data, defaultSubject: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none"
          >
            <option>Physics</option>
            <option>Chemistry</option>
            <option>Math</option>
            <option>Biology</option>
            <option>ICT</option>
          </select>
        </div>
      </div>

      <div className="pt-6">
        <button 
          onClick={onSave}
          disabled={isSaving}
          className="bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}

function NotificationSettings({ 
  data, 
  setData, 
  onSave, 
  isSaving 
}: { 
  data: any, 
  setData: (d: any) => void, 
  onSave: () => void, 
  isSaving: boolean 
}) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-black mb-1 text-slate-900">Notification Settings</h3>
        <p className="text-sm text-slate-500">Choose what updates you want to receive.</p>
      </div>

      <div className="space-y-4">
        <ToggleItem 
          title="Email Notifications" 
          desc="Receive weekly progress reports and news." 
          enabled={data.email} 
          onToggle={(v) => setData({ ...data, email: v })}
        />
        <ToggleItem 
          title="Study Reminders" 
          desc="Get notified when it's time for your daily study plan." 
          enabled={data.studyReminders} 
          onToggle={(v) => setData({ ...data, studyReminders: v })}
        />
        <ToggleItem 
          title="Exam Preparation Reminders" 
          desc="Alerts for upcoming board exam dates and prep tips." 
          enabled={data.examPrep} 
          onToggle={(v) => setData({ ...data, examPrep: v })}
        />
        <ToggleItem 
          title="New MCQ Alerts" 
          desc="Notification when new practice sets are available for your subjects." 
          enabled={data.newMCQ} 
          onToggle={(v) => setData({ ...data, newMCQ: v })}
        />
      </div>

      <div className="pt-6">
        <button 
          onClick={onSave}
          disabled={isSaving}
          className="bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Notifications'}
        </button>
      </div>
    </div>
  );
}

function ToggleItem({ title, desc, enabled, onToggle }: { title: string, desc: string, enabled: boolean, onToggle: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
      <div className="flex-1 pr-4">
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
      <button 
        onClick={() => onToggle(!enabled)}
        className={cn(
          "w-12 h-6 rounded-full transition-all relative shrink-0",
          enabled ? "bg-blue-600" : "bg-slate-200"
        )}
      >
        <div className={cn(
          "absolute top-1 size-4 bg-white rounded-full transition-all",
          enabled ? "left-7" : "left-1"
        )} />
      </button>
    </div>
  );
}

function SubscriptionSettings() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-black mb-1">Subscription Plan</h3>
        <p className="text-sm text-slate-500">Manage your billing and plan features.</p>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Current Plan</p>
              <h4 className="text-3xl font-black mt-1">Free Tier</h4>
            </div>
            <div className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
              Active
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="size-5 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center">
                <Check size={12} />
              </div>
              <p className="text-sm text-white/80">10 AI questions per day</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-5 bg-white/10 text-white/30 rounded-full flex items-center justify-center">
                <Lock size={10} />
              </div>
              <p className="text-sm text-white/40 line-through">Unlimited MCQ Practice</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-5 bg-white/10 text-white/30 rounded-full flex items-center justify-center">
                <Lock size={10} />
              </div>
              <p className="text-sm text-white/40 line-through">Study Plan Generator</p>
            </div>
          </div>

          <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2">
            Upgrade to Premium <Zap size={18} />
          </button>
        </div>
        <GraduationCap className="absolute -right-8 -bottom-8 size-64 text-white/5" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
          <h5 className="font-bold text-sm mb-2">Billing History</h5>
          <p className="text-xs text-slate-500 mb-4">View and download your previous invoices.</p>
          <button className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
            View History <ChevronRight size={14} />
          </button>
        </div>
        <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
          <h5 className="font-bold text-sm mb-2">Payment Methods</h5>
          <p className="text-xs text-slate-500 mb-4">Manage your credit cards and bKash/Nagad.</p>
          <button className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
            Manage Methods <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  const handleAction = (action: string) => {
    alert(`${action} functionality would be implemented with a real authentication system.`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-black mb-1 text-slate-900">Security Settings</h3>
        <p className="text-sm text-slate-500">Protect your account and data.</p>
      </div>

      <div className="space-y-4">
        <SecurityItem 
          icon={<Lock className="text-blue-600" size={20} />} 
          title="Change Password" 
          desc="Update your password regularly to keep your account safe."
          action="Update"
          onClick={() => handleAction('Update Password')}
        />
        <SecurityItem 
          icon={<Smartphone className="text-emerald-600" size={20} />} 
          title="Two-Factor Authentication" 
          desc="Add an extra layer of security to your account."
          action="Enable"
          onClick={() => handleAction('Enable 2FA')}
        />
        <SecurityItem 
          icon={<LogOut className="text-amber-600" size={20} />} 
          title="Logout from all devices" 
          desc="Instantly log out from all other active sessions."
          action="Logout All"
          danger
          onClick={() => handleAction('Logout All Devices')}
        />
      </div>
    </div>
  );
}

function SecurityItem({ 
  icon, 
  title, 
  desc, 
  action, 
  onClick,
  danger = false 
}: { 
  icon: React.ReactNode, 
  title: string, 
  desc: string, 
  action: string, 
  onClick: () => void,
  danger?: boolean 
}) {
  return (
    <div className="flex items-center justify-between p-6 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
      <div className="flex items-start gap-4">
        <div className="size-10 bg-white rounded-xl border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">{title}</h4>
          <p className="text-xs text-slate-500 mt-0.5 max-w-md">{desc}</p>
        </div>
      </div>
      <button 
        onClick={onClick}
        className={cn(
          "text-xs font-bold px-4 py-2 rounded-lg border transition-all",
          danger 
            ? "text-red-600 border-red-100 hover:bg-red-600 hover:text-white" 
            : "text-blue-600 border-blue-100 hover:bg-blue-600 hover:text-white"
        )}
      >
        {action}
      </button>
    </div>
  );
}

function AppearanceSettings({ 
  data, 
  setData, 
  onSave, 
  isSaving 
}: { 
  data: any, 
  setData: (d: any) => void, 
  onSave: () => void, 
  isSaving: boolean 
}) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-black mb-1 text-slate-900">Appearance Settings</h3>
        <p className="text-sm text-slate-500">Customize how the platform looks on your device.</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Theme Mode</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ThemeCard 
              active={data.theme === 'light'} 
              onClick={() => setData({ ...data, theme: 'light' })}
              icon={<Sun size={20} />}
              label="Light Mode"
            />
            <ThemeCard 
              active={data.theme === 'dark'} 
              onClick={() => setData({ ...data, theme: 'dark' })}
              icon={<Moon size={20} />}
              label="Dark Mode"
            />
            <ThemeCard 
              active={data.theme === 'system'} 
              onClick={() => setData({ ...data, theme: 'system' })}
              icon={<Monitor size={20} />}
              label="System"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">UI Scale ({data.uiScale}%)</label>
          <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
            <input 
              type="range" 
              min="80"
              max="120"
              value={data.uiScale}
              onChange={(e) => setData({ ...data, uiScale: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
            />
            <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Compact</span>
              <span>Default</span>
              <span>Large</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button 
          onClick={onSave}
          disabled={isSaving}
          className="bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Appearance'}
        </button>
      </div>
    </div>
  );
}

function ThemeCard({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3",
        active ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-100 text-slate-500 hover:border-slate-200"
      )}
    >
      {icon}
      <span className="text-sm font-bold">{label}</span>
    </button>
  );
}
