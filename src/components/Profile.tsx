import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Shield, 
  CreditCard, 
  Bell, 
  Lock,
  ChevronRight,
  Camera,
  Verified
} from 'lucide-react';

export default function Profile() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl sm:text-3xl font-black mb-8 sm:mb-12">Account Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-600 to-blue-400"></div>
            <div className="relative z-10">
              <div className="relative inline-block mb-4">
                <div className="size-24 rounded-full bg-blue-100 border-4 border-white flex items-center justify-center text-blue-600 text-3xl font-black shadow-lg">
                  TI
                </div>
                <button className="absolute bottom-0 right-0 size-8 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 shadow-sm">
                  <Camera size={16} />
                </button>
              </div>
              <h3 className="text-xl font-black flex items-center justify-center gap-2">
                Tarikul Islam <Verified size={18} className="text-blue-600" />
              </h3>
              <p className="text-sm text-slate-500 font-medium">HSC Candidate 2024</p>
              
              <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Questions</p>
                  <p className="text-xl font-black">142</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">MCQs</p>
                  <p className="text-xl font-black">850</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl shadow-blue-100 relative overflow-hidden">
            <h4 className="font-bold text-lg mb-2">Premium Member</h4>
            <p className="text-white/80 text-xs mb-6">Your subscription expires in 15 days.</p>
            <button className="w-full py-3 rounded-xl bg-white text-blue-600 font-bold text-sm hover:bg-opacity-90 transition-all">
              Renew Subscription
            </button>
            <Shield className="absolute -right-4 -bottom-4 size-24 opacity-10" />
          </div>
        </div>

        {/* Settings List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-lg">Personal Information</h3>
            </div>
            <div className="divide-y divide-slate-50">
              <SettingsItem icon={<User size={18} />} label="Full Name" value="Tarikul Islam" />
              <SettingsItem icon={<Mail size={18} />} label="Email Address" value="tarikul.hsc24@gmail.com" />
              <SettingsItem icon={<Phone size={18} />} label="Phone Number" value="+880 1712 345678" />
              <SettingsItem icon={<GraduationCap size={18} />} label="Institution" value="Notre Dame College, Dhaka" />
              <SettingsItem icon={<MapPin size={18} />} label="Location" value="Dhaka, Bangladesh" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-lg">Preferences & Security</h3>
            </div>
            <div className="divide-y divide-slate-50">
              <SettingsAction icon={<Bell size={18} />} label="Notification Settings" />
              <SettingsAction icon={<Lock size={18} />} label="Change Password" />
              <SettingsAction icon={<CreditCard size={18} />} label="Payment Methods" />
              <SettingsAction icon={<Shield size={18} />} label="Privacy & Data" />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-all">Cancel</button>
            <button className="px-8 py-3 rounded-xl font-bold bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="p-4 sm:p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="size-9 sm:size-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-colors">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
          <p className="text-sm font-semibold text-slate-900">{value}</p>
        </div>
      </div>
      <button className="text-xs font-bold text-blue-600 hover:underline">Edit</button>
    </div>
  );
}

function SettingsAction({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="w-full p-4 sm:p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="size-9 sm:size-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-colors">
          {icon}
        </div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
      </div>
      <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
    </button>
  );
}
