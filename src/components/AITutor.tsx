import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  ImageIcon, 
  PlusCircle, 
  Copy, 
  Bookmark, 
  ThumbsUp, 
  ThumbsDown,
  Bot,
  History,
  Download,
  Rocket,
  Verified,
  ChevronRight,
  Tag,
  Lightbulb,
  CheckCircle,
  FileText,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Message } from '../types';
import { GoogleGenAI } from "@google/genai";
import { dbService } from '../services/dbService';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default function AITutor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! আমি আপনার SSC/HSC টিউটর। আমি যেকোনো বিষয় খুব সংক্ষেপে বুঝিয়ে দিতে পারি। আজ আপনাকে কীভাবে সাহায্য করতে পারি?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input || (selectedImage ? "Analyzed this image" : ""),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    const currentImage = selectedImage;
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      let contents: any;
      if (currentImage) {
        const base64Data = currentImage.split(',')[1];
        contents = {
          parts: [
            { inlineData: { mimeType: "image/png", data: base64Data } },
            { text: currentInput || "Please analyze this image and extract any text or explain its content concisely in Bengali." }
          ]
        };
      } else {
        contents = currentInput;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: contents,
        config: {
          systemInstruction: `You are a specialized SSC/HSC tutor for Bangladeshi students. Today is March 10, 2026. Respond primarily in Bengali (Bangla). Keep all answers extremely short, concise, and direct (maximum 2-3 sentences). Use Google Search for real-time information or current events. Focus on board exam patterns. Use LaTeX for math/physics formulas if needed. If an image is provided, analyze it (OCR or explanation) as requested.`,
          tools: [{ googleSearch: {} }],
        },
      });

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || "I'm sorry, I couldn't process that request.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);

      // Auto-save to history
      dbService.saveChatHistory({
        title: input.slice(0, 50) + (input.length > 50 ? '...' : ''),
        subject: 'General', // Default subject, could be dynamic
        content: [...messages, userMsg, aiMsg]
      }).catch(err => console.error("Auto-save failed:", err));

    } catch (error) {
      console.error("Gemini Error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I encountered an error while thinking. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] lg:h-[calc(100vh-120px)] gap-8">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Chat Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 sm:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`size-8 sm:size-9 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {msg.role === 'assistant' ? <SparklesIcon /> : <UserIcon />}
              </div>
              <div className={`space-y-2 max-w-[90%] sm:max-w-[85%] ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                <div className={`px-4 sm:px-5 py-3 sm:py-4 rounded-2xl shadow-sm ${
                  msg.role === 'assistant' 
                    ? 'bg-white border border-slate-100 rounded-tl-none' 
                    : 'bg-blue-600 text-white rounded-tr-none'
                }`}>
                  {msg.role === 'assistant' ? (
                    <AIResponse content={msg.content} />
                  ) : (
                    <p className="text-[15px] leading-relaxed">{msg.content}</p>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-1">
                  {msg.role === 'assistant' ? 'AI Tutor' : 'You'} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="max-w-3xl mx-auto flex flex-col gap-3">
            {/* Image Preview */}
            <AnimatePresence>
              {selectedImage && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative size-20 sm:size-24 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-lg group"
                >
                  <img src={selectedImage} alt="Preview" className="size-full object-cover" />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-1 right-1 size-6 bg-red-500 text-white rounded-lg flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                  >
                    <XCircle size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative flex items-end gap-2 sm:gap-3 bg-white border border-slate-200 rounded-2xl p-1.5 sm:p-2 focus-within:ring-2 ring-blue-500/20 transition-all shadow-sm">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageSelect} 
                accept="image/*" 
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center size-9 sm:size-10 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90 group"
              >
                <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder="Ask a question..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 text-sm sm:text-[15px] py-2 sm:py-2.5 resize-none max-h-32 min-h-[40px] sm:min-h-[44px] custom-scrollbar"
              />
              <div className="flex gap-1 sm:gap-1.5 pb-0.5 sm:pb-1 pr-0.5 sm:pr-1">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center size-9 sm:size-10 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90"
                >
                  <ImageIcon size={20} />
                </button>
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="flex items-center justify-center size-9 sm:size-10 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:scale-105 hover:bg-blue-700 transition-all active:scale-90 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 px-1 sm:px-2">
              <QuickAction label="Suggest MCQ" />
              <QuickAction label="Explain 2nd Law" />
              <QuickAction label="Board Format" />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Info */}
      <aside className="hidden xl:flex w-80 flex-col gap-6 overflow-y-auto no-scrollbar">
        <h2 className="text-base font-bold">Study Resources</h2>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <History size={14} /> Previous Board Papers
            </p>
            <div className="space-y-2">
              <BoardPaper title="Dhaka Board 2023" sub="Physics 1st Paper - Solved" />
              <BoardPaper title="Rajshahi Board 2023" sub="Physics 1st Paper - Questions" />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Rocket size={14} /> Topic Mastery
            </p>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Rocket size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold">Dynamics</p>
                  <p className="text-[10px] text-slate-500">Chapter 4 • SSC Physics</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold">
                  <span>Mastery Level</span>
                  <span className="text-blue-600">68%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-[68%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
            <div className="flex items-center gap-2 mb-2 text-amber-600">
              <Verified size={14} />
              <h3 className="text-xs font-bold uppercase tracking-wider">Exam Tip</h3>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              Always include diagrams for 3-mark questions. A simple force-vector diagram for Newton's 2nd Law can secure you an extra mark!
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

import Markdown from 'react-markdown';

function AIResponse({ content }: { content: string }) {
  return (
    <div className="prose prose-slate max-w-none prose-sm sm:prose-base prose-headings:font-black prose-headings:text-slate-900 prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-slate-50 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded">
      <Markdown>{content}</Markdown>
      
      <div className="flex items-center gap-3 border-t border-slate-100 mt-6 pt-4">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 transition-colors">
          <Copy size={14} /> Copy
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 transition-colors">
          <Bookmark size={14} /> Save
        </button>
        <div className="flex-1"></div>
        <button className="p-1.5 text-slate-400 hover:text-slate-600"><ThumbsUp size={16} /></button>
        <button className="p-1.5 text-slate-400 hover:text-slate-600"><ThumbsDown size={16} /></button>
      </div>
    </div>
  );
}

function QuickAction({ label }: { label: string }) {
  return (
    <button className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all">
      {label}
    </button>
  );
}

function BoardPaper({ title, sub }: { title: string, sub: string }) {
  return (
    <div className="p-3 bg-white rounded-xl border border-slate-200 group hover:border-blue-600 transition-colors cursor-pointer">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold">{title}</span>
        <Download size={14} className="text-slate-400" />
      </div>
      <p className="text-[10px] text-slate-500">{sub}</p>
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
