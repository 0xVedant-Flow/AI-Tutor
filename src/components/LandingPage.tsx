import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Calculator, 
  Calendar, 
  GraduationCap,
  Star,
  Send
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <GraduationCap size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">SSC/HSC <span className="text-blue-600">AI Tutor</span></span>
          </div>
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-blue-600 transition-colors">How it Works</a>
            <a href="#pricing" className="text-sm font-medium hover:text-blue-600 transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={onStart} className="text-sm font-bold px-3 py-2 hover:text-blue-600 transition-colors">Login</button>
            <button onClick={onStart} className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold shadow-lg shadow-blue-200 transition-all">
              Try AI Tutor
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                New: Math Step-by-Step Solver
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight tracking-tight text-slate-900">
                বাংলাদেশের SSC/HSC স্টুডেন্টদের জন্য <span className="text-blue-600">AI Tutor</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-lg">
                যেকোন প্রশ্নের সহজ বাংলা ব্যাখ্যা, MCQ practice এবং exam preparation. তোমার পার্সোনাল টিউটর এখন ২৪/৭ তোমার সাথে।
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={onStart} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-base font-bold shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2">
                  Start Learning <ArrowRight size={20} />
                </button>
                <button onClick={onStart} className="bg-white border border-slate-200 hover:border-blue-600 px-8 py-4 rounded-xl text-base font-bold transition-all text-center">
                  Try AI Tutor
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white" />
                  ))}
                </div>
                <span>Joined by 10k+ Bangladeshi students</span>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-blue-50 rounded-3xl blur-3xl opacity-50"></div>
              <div className="relative bg-white p-4 rounded-2xl shadow-2xl border border-blue-50 overflow-hidden">
                <div className="aspect-video w-full rounded-xl bg-slate-50 flex items-center justify-center relative">
                  <Sparkles className="text-blue-200" size={120} />
                  <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur p-4 rounded-xl border border-blue-100 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <Sparkles className="text-white" size={16} />
                      </div>
                      <p className="text-sm font-medium">"এই প্রশ্নের উত্তরটি বুঝিয়ে দাও..."</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black mb-4">Our AI Features</h2>
            <p className="text-slate-600">Designed specifically for the Bangladeshi National Curriculum</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<Sparkles />} 
              title="AI Question Solver" 
              desc="যেকোন সৃজনশীল বা জ্ঞানমূলক প্রশ্নের ইনস্ট্যান্ট উত্তর বাংলা ভাষায় বুঝে নাও।" 
            />
            <FeatureCard 
              icon={<BookOpen />} 
              title="MCQ Practice" 
              desc="অধ্যায় ভিত্তিক MCQ প্র্যাকটিস এবং নিজের ভুলের ডিটেইল ব্যাখ্যা জেনে নাও।" 
            />
            <FeatureCard 
              icon={<Calculator />} 
              title="Math Solver" 
              desc="জটিল অংকের সমাধান এখন ধাপে ধাপে, যেন তুমি সহজেই কনসেপ্ট বুঝতে পারো।" 
            />
            <FeatureCard 
              icon={<Calendar />} 
              title="AI Study Plan" 
              desc="তোমার পরীক্ষার সিলেবাস অনুযায়ী অটোমেটিক রুটিন তৈরি করে নাও।" 
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-3xl lg:text-4xl font-black mb-12">How It Works</h2>
              <div className="space-y-12">
                <Step number={1} title="Ask a question" desc="প্রশ্নের ছবি তোলো অথবা টেক্সট লিখে আমাদের AI টিউটরকে পাঠিয়ে দাও।" />
                <Step number={2} title="Get AI explanation" desc="AI কয়েক সেকেন্ডের মধ্যে সহজ বাংলায় পুরো বিষয়টি ব্যাখ্যা করে দেবে।" />
                <Step number={3} title="Practice MCQ" desc="শেখা শেষে ঐ বিষয়ের ওপর প্র্যাকটিস করে নিজের দক্ষতা যাচাই করো।" />
              </div>
            </div>
            <div className="lg:w-1/2 bg-blue-50 rounded-3xl aspect-square w-full flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 to-transparent"></div>
              <Sparkles className="text-blue-200" size={160} />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-600">Choose the plan that fits your study needs</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto px-2">
            <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-xl">
              <h3 className="text-2xl font-bold mb-2">Free Plan</h3>
              <div className="text-4xl font-black mb-6">0 BDT<span className="text-base font-normal text-slate-500">/forever</span></div>
              <ul className="space-y-4 mb-10">
                <PricingItem text="10 AI questions/day" />
                <PricingItem text="Basic Explanations" />
                <PricingItem text="No Premium Support" disabled />
              </ul>
              <button onClick={onStart} className="w-full py-4 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition-all">Get Started</button>
            </div>
            <div className="bg-blue-600 p-10 rounded-3xl text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Recommended</div>
              <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
              <div className="text-4xl font-black mb-6">200 BDT<span className="text-base font-normal opacity-80">/month</span></div>
              <ul className="space-y-4 mb-10">
                <PricingItem text="Unlimited AI questions" light />
                <PricingItem text="Unlimited MCQ practice" light />
                <PricingItem text="Personal Study Plan Generator" light />
                <PricingItem text="Priority response speed" light />
              </ul>
              <button onClick={onStart} className="w-full py-4 rounded-xl bg-white text-blue-600 font-bold hover:bg-opacity-90 transition-all shadow-lg">Go Premium Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-black text-center mb-16">What Our Students Say</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard 
              name="আরিফ আহমেদ" 
              role="HSC 2024 Examinee" 
              text="অংকের কঠিন সমাধানগুলো এখন কত সহজে বুঝতে পারি! HSC প্রিপারেশন এখন অনেক ইজি হয়ে গেছে।" 
            />
            <TestimonialCard 
              name="সাদিয়া নওরিন" 
              role="SSC 2025 Student" 
              text="MCQ প্র্যাকটিস করার জন্য এর চেয়ে ভালো মাধ্যম আর হয় না। ভুল করলে সাথে সাথে উত্তর বুঝিয়ে দেয়।" 
            />
            <TestimonialCard 
              name="মাহমুদুল হাসান" 
              role="HSC Candidate" 
              text="এই বাজেটে এত দারুণ সার্ভিস ভাবাই যায় না। টিউটরের পেছনে সময় নষ্ট না করে AI Tutor ই সেরা।" 
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <GraduationCap size={20} />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">SSC/HSC <span className="text-blue-600">AI Tutor</span></span>
              </div>
              <p className="text-sm leading-relaxed">Bringing personalized AI education to every student in Bangladesh.</p>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Quick Links</h5>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Support</h5>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Join Our Newsletter</h5>
              <p className="text-sm mb-4">Stay updated with latest features and study tips.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email address" className="bg-slate-800 border-slate-700 rounded-lg text-sm w-full focus:ring-blue-500 focus:border-blue-500" />
                <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-xs">
            © 2024 SSC/HSC AI Tutor. All rights reserved. Made for students in Bangladesh.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-blue-600 transition-all group shadow-sm hover:shadow-xl">
      <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ number, title, desc }: { number: number, title: string, desc: string }) {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold z-10">{number}</div>
        {number < 3 && <div className="w-1 bg-blue-100 h-full mt-2"></div>}
      </div>
      <div className={number < 3 ? "pb-10" : ""}>
        <h4 className="text-xl font-bold mb-2">{title}</h4>
        <p className="text-slate-600">{desc}</p>
      </div>
    </div>
  );
}

function PricingItem({ text, disabled = false, light = false }: { text: string, disabled?: boolean, light?: boolean }) {
  return (
    <li className={cn("flex items-center gap-3", disabled && "text-slate-400")}>
      <CheckCircle2 size={20} className={cn(light ? "text-white/60" : "text-green-500", disabled && "text-slate-300")} />
      <span className="text-sm font-medium">{text}</span>
    </li>
  );
}

function TestimonialCard({ name, role, text }: { name: string, role: string, text: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-50">
      <div className="flex items-center gap-1 text-yellow-400 mb-4">
        {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
      </div>
      <p className="italic text-slate-600 mb-6">"{text}"</p>
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-slate-100" />
        <div>
          <div className="font-bold">{name}</div>
          <div className="text-xs text-slate-500">{role}</div>
        </div>
      </div>
    </div>
  );
}
