/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Users, LineChart, User, Mic, Play, Pause, Square, 
  ChevronRight, Calendar, Clock, Share2, Brain, AlertTriangle, 
  ArrowLeft, Lock, MoreHorizontal, Edit3, CheckCircle2, TrendingUp, Info
} from 'lucide-react';
import { Consultation, Patient, Message, Assessment } from './types';

// --- Mock Data ---

const MOCK_PATIENTS: Patient[] = [
  {
    id: '880291',
    name: '张三',
    age: 32,
    gender: '男',
    totalConsultations: 8,
    firstConsultationDate: '2023-11-12',
    lastConsultationDate: '2024-03-20',
    tags: ['焦虑情绪倾向', '职场压力'],
    anxietyTrend: 'up',
    depressionTrend: 'stable',
    sleepTrend: 'up',
    riskLevel: 'medium',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCh4vzNWAGNkbIYpynDI-NaKMUyhVYCb8_qDU9fYh7sX5TxR2cs-skBvR1bb-BjCT_okyUSUv3YrXBh-P6SIWQ5jYKCItflrfMaFQTfuf9quWvjc0X5IPM7M5X-4A7pZQuk-YD58Zij9i7loh5GqOPpZWNr9AdnSz1hHLwocpTmM5hfEAvdCeh6t1zYJ5aYDw-4_jd4PzhFyWD43Bsn4ATpMC6M0pV7cCW8PPAbA5hgeGnE-esIT_9t175YgjFl8Ftu6ZFdlU2t0fs'
  },
  {
    id: '880292',
    name: '李秋华',
    age: 42,
    gender: '女',
    totalConsultations: 15,
    firstConsultationDate: '2023-10-22',
    lastConsultationDate: '2024-03-22',
    tags: ['职业压力', '情绪稳定'],
    anxietyTrend: 'stable',
    depressionTrend: 'down',
    sleepTrend: 'stable',
    riskLevel: 'low'
  },
  {
    id: '880293',
    name: '王小燕',
    age: 19,
    gender: '女',
    totalConsultations: 4,
    firstConsultationDate: '2023-10-20',
    lastConsultationDate: '2024-03-20',
    tags: ['重度抑郁', '学习压力'],
    anxietyTrend: 'up',
    depressionTrend: 'up',
    sleepTrend: 'up',
    riskLevel: 'high'
  }
];

const MOCK_CONSULTATIONS: Consultation[] = [
  {
    id: 'c1',
    patientId: '880291',
    patientName: '张三',
    date: '2024-03-20 14:00',
    duration: '50分',
    status: 'completed',
    summary: '患者在本次访谈中表现出较为明显的情绪波动，主要讨论了近期职场变动带来的不安全感。通过认知重塑练习，患者开始尝试识别自身的消极自动思维，并在结束前情绪趋于平稳。',
    issues: ['睡眠障碍', '工作压力', '自我认同', '人际冲突'],
    anxietyScore: 14,
    transcript: [
      { id: 'm1', role: 'counselor', content: '你好，张三。很高兴今天能和你继续交谈。在开始之前，你愿意分享一下这周你的情绪起伏吗？', isStable: true },
      { id: 'm2', role: 'patient', content: '其实我觉得这周稍微好一点点，但在周三的时候，那种压抑感又回来了。', isStable: true },
      { id: 'm3', role: 'counselor', content: '听起来周三是一个转折点。在那天发生了什么特定的事情，导致你感到那种... 压抑感再次袭来吗？', isStable: false },
      { id: 'm4', role: 'patient', content: '并没有特别的事情。就是突然觉得以前那些让我开心的事，在那一刻都变得没意义了。', isStable: true },
    ]
  },
  {
    id: 'c2',
    patientId: '880292',
    patientName: '李晨华',
    date: '2024-03-22 15:30',
    duration: '60分',
    status: 'processing'
  }
];

const MOCK_ASSESSMENTS: Assessment[] = [
  { id: 'a1', name: 'PHQ-9 抑郁症筛查量表', date: '2024-03-15', score: 14, riskText: '中度风险', status: 'completed' },
  { id: 'a2', name: 'GAD-7 广泛性焦虑量表', date: '2024-03-15', score: 18, riskText: '重度风险', status: 'completed' }
];

// --- Sub-components ---

const BottomNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const tabs = [
    { id: 'consult', label: '咨询', icon: MessageSquare },
    { id: 'patients', label: '患者', icon: Users },
    { id: 'insights', label: '洞察', icon: LineChart },
    { id: 'profile', label: '我的', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full h-20 bg-white/80 backdrop-blur-md border-t border-slate-100 flex justify-around items-center px-4 z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === tab.id ? 'text-primary font-semibold' : 'text-slate-400'}`}
        >
          <tab.icon size={22} fill={activeTab === tab.id ? 'currentColor' : 'none'} />
          <span className="text-[10px] tracking-wide">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

const Header = ({ title, showBack, onBack, rightElement }: { title: string, showBack?: boolean, onBack?: () => void, rightElement?: React.ReactNode }) => (
  <header className="fixed top-0 left-0 w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-5 z-40">
    <div className="flex items-center gap-3">
      {showBack && (
        <button onClick={onBack} className="p-1 -ml-1 text-slate-600 active:scale-95">
          <ArrowLeft size={22} />
        </button>
      )}
      <h1 className="font-display font-semibold text-lg">{title}</h1>
    </div>
    {rightElement}
  </header>
);

// --- Main Views ---

const HomeView = ({ onStartRecording, onViewDetail }: { onStartRecording: () => void, onViewDetail: (c: Consultation) => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="p-5 pt-20 pb-32 space-y-8"
  >
    <section>
      <h2 className="text-3xl font-display font-bold leading-tight">下午好，李医生</h2>
      <p className="text-slate-400 text-sm mt-1">2026年5月3日 星期日</p>
    </section>

    <section className="flex flex-col items-center py-6">
      <button 
        onClick={onStartRecording}
        className="w-48 h-48 rounded-full bg-primary text-white flex flex-col items-center justify-center gap-2 shadow-2xl relative group active:scale-95 transition-transform"
      >
        <div className="absolute inset-0 rounded-full pulse-ring" />
        <Mic size={48} fill="currentColor" />
        <span className="font-bold text-lg">开始咨询</span>
      </button>
      
      <div className="mt-8 w-full max-w-sm bg-white card-shadow rounded-2xl p-4 flex items-center gap-4 border border-blue-50/50">
        <div className="relative">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute" />
          <div className="w-3 h-3 bg-red-500 rounded-full relative" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">进行中：张三</p>
          <p className="text-xs text-slate-400">已录制 32:15</p>
        </div>
        <div className="flex gap-0.5 items-end h-4">
          {[0.4, 0.7, 0.3, 0.9, 0.5].map((h, i) => (
            <div 
              key={i} 
              className="w-1 bg-primary rounded-full animate-wave" 
              style={{ animationDelay: `${i * 0.15}s` }} 
            />
          ))}
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">今日咨询</h3>
        <button className="text-primary text-sm font-medium flex items-center gap-0.5">
          查看全部 <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="space-y-4">
        {MOCK_CONSULTATIONS.map((c) => (
          <button 
            key={c.id} 
            onClick={() => onViewDetail(c)}
            className="w-full bg-white p-4 rounded-2xl card-shadow flex items-center gap-4 text-left border border-white transition-transform active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden flex-shrink-0">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.patientName}`} 
                alt={c.patientName} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-0.5">
                <h4 className="font-bold truncate">{c.patientName}</h4>
                {c.status === 'completed' ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-primary">
                    <CheckCircle2 size={10} /> 已完成
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-400">
                    <Edit3 size={10} className="animate-pulse" /> 转写中...
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate">{c.date} · #{c.id.slice(1)}次访谈</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  </motion.div>
);

const RecordingView = ({ onComplete }: { onComplete: () => void, key?: string }) => {
  const [timer, setTimer] = useState(2723); // 45:23
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-[60] flex flex-col p-5"
    >
      <header className="flex items-center justify-between h-20">
        <div className="flex items-center gap-2 text-red-500">
          <AlertTriangle size={20} />
          <span className="font-bold text-[10px] tracking-widest uppercase">Emergency SOS</span>
        </div>
        <div className="text-center">
          <h1 className="font-bold text-lg">张三</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Session #3</p>
        </div>
        <div className="w-12" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center relative">
        <div className="relative flex items-center justify-center w-80 h-80">
          <div className="absolute inset-0 rounded-full border-2 border-primary/5 scale-125" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/10 scale-110" />
          <div className="w-64 h-64 rounded-full bg-white shadow-2xl flex flex-col items-center justify-center border border-slate-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Recording</span>
            </div>
            <div className="font-mono text-6xl font-medium tracking-tight">
              {formatTime(timer)}
            </div>
          </div>
        </div>

        <div className="mt-16 flex items-center gap-1.5 h-12">
          {Array.from({ length: 11 }).map((_, i) => (
            <div 
              key={i} 
              className="w-1.5 bg-primary/20 rounded-full animate-wave" 
              style={{ 
                height: `${20 + Math.random() * 80}%`,
                animationDelay: `${i * 0.1}s`,
                opacity: 0.2 + (Math.sin(i / 2) + 1) * 0.4
              }} 
            />
          ))}
        </div>
      </main>

      <footer className="pb-12 pt-8">
        <div className="flex justify-center gap-10 mb-12">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="flex flex-col items-center gap-3 active:scale-90 transition-all"
          >
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center shadow-sm">
              {isPaused ? <Play size={32} /> : <Pause size={32} />}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{isPaused ? '继续' : '暂停'}</span>
          </button>
          
          <button 
            onClick={onComplete}
            className="flex flex-col items-center gap-3 active:scale-90 transition-all"
          >
            <div className="w-20 h-20 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/30">
              <Square size={32} fill="currentColor" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-500">结束咨询</span>
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 opacity-40">
          <div className="flex items-center gap-1.5">
            <Lock size={14} />
            <p className="text-[10px] font-bold uppercase tracking-widest">Recording in progress · Stay focused</p>
          </div>
          <div className="h-1 w-24 bg-slate-100 rounded-full mt-4" />
        </div>
      </footer>
    </motion.div>
  );
};

const ConsultationDetailView = ({ consultation, onBack }: { consultation: Consultation, onBack: () => void, key?: string }) => {
  const [activeTab, setActiveTab] = useState('ai');

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-bg-light pt-16 pb-40"
    >
      <Header 
        title={`${consultation.patientName} · #${consultation.id.slice(1)}次访谈`} 
        showBack 
        onBack={onBack}
        rightElement={<Share2 size={20} className="text-primary" />}
      />

      <main className="p-5 space-y-6">
        <section className="bg-white p-5 rounded-2xl card-shadow flex items-center justify-between border border-white">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <Calendar size={14} /> 2026-05-03 14:00
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <Clock size={14} /> 时长 50分
            </div>
          </div>
          <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">已完成</span>
        </section>

        <nav className="flex p-1 bg-slate-100 rounded-full">
          {['transcript', 'ai', 'assess'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-xs font-bold tracking-widest uppercase rounded-full transition-all ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}
            >
              {tab === 'transcript' ? '对话记录' : tab === 'ai' ? 'AI摘要' : '测评量表'}
            </button>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          {activeTab === 'ai' && (
            <motion.div 
              key="ai"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              <div className="bg-white p-5 rounded-2xl card-shadow space-y-3 border border-white">
                <div className="flex items-center gap-2 text-primary">
                  <Brain size={20} />
                  <h2 className="font-bold">本次咨询摘要</h2>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {consultation.summary}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl card-shadow space-y-4 border border-white">
                <div className="flex items-center gap-2 text-primary">
                  <Edit3 size={20} />
                  <h2 className="font-bold">主要议题</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {consultation.issues?.map((issue) => (
                    <span key={issue} className="px-3 py-1 bg-blue-50 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {issue}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl card-shadow space-y-4 border border-white">
                <div className="flex items-center gap-2 text-primary">
                  <TrendingUp size={20} />
                  <h2 className="font-bold">对比趋势</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-500 text-2xl font-bold">↗</span>
                  <span className="text-red-500 font-bold">症状加重</span>
                  <span className="text-slate-400 text-xs ml-2">相比上次访谈</span>
                </div>
                <div className="h-16 w-full bg-slate-50 rounded-xl overflow-hidden flex items-end px-2 gap-1 pb-1">
                  {[30, 45, 40, 60, 85].map((h, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-t-sm transition-all duration-300 ${i === 4 ? 'bg-primary' : i > 2 ? 'bg-primary/40' : 'bg-primary/20'}`} 
                      style={{ height: `${h}%` }} 
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'transcript' && (
            <motion.div 
              key="transcript"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {consultation.transcript?.map((m) => (
                <div key={m.id} className="flex flex-col gap-1 items-start max-w-[85%]">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${m.role === 'counselor' ? 'bg-blue-100 text-primary' : 'bg-green-100 text-green-700'}`}>
                    {m.role === 'counselor' ? '咨询师' : '患者'}
                  </span>
                  <div className={`p-4 rounded-2xl rounded-tl-none shadow-sm text-sm leading-relaxed ${m.role === 'counselor' ? 'bg-primary text-white border-primary' : 'bg-white border border-green-200 text-slate-800'}`}>
                    {m.content}
                  </div>
                  {!m.isStable && (
                    <span className="text-[10px] text-slate-400 italic px-1 flex items-center gap-1">
                      <Info size={10} /> 语音识别置信度较低
                    </span>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md p-6 border-t border-slate-100 z-40">
        <button className="w-full h-14 bg-primary text-white rounded-full font-bold shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
          <Edit3 size={20} />
          生成个性化测评量表
        </button>
        <p className="text-center text-[10px] text-slate-400 mt-3 tracking-widest uppercase">
          AI-Assisted Analysis · Clinical Use Only
        </p>
      </footer>
    </motion.div>
  );
};

const PatientListView = ({ onSelectPatient }: { onSelectPatient: (p: Patient) => void }) => {
  const [filter, setFilter] = useState('all');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5 pt-20 pb-32 space-y-6"
    >
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold">患者管理</h2>
        <button className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
          <Edit3 size={20} />
        </button>
      </header>

      <div className="relative">
        <input 
          type="text" 
          placeholder="搜索患者姓名..." 
          className="w-full h-12 bg-white rounded-full px-5 pl-12 text-sm border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <MessageSquare size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {['all', 'active', 'archived'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-all ${filter === f ? 'bg-primary text-white shadow-md' : 'bg-white text-slate-400'}`}
          >
            {f === 'all' ? '全部' : f === 'active' ? '活跃' : '已归档'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {MOCK_PATIENTS.map((p) => (
          <button 
            key={p.id} 
            onClick={() => onSelectPatient(p)}
            className="w-full bg-white p-5 rounded-2xl card-shadow border border-white space-y-4 text-left transition-transform active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white ${p.riskLevel === 'high' ? 'bg-red-400' : p.riskLevel === 'medium' ? 'bg-orange-400' : 'bg-primary'}`}>
                  {p.name[0]}
                </div>
                <div>
                  <h3 className="font-bold">{p.name}</h3>
                  <p className="text-[10px] text-slate-400 tracking-wider uppercase">{p.gender} · {p.age}岁 · 最近访问 {p.lastConsultationDate.split(' ')[0]}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <TrendingUp size={18} className={p.riskLevel === 'high' ? 'text-red-500' : p.riskLevel === 'medium' ? 'text-orange-500' : 'text-green-500'} />
                <span className={`text-[8px] font-bold ${p.riskLevel === 'high' ? 'text-red-500' : p.riskLevel === 'medium' ? 'text-orange-500' : 'text-green-500'} uppercase tracking-widest`}>
                  {p.riskLevel === 'high' ? '需重点关注' : p.riskLevel === 'medium' ? '中度风险' : '状况稳定'}
                </span>
              </div>
            </div>
            <div className="flex gap-2 pt-3 border-t border-slate-50">
              <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-400 uppercase tracking-widest">累计访谈 {p.totalConsultations}次</span>
              {p.tags.map(tag => (
                <span key={tag} className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-primary uppercase tracking-widest">{tag}</span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

const InsightsView = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="p-5 pt-20 pb-32 space-y-8"
  >
    <header className="flex items-center justify-between">
      <h2 className="text-2xl font-display font-bold">咨询洞察</h2>
      <div className="flex gap-4 items-center">
        <MessageSquare size={20} className="text-slate-400" />
        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=doctor" alt="Doc" referrerPolicy="no-referrer" />
        </div>
      </div>
    </header>

    <div className="bg-red-50 border border-red-100 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2 text-red-600">
        <AlertTriangle size={20} />
        <h3 className="font-bold">需重点关注 (2)</h3>
      </div>
      <div className="space-y-3">
        {[{ name: '张三', reason: '连续3次加重', desc: '睡眠问题显著恶化，夜间惊醒频率增加。' }, { name: '李四', reason: '高频危机词汇', desc: '捕获到“绝望”、“解脱”等5个风险关联词。' }].map((alert, i) => (
          <div key={i} className="bg-white/60 p-4 rounded-xl flex gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">{alert.name[0]}</div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm">{alert.name}</span>
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{alert.reason}</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">{alert.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      {[
        { label: '本周咨询', value: '12', unit: '次', icon: Calendar, color: 'text-primary', bg: 'bg-blue-50' },
        { label: '活跃患者', value: '8', unit: '人', icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'AI量表', value: '5', unit: '份', icon: Brain, color: 'text-orange-500', bg: 'bg-orange-50' },
        { label: '风险预警', value: '2', unit: '例', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
      ].map((stat, i) => (
        <div key={i} className="bg-white p-4 rounded-2xl card-shadow border border-white flex flex-col justify-between aspect-square">
          <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
            <stat.icon size={20} />
          </div>
          <div>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label} ({stat.unit})</p>
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const LoginView = ({ onLogin }: { onLogin: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-8 z-[100]"
  >
    <div className="flex flex-col items-center gap-6 mb-20">
      <div className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center text-primary">
        <Brain size={32} fill="currentColor" />
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold tracking-tight">心聆助手</h1>
        <p className="text-sm text-slate-400 mt-2 tracking-widest uppercase opacity-70">Empowering Mental Health with AI</p>
      </div>
    </div>

    <div className="w-full max-w-sm space-y-6">
      <button 
        onClick={onLogin}
        className="w-full h-14 bg-[#1E6B4A] text-white rounded-full flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-transform"
      >
        <span className="font-bold tracking-widest uppercase">微信一键登录</span>
      </button>

      <div className="relative w-64 h-64 mx-auto">
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute inset-4 rounded-[40px] overflow-hidden border border-white/50 shadow-2xl">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiBIhtISWKAsQJMtKZKSLbrlofXIV41Ox_LHluPTi72EL7eKJ4iyF3oGGiQo0wFentgLefiaEgCm5ePLFlBmZLSQ3qi47lU5r4FWMhrnNdClOxEoWx1z7bdbRoDws37KiJLUUCx34_VGZdSaQL8ccjywGzojloykaa5oJY1P7vGjsvoLK4AieozWvCfUtOXijPGWvnae3dAdt_k42gFLLy4qOgdHv09AI7HzG_8UShH1x94OS-_JpfgQX-tSBln5H3oDpEFG_1hFA" 
            alt="Zen" 
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>

    <footer className="mt-auto pb-10 flex flex-col items-center gap-6">
      <div className="flex items-center gap-3">
        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
        <span className="text-[10px] text-slate-400 tracking-widest uppercase">
          I agree to <span className="text-primary font-bold">User Agreement</span> and <span className="text-primary font-bold">Privacy Policy</span>
        </span>
      </div>
      <div className="flex items-center gap-1.5 opacity-30">
        <Lock size={12} />
        <span className="text-[8px] font-bold tracking-widest uppercase">AES-256 Bank-level Encryption</span>
      </div>
    </footer>
  </motion.div>
);

const PatientProfileView = ({ patient, onBack }: { patient: Patient, onBack: () => void, key?: string }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="min-h-screen bg-bg-light pt-16 pb-32"
  >
    <Header title={patient.name} showBack onBack={onBack} rightElement={<button className="text-primary font-bold text-sm uppercase tracking-widest">编辑</button>} />

    <main className="p-5 space-y-6">
      <section className="bg-white rounded-2xl p-5 card-shadow flex items-start gap-5 border border-white">
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20">
            <img 
              src={patient.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.name}`} 
              alt={patient.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-primary text-white px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest">
            访谈 {patient.totalConsultations}
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold">{patient.name}</h2>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider">ID: {patient.id}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium tracking-wide">
            <span>{patient.gender} | {patient.age}岁</span>
            <span className="opacity-20">|</span>
            <span>首次: {patient.firstConsultationDate}</span>
          </div>
          <div className="pt-2">
            <span className="px-3 py-1 bg-blue-50 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest">
              焦虑情绪倾向
            </span>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl p-5 card-shadow space-y-5 border border-white">
        <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-widest">
          <TrendingUp size={18} className="text-primary" />
          状态趋势
        </h3>
        {['焦虑程度', '抑郁程度', '睡眠质量'].map((label, i) => (
          <div key={label} className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">{label}</span>
              <span className={`text-[10px] font-bold flex items-center gap-1 uppercase tracking-widest ${i === 1 ? 'text-yellow-500' : 'text-orange-500'}`}>
                {i === 0 ? '中度' : i === 1 ? '轻度' : '重度'} <TrendingUp size={12} className={i === 1 ? 'rotate-90' : ''} />
              </span>
            </div>
            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden flex">
              <div className="h-full bg-green-400" style={{ width: '25%' }} />
              <div className="h-full bg-yellow-400" style={{ width: '25%' }} />
              {i !== 1 && <div className="h-full bg-orange-400" style={{ width: i === 2 ? '25%' : '15%' }} />}
              {i === 2 && <div className="h-full bg-red-400" style={{ width: '25%' }} />}
            </div>
          </div>
        ))}
      </section>

      <section className="bg-white rounded-2xl p-5 card-shadow space-y-5 border border-white">
        <h3 className="font-bold text-sm uppercase tracking-widest">访谈历史</h3>
        <div className="space-y-0">
          {[
            { date: '2024-03-20 14:00', title: '探讨了职场人际关系的边界感', tags: ['#职场压力', '#社交焦虑'], active: true },
            { date: '2024-03-12 10:30', title: '原生家庭影响分析初探', tags: ['#家庭动力'], active: false },
            { date: '2024-02-28 16:00', title: '情绪识别与自我接纳练习', tags: [], active: false },
          ].map((item, i) => (
            <div key={i} className={`relative pl-8 pb-8 ${i === 2 ? '' : 'border-l-2 border-slate-100'} ml-1`}>
              <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${item.active ? 'bg-primary ring-4 ring-blue-50' : 'bg-slate-200 shadow-sm'}`} />
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold tracking-widest">{item.date}</span>
                <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                <div className="flex gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[8px] text-slate-400 font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
    <div className="fixed bottom-8 right-6">
      <button className="w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center active:scale-90 transition-transform">
        <Edit3 size={24} />
      </button>
    </div>
  </motion.div>
);

// --- Root Component ---

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('consult');
  const [currentView, setCurrentView] = useState<'main' | 'recording' | 'detail' | 'patient_profile'>('main');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const startRecording = () => setCurrentView('recording');
  const viewDetail = (c: Consultation) => {
    setSelectedConsultation(c);
    setCurrentView('detail');
  };
  const viewPatientProfile = (p: Patient) => {
    setSelectedPatient(p);
    setCurrentView('patient_profile');
  };

  if (!isLoggedIn) return <LoginView onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div className="min-h-screen bg-bg-light relative font-sans">
      <AnimatePresence mode="wait">
        {currentView === 'recording' && (
          <RecordingView key="recording" onComplete={() => setCurrentView('main')} />
        )}

        {currentView === 'detail' && selectedConsultation && (
          <ConsultationDetailView 
            key="detail" 
            consultation={selectedConsultation} 
            onBack={() => setCurrentView('main')} 
          />
        )}

        {currentView === 'patient_profile' && selectedPatient && (
          <PatientProfileView 
            key="profile" 
            patient={selectedPatient} 
            onBack={() => setCurrentView('main')} 
          />
        )}

        {currentView === 'main' && (
          <motion.div 
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Header 
              title={activeTab === 'consult' ? '今日总览' : activeTab === 'patients' ? '患者列表' : activeTab === 'insights' ? '洞察看板' : '医生概览'} 
            />
            
            <div className="max-w-2xl mx-auto">
              {activeTab === 'consult' && (
                <HomeView 
                  onStartRecording={startRecording}
                  onViewDetail={viewDetail}
                />
              )}
              {activeTab === 'patients' && <PatientListView onSelectPatient={viewPatientProfile} />}
              {activeTab === 'insights' && <InsightsView />}
              {activeTab === 'profile' && (
                <div className="p-5 pt-24 text-center text-slate-400">
                  <User size={64} className="mx-auto mb-4 opacity-10" />
                  <p className="font-bold tracking-widest uppercase">Profile Section coming soon</p>
                  <button onClick={() => setIsLoggedIn(false)} className="mt-8 text-primary font-bold text-xs uppercase tracking-widest">Logout</button>
                </div>
              )}
            </div>

            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
