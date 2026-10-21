import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, AlertTriangle, Eye, Loader2, CheckCircle, Lock } from 'lucide-react';
import PremiumBackground from '../PremiumBackground';
import FloatingParticles from '../FloatingParticles';

const C = { cyan: '#00f5ff', purple: '#9b59ff', orange: '#ff6b2b', green: '#00ff88', red: '#ff3355', teal: '#00e5d4' };
const SEV_COLORS = { HIGH: C.red, MED: C.orange, LOW: C.cyan };
const MOCK_THREATS = [
  { id: 1, name: 'Hardcoded Credentials', severity: 'HIGH', file: 'config.js',         line: 14, resolved: false },
  { id: 2, name: 'SQL Injection Vector',   severity: 'MED',  file: 'UserRepository.js', line: 8,  resolved: false },
  { id: 3, name: 'Unvalidated Input',      severity: 'LOW',  file: 'App.js',            line: 22, resolved: false },
];

export default function SecureVaultPage({ onBack }) {
  const [scanning, setScanning] = useState(false);
  const [scanned,  setScanned]  = useState(false);
  const [threats,  setThreats]  = useState(MOCK_THREATS);

  const runScan = () => {
    if (scanning) return;
    setScanning(true); setScanned(false);
    setTimeout(() => { setScanning(false); setScanned(true); }, 2800);
  };
  const resolve = id => setThreats(prev => prev.map(t => t.id === id ? { ...t, resolved: true } : t));
  const score = 'A+';

  return (
    <div className="relative min-h-screen bg-[#020308] text-white overflow-x-hidden flex flex-col items-center">
      <PremiumBackground />
      <FloatingParticles />

      {/* Back button */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-4xl flex items-center pt-8 px-6">
        <motion.button onClick={onBack}
          whileHover={{ scale: 1.07, x: -3, boxShadow: `0 0 24px ${C.green}55`, borderColor: `${C.green}80` }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-sm"
          style={{ background: `${C.green}10`, border: `2px solid ${C.green}35`, color: C.green }}>
          <ArrowLeft size={17} strokeWidth={3} /> Back to Home
        </motion.button>
      </motion.div>

      <div className="relative z-10 w-full max-w-4xl px-6 pb-16 space-y-10 flex flex-col items-center">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center pt-10 pb-4">
          <p className="text-xs font-black uppercase tracking-[0.5em] mb-4 font-mono" style={{ color: `${C.green}70` }}>Military-Grade Security</p>
          <h1 className="font-black tracking-tight leading-none mb-4"
            style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2.4rem,5vw,3.8rem)',
              background: `linear-gradient(135deg,${C.green} 0%,${C.teal} 50%,${C.cyan} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SECURE VAULT
          </h1>
          <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed font-light">
            Military-grade encryption & threat intelligence. Protect your codebase, detect vulnerabilities, and maintain a complete audit trail.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {[
            { icon: Shield,       color: C.green,  title: 'Encryption Layer',  desc: 'AES-256 encryption for all stored code and analysis data. Zero plaintext storage.' },
            { icon: AlertTriangle,color: C.red,    title: 'Threat Scanner',    desc: 'CVE database scanning, OWASP top-10 detection, and real-time vulnerability identification.' },
            { icon: Eye,          color: C.purple, title: 'Access Audit',      desc: 'Immutable audit trail of all authentication events, file access, and system operations.' },
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

        {/* Score + Threats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {/* Score ring */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="p-8 rounded-2xl flex flex-col items-center gap-4"
            style={{ background: 'rgba(4,8,22,0.7)', border: `1px solid ${C.green}20`, backdropFilter: 'blur(30px)' }}>
            <p className="text-xs font-black uppercase tracking-[0.4em] font-mono" style={{ color: `${C.green}70` }}>Security Score</p>
            <div className="relative flex items-center justify-center">
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(0,255,136,0.1)" strokeWidth="8" />
                <circle cx="80" cy="80" r="70" fill="none" stroke={C.green} strokeWidth="8"
                  strokeDasharray="439.8" strokeDashoffset="44" strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 10px ${C.green})`, transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-black" style={{ color: C.green, textShadow: `0 0 30px ${C.green}` }}>{score}</span>
                <span className="text-xs font-mono" style={{ color: `${C.green}60` }}>GRADE</span>
              </div>
            </div>
          </motion.div>

          {/* Threats */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
            className="p-6 rounded-2xl"
            style={{ background: 'rgba(4,8,22,0.7)', border: `1px solid ${C.red}15`, backdropFilter: 'blur(30px)' }}>
            <p className="text-xs font-black uppercase tracking-[0.4em] font-mono mb-5" style={{ color: `${C.red}80` }}>
              {scanned ? `Threat Report — ${threats.filter(t => !t.resolved).length} Active` : 'Threat Detection'}
            </p>
            <div className="space-y-3">
              {threats.map((t, i) => (
                <motion.div key={t.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: scanned ? 1 : 0.3, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background: t.resolved ? 'rgba(0,255,136,0.04)' : 'rgba(255,51,85,0.04)', border: `1px solid ${t.resolved ? 'rgba(0,255,136,0.15)' : 'rgba(255,51,85,0.12)'}` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: t.resolved ? C.green : SEV_COLORS[t.severity], boxShadow: `0 0 6px ${t.resolved ? C.green : SEV_COLORS[t.severity]}` }} />
                    <div>
                      <p className="text-sm font-black text-white/80">{t.name}</p>
                      <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{t.file}:{t.line}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded-lg" style={{ background: `${SEV_COLORS[t.severity]}15`, color: SEV_COLORS[t.severity] }}>{t.severity}</span>
                    {scanned && !t.resolved && (
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => resolve(t.id)}
                        className="p-1.5 rounded-lg" style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)' }}>
                        <CheckCircle size={14} style={{ color: C.green }} />
                      </motion.button>
                    )}
                    {t.resolved && <Lock size={14} style={{ color: C.green }} />}
                  </div>
                </motion.div>
              ))}
            </div>
            {!scanned && <p className="text-xs text-white/25 text-center mt-4 font-mono">Run scan to detect threats</p>}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.05, y: -4, boxShadow: `0 0 55px ${C.green}65` }}
          whileTap={{ scale: 0.97 }} onClick={runScan} disabled={scanning}
          className="flex items-center gap-3 px-14 py-5 rounded-2xl font-black uppercase tracking-[0.25em] text-lg"
          style={{
            background: scanning ? `${C.green}10` : `linear-gradient(135deg,${C.green},${C.teal})`,
            color: scanning ? C.green : '#000814',
            border: scanning ? `2px solid ${C.green}30` : 'none',
            boxShadow: scanning ? 'none' : `0 0 32px ${C.green}45`,
            cursor: scanning ? 'not-allowed' : 'pointer',
          }}>
          {scanning ? <Loader2 size={22} className="animate-spin" /> : <Shield size={22} />}
          {scanning ? 'Scanning...' : 'Scan Now'}
        </motion.button>
      </div>
    </div>
  );
}
