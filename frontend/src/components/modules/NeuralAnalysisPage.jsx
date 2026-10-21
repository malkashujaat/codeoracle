import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Activity, BarChart2, Network, Play, Loader2, CheckCircle, Terminal } from 'lucide-react';
import PremiumBackground from '../PremiumBackground';
import FloatingParticles from '../FloatingParticles';

const C = { cyan: '#00f5ff', purple: '#9b59ff', orange: '#ff6b2b', green: '#00ff88', teal: '#00e5d4' };

const MOCK_LINES = [
  '> Initializing Neural Analysis Engine v4.0...',
  '> Scanning file: SDA_Singleton.js',
  '> Pattern detected: SINGLETON at line 2',
  '> Scanning file: SDA_Repository.js',
  '> Pattern detected: REPOSITORY at line 1',
  '> Complexity score: 94/100 — Excellent',
  '> Coupling index: 0.12 — Low coupling detected',
  '> Dependency graph: 3 nodes, 2 edges',
  '> Circular dependencies: NONE',
  '> Analysis complete. System Health: 98%',
];

export default function NeuralAnalysisPage({ onBack }) {
  const [running, setRunning] = useState(false);
  const [lines,   setLines]   = useState([]);
  const [done,    setDone]    = useState(false);

  const runAnalysis = () => {
    if (running) return;
    setRunning(true); setDone(false); setLines([]);
    MOCK_LINES.forEach((line, i) => {
      setTimeout(() => {
        setLines(prev => [...prev, line]);
        if (i === MOCK_LINES.length - 1) { setRunning(false); setDone(true); }
      }, i * 350);
    });
  };

  return (
    <div className="relative min-h-screen bg-[#020308] text-white overflow-x-hidden flex flex-col items-center">
      <PremiumBackground />
      <FloatingParticles />

      {/* Back button — centered row */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-4xl flex items-center pt-8 px-6">
        <motion.button onClick={onBack}
          whileHover={{ scale: 1.07, x: -3, boxShadow: `0 0 24px ${C.cyan}55`, borderColor: `${C.cyan}80` }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-sm"
          style={{ background: `${C.cyan}10`, border: `2px solid ${C.cyan}35`, color: C.cyan }}>
          <ArrowLeft size={17} strokeWidth={3} /> Back to Home
        </motion.button>
      </motion.div>

      {/* Content — centered */}
      <div className="relative z-10 w-full max-w-4xl px-6 pb-16 space-y-10 flex flex-col items-center">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-center pt-10 pb-4">
          <p className="text-xs font-black uppercase tracking-[0.5em] mb-4 font-mono" style={{ color: `${C.cyan}70` }}>AI-Powered Intelligence</p>
          <h1 className="font-black tracking-tight leading-none mb-4"
            style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2.4rem,5vw,3.8rem)',
              background: `linear-gradient(135deg,#fff 0%,${C.cyan} 55%,${C.teal} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            NEURAL ANALYSIS
          </h1>
          <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed font-light">
            Real-time structural heuristics & AI-powered code intelligence. Detect patterns, measure complexity, and map dependencies instantly.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {[
            { icon: Activity, color: C.cyan,   title: 'Pattern Detection',  desc: 'Identifies 40+ architectural patterns: Singleton, Factory, Observer, Repository and more.' },
            { icon: BarChart2, color: C.purple, title: 'Complexity Score',   desc: 'Cyclomatic complexity, cognitive load, and coupling metrics with improvement hints.' },
            { icon: Network,  color: C.orange,  title: 'Dependency Graph',  desc: 'Maps inter-module relationships, circular dependencies, and coupling hotspots.' },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
              whileHover={{ y: -8, borderColor: f.color, boxShadow: `0 20px 50px -15px ${f.color}45` }}
              className="p-7 rounded-2xl relative overflow-hidden cursor-default"
              style={{ background: 'rgba(4,8,22,0.7)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                <f.icon size={28} style={{ color: f.color }} />
              </div>
              <h3 className="text-lg font-black text-white mb-2 tracking-wide">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              <div className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg,transparent,${f.color}50,transparent)` }} />
            </motion.div>
          ))}
        </div>

        {/* Console */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="w-full rounded-2xl overflow-hidden"
          style={{ background: 'rgba(2,4,14,0.9)', border: '1px solid rgba(0,245,255,0.15)', backdropFilter: 'blur(40px)' }}>
          <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ borderColor: 'rgba(0,245,255,0.08)' }}>
            <div className="w-3 h-3 rounded-full" style={{ background: '#ff3355', boxShadow: '0 0 6px #ff3355' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#ffaa00', boxShadow: '0 0 6px #ffaa00' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#00ff88', boxShadow: '0 0 6px #00ff88' }} />
            <Terminal size={12} className="ml-auto" style={{ color: 'rgba(0,245,255,0.4)' }} />
            <span className="text-xs font-mono" style={{ color: 'rgba(0,245,255,0.4)' }}>NEURAL.CONSOLE</span>
          </div>
          <div className="p-5 min-h-[200px] font-mono text-sm leading-relaxed">
            {lines.length === 0 && !running && (
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>{'>'} Click RUN ANALYSIS to begin...</span>
            )}
            {lines.map((line, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
                <span style={{ color: line.includes('detected') ? C.cyan : line.includes('complete') || line.includes('NONE') ? C.green : 'rgba(0,245,255,0.8)' }}>{line}</span>
              </motion.div>
            ))}
            {running && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}
              className="inline-block w-2 h-4 ml-1 rounded-sm align-middle" style={{ background: C.cyan }} />}
            {done && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid rgba(0,245,255,0.1)' }}>
                <CheckCircle size={16} style={{ color: C.green }} />
                <span className="font-black" style={{ color: C.green }}>Analysis complete — System health: 98%</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.05, y: -4, boxShadow: `0 0 55px ${C.cyan}65, 0 0 22px ${C.cyan}35` }}
          whileTap={{ scale: 0.97 }}
          onClick={runAnalysis} disabled={running}
          className="flex items-center gap-3 px-14 py-5 rounded-2xl font-black uppercase tracking-[0.25em] text-lg relative overflow-hidden"
          style={{
            background: running ? `${C.cyan}10` : `linear-gradient(135deg,${C.cyan},${C.teal})`,
            color: running ? C.cyan : '#000814',
            border: running ? `2px solid ${C.cyan}30` : 'none',
            boxShadow: running ? 'none' : `0 0 32px ${C.cyan}45`,
            cursor: running ? 'not-allowed' : 'pointer',
          }}>
          {running ? <Loader2 size={22} className="animate-spin" /> : <Play size={22} />}
          {running ? 'Analyzing...' : 'Run Analysis'}
        </motion.button>
      </div>
    </div>
  );
}
