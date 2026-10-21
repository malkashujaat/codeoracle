import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Layout, Activity, Loader2, Radio } from 'lucide-react';
import PremiumBackground from '../PremiumBackground';
import FloatingParticles from '../FloatingParticles';

const C = { cyan: '#00f5ff', purple: '#9b59ff', orange: '#ff6b2b', green: '#00ff88', teal: '#00e5d4' };
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default function QuantumFlowPage({ onBack }) {
  const [streaming, setStreaming] = useState(false);
  const [metrics,   setMetrics]   = useState({ latency: 12, throughput: 4200, packets: 18400, errors: 0 });

  useEffect(() => {
    if (!streaming) return;
    const id = setInterval(() => {
      setMetrics(m => ({
        latency:    rand(8, 18),
        throughput: rand(3800, 5200),
        packets:    m.packets + rand(50, 200),
        errors:     Math.random() > 0.95 ? 1 : 0,
      }));
    }, 800);
    return () => clearInterval(id);
  }, [streaming]);

  const BARS = [
    { label: 'Latency',    value: metrics.latency,           max: 50,   unit: 'ms',    color: C.cyan,   good: v => v < 20 },
    { label: 'Throughput', value: metrics.throughput,        max: 6000, unit: 'req/s', color: C.green,  good: v => v > 3000 },
    { label: 'Packets',    value: metrics.packets % 1000,    max: 1000, unit: 'K',     color: C.purple, good: () => true },
    { label: 'Error Rate', value: metrics.errors,            max: 10,   unit: '%',     color: C.orange, good: v => v === 0 },
  ];

  return (
    <div className="relative min-h-screen bg-[#020308] text-white overflow-x-hidden flex flex-col items-center">
      <PremiumBackground />
      <FloatingParticles />

      {/* Back button */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-4xl flex items-center pt-8 px-6">
        <motion.button onClick={onBack}
          whileHover={{ scale: 1.07, x: -3, boxShadow: `0 0 24px ${C.orange}55`, borderColor: `${C.orange}80` }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-sm"
          style={{ background: `${C.orange}10`, border: `2px solid ${C.orange}35`, color: C.orange }}>
          <ArrowLeft size={17} strokeWidth={3} /> Back to Home
        </motion.button>
      </motion.div>

      <div className="relative z-10 w-full max-w-4xl px-6 pb-16 space-y-10 flex flex-col items-center">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center pt-10 pb-4">
          <p className="text-xs font-black uppercase tracking-[0.5em] mb-4 font-mono" style={{ color: `${C.orange}70` }}>Zero-Latency Engine</p>
          <h1 className="font-black tracking-tight leading-none mb-4"
            style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2.4rem,5vw,3.8rem)',
              background: `linear-gradient(135deg,${C.orange} 0%,#ffaa00 50%,#ffdd00 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            QUANTUM FLOW
          </h1>
          <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed font-light">
            Zero-latency visual rendering & real-time data streaming. Monitor your pipeline health with live telemetry.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {[
            { icon: Zap,      color: C.orange, title: 'Stream Pipeline', desc: 'Sub-millisecond data pipeline with zero-copy architecture and lock-free concurrent processing.' },
            { icon: Layout,   color: C.purple, title: 'Visual Renderer', desc: 'Hardware-accelerated diagram rendering engine capable of 60fps on complex graphs.' },
            { icon: Activity, color: C.cyan,   title: 'Flow Monitor',    desc: 'Real-time throughput and latency telemetry with anomaly detection and auto-alerting.' },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
              whileHover={{ y: -8, borderColor: f.color, boxShadow: `0 20px 50px -15px ${f.color}45` }}
              className="p-7 rounded-2xl relative overflow-hidden cursor-default"
              style={{ background: 'rgba(4,8,22,0.7)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                <f.icon size={28} style={{ color: f.color }} />
              </div>
              <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${f.color}50,transparent)` }} />
            </motion.div>
          ))}
        </div>

        {/* Live Monitor */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="w-full p-8 rounded-2xl"
          style={{ background: 'rgba(4,8,22,0.7)', border: `1px solid ${C.orange}18`, backdropFilter: 'blur(30px)' }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.4em] font-mono mb-1" style={{ color: `${C.orange}80` }}>Live Flow Monitor</p>
              <p className="text-sm text-white/35">Real-time pipeline telemetry</p>
            </div>
            <div className="flex items-center gap-2">
              {streaming && <Radio size={14} className="animate-pulse" style={{ color: C.green }} />}
              <span className="text-xs font-mono font-black" style={{ color: streaming ? C.green : 'rgba(255,255,255,0.3)' }}>
                {streaming ? 'LIVE' : 'IDLE'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {BARS.map(bar => {
              const pct = Math.min((bar.value / bar.max) * 100, 100);
              const isGood = bar.good(bar.value);
              return (
                <div key={bar.label} className="flex flex-col gap-3">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-mono uppercase tracking-widest text-white/40">{bar.label}</span>
                    <span className="text-xl font-black" style={{ color: isGood ? bar.color : C.orange }}>
                      {bar.value.toLocaleString()}<span className="text-xs ml-1 font-normal text-white/30">{bar.unit}</span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div className="h-full rounded-full" animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }}
                      style={{ background: `linear-gradient(90deg,${bar.color}80,${bar.color})`, boxShadow: streaming ? `0 0 8px ${bar.color}60` : 'none' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.05, y: -4, boxShadow: `0 0 55px ${C.orange}65` }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setStreaming(s => !s)}
          className="flex items-center gap-3 px-14 py-5 rounded-2xl font-black uppercase tracking-[0.25em] text-lg"
          style={{
            background: streaming ? `${C.orange}12` : `linear-gradient(135deg,${C.orange},#ffaa00)`,
            color: streaming ? C.orange : '#000814',
            border: streaming ? `2px solid ${C.orange}40` : 'none',
            boxShadow: streaming ? 'none' : `0 0 32px ${C.orange}40`,
          }}>
          {streaming ? <><Activity size={22} className="animate-pulse" /> Stop Stream</> : <><Zap size={22} /> Start Stream</>}
        </motion.button>
      </div>
    </div>
  );
}
