import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Activity, BarChart2, TrendingUp, Zap, AlertCircle, CheckCircle, RefreshCw, Download } from 'lucide-react';
import PremiumBackground from '../PremiumBackground';
import FloatingParticles from '../FloatingParticles';

const C = { cyan: '#00f5ff', purple: '#9b59ff', green: '#00ff88', red: '#ff3355', orange: '#ff6b2b' };
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const METRICS_CONFIG = [
  { key: 'health',      label: 'Architecture Health',  min: 88, max: 99, color: C.green,  unit: '%', icon: CheckCircle },
  { key: 'complexity',  label: 'Code Complexity',      min: 55, max: 75, color: C.cyan,   unit: '%', icon: Activity },
  { key: 'security',    label: 'Security Score',       min: 92, max: 99, color: C.purple, unit: '%', icon: CheckCircle },
  { key: 'perf',        label: 'Performance Index',    min: 80, max: 95, color: C.orange, unit: '%', icon: Zap },
  { key: 'coupling',    label: 'Coupling Index',       min: 10, max: 25, color: C.red,    unit: '%', icon: AlertCircle },
  { key: 'coverage',    label: 'Test Coverage',        min: 60, max: 85, color: '#4488ff', unit: '%', icon: CheckCircle },
];

const HISTORY_DATA = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  health: rand(85, 99), issues: rand(0, 5), commits: rand(2, 12),
}));

const INSIGHTS = [
  { type: 'warn', color: C.orange, text: 'High coupling detected in UserRepository.js and AppCore — consider dependency injection.' },
  { type: 'ok',   color: C.green,  text: 'Singleton pattern correctly implemented across all 3 instances. No memory leaks detected.' },
  { type: 'info', color: C.cyan,   text: 'Observer network processing 245 events/sec — within optimal range.' },
  { type: 'ok',   color: C.green,  text: 'Factory Engine throughput at 12.4K objects — efficiency 96%.' },
  { type: 'warn', color: C.orange, text: 'Test coverage at 72% — recommend adding unit tests for Repository layer.' },
];

export default function AnalyticsPage({ onBack, onNavigate }) {
  const [metrics, setMetrics] = useState(() =>
    Object.fromEntries(METRICS_CONFIG.map(m => [m.key, rand(m.min, m.max)]))
  );
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setMetrics(Object.fromEntries(METRICS_CONFIG.map(m => [m.key, rand(m.min, m.max)])));
      setLastUpdate(new Date().toLocaleTimeString());
      setRefreshing(false);
    }, 1200);
  };

  useEffect(() => {
    const id = setInterval(refresh, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#020308] text-white overflow-x-hidden">
      <PremiumBackground />
      <FloatingParticles />

      {/* Header */}
      <div className="relative z-10 border-b border-white/5 glass-panel-strong">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button whileHover={{ scale: 1.07, x: -3, boxShadow: `0 0 24px ${C.orange}55`, borderColor: `${C.orange}80` }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              onClick={onBack}
              className="flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest"
              style={{ background: `rgba(255,107,43,0.10)`, border: `2px solid rgba(255,107,43,0.35)`, color: C.orange }}>
              <ArrowLeft size={15} strokeWidth={3} /> Back to Home
            </motion.button>
            <div className="w-px h-6 bg-white/10" />
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.4em] text-white/30">Intelligence Dashboard</p>
              <h1 className="text-xl font-black tracking-widest text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                ANALYTICS ENGINE
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-white/25">Updated {lastUpdate}</span>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={refresh}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest"
              style={{ background: 'rgba(0,245,255,0.06)', border: '1px solid rgba(0,245,255,0.2)', color: C.cyan }}>
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest"
              style={{ background: 'rgba(255,107,43,0.07)', border: '1px solid rgba(255,107,43,0.2)', color: C.orange }}>
              <Download size={14} /> Export
            </motion.button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-10">

        {/* Metric Cards */}
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white/35 mb-5 font-mono">Live Metrics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {METRICS_CONFIG.map((m, i) => {
              const val = metrics[m.key];
              const Icon = m.icon;
              return (
                <motion.div key={m.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -5, borderColor: m.color, boxShadow: `0 16px 40px -10px ${m.color}35` }}
                  className="p-6 rounded-2xl relative overflow-hidden"
                  style={{ background: 'rgba(4,8,22,0.7)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="absolute top-0 right-0 w-16 h-16 rounded-full opacity-15"
                    style={{ background: `radial-gradient(circle,${m.color},transparent)`, filter: 'blur(16px)', transform: 'translate(30%,-30%)' }} />
                  <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-3">{m.label}</p>
                  <div className="flex items-end gap-1.5 mb-3">
                    <span className="text-3xl font-black" style={{ color: m.color, textShadow: `0 0 16px ${m.color}40` }}>{val}</span>
                    <span className="text-sm text-white/30 mb-1">{m.unit}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div className="h-full rounded-full" animate={{ width: `${Math.min(val, 100)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      style={{ background: `linear-gradient(90deg,${m.color}70,${m.color})` }} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-px"
                    style={{ background: `linear-gradient(90deg,transparent,${m.color}40,transparent)` }} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Weekly trend + Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Health Trend */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="p-7 rounded-2xl"
            style={{ background: 'rgba(4,8,22,0.7)', border: '1px solid rgba(0,245,255,0.12)', backdropFilter: 'blur(30px)' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.4em] text-white/30 mb-1">7-Day Health Trend</p>
                <p className="text-lg font-black text-white">Architecture Overview</p>
              </div>
              <TrendingUp size={20} style={{ color: C.green }} />
            </div>
            <div className="flex items-end gap-3 h-36">
              {HISTORY_DATA.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div className="w-full rounded-t-lg relative group"
                    initial={{ height: 0 }} animate={{ height: `${d.health}%` }}
                    transition={{ delay: i * 0.08, duration: 0.8, ease: 'easeOut' }}
                    style={{ background: `linear-gradient(to top,${C.cyan}40,${C.cyan}80)`, border: `1px solid ${C.cyan}30`, minHeight: '8px', maxHeight: '100%' }}>
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                      style={{ color: C.cyan }}>{d.health}%</div>
                  </motion.div>
                  <span className="text-xs font-mono text-white/25">{d.day}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t border-white/5">
              {[['Avg Health', `${Math.round(HISTORY_DATA.reduce((a,b)=>a+b.health,0)/7)}%`, C.green],
                ['Total Issues', HISTORY_DATA.reduce((a,b)=>a+b.issues,0), C.red],
                ['Commits', HISTORY_DATA.reduce((a,b)=>a+b.commits,0), C.cyan]].map(([label, val, color], i) => (
                <div key={i} className="text-center">
                  <p className="text-xl font-black" style={{ color }}>{val}</p>
                  <p className="text-xs text-white/30 font-mono">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Insights */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
            className="p-7 rounded-2xl"
            style={{ background: 'rgba(4,8,22,0.7)', border: '1px solid rgba(155,89,255,0.12)', backdropFilter: 'blur(30px)' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.4em] text-white/30 mb-1">AI Recommendations</p>
                <p className="text-lg font-black text-white">System Insights</p>
              </div>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: C.purple, boxShadow: `0 0 8px ${C.purple}` }} />
            </div>
            <div className="space-y-3">
              {INSIGHTS.map((ins, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: `${ins.color}05`, border: `1px solid ${ins.color}18` }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: ins.color, boxShadow: `0 0 5px ${ins.color}` }} />
                  <p className="text-sm text-white/60 leading-relaxed">{ins.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="p-8 rounded-2xl text-center"
          style={{ background: 'rgba(4,8,22,0.7)', border: '1px solid rgba(255,107,43,0.15)', backdropFilter: 'blur(30px)' }}>
          <p className="text-xs font-mono uppercase tracking-[0.4em] mb-3" style={{ color: `${C.orange}70` }}>Deep Analysis</p>
          <h3 className="text-2xl font-black text-white mb-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>Run Full Codebase Analysis</h3>
          <p className="text-white/45 mb-6 max-w-md mx-auto">Paste your code in the main dashboard and let the AI engine generate comprehensive reports.</p>
          <motion.button whileHover={{ scale: 1.04, boxShadow: `0 0 40px ${C.orange}50` }} whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('dashboard')}
            className="px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-base text-black"
            style={{ background: `linear-gradient(135deg,${C.orange},#ffaa00)`, boxShadow: `0 0 22px ${C.orange}35` }}>
            <BarChart2 size={18} className="inline mr-2 -mt-0.5" /> Open Dashboard
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
