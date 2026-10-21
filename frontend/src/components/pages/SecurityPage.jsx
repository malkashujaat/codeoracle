import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Shield, AlertTriangle, Eye, Lock, CheckCircle, Loader2, RefreshCw, FileText } from 'lucide-react';
import PremiumBackground from '../PremiumBackground';
import FloatingParticles from '../FloatingParticles';

const C = { cyan: '#00f5ff', purple: '#9b59ff', green: '#00ff88', red: '#ff3355', orange: '#ff6b2b' };

const INITIAL_THREATS = [
  { id: 1, name: 'Hardcoded Credentials',     sev: 'CRITICAL', file: 'config.js',           line: 14, type: 'Credentials',    resolved: false },
  { id: 2, name: 'SQL Injection Vector',       sev: 'HIGH',     file: 'UserRepository.js',    line: 8,  type: 'Injection',      resolved: false },
  { id: 3, name: 'Unvalidated User Input',     sev: 'HIGH',     file: 'App.js',               line: 22, type: 'Validation',     resolved: false },
  { id: 4, name: 'Weak Encryption (MD5)',      sev: 'MED',      file: 'SDA_Singleton.js',     line: 5,  type: 'Cryptography',   resolved: false },
  { id: 5, name: 'Prototype Pollution Risk',   sev: 'MED',      file: 'SDA_Repository.js',    line: 11, type: 'Prototype',      resolved: false },
  { id: 6, name: 'Missing Rate Limiting',      sev: 'LOW',      file: 'server.js',            line: 31, type: 'API Security',   resolved: false },
];

const SEV_CONFIG = {
  CRITICAL: { color: C.red,    bg: 'rgba(255,51,85,0.08)',   border: 'rgba(255,51,85,0.25)' },
  HIGH:     { color: C.orange, bg: 'rgba(255,107,43,0.08)', border: 'rgba(255,107,43,0.25)' },
  MED:      { color: C.cyan,   bg: 'rgba(0,245,255,0.06)',  border: 'rgba(0,245,255,0.2)' },
  LOW:      { color: C.green,  bg: 'rgba(0,255,136,0.05)',  border: 'rgba(0,255,136,0.18)' },
};

const AUDIT_EVENTS = [
  { time: '14:32:11', event: 'User login', user: 'oracle_agent@dev.com', ip: '127.0.0.1', status: 'success' },
  { time: '14:28:05', event: 'File access', user: 'oracle_agent@dev.com', ip: '127.0.0.1', status: 'success' },
  { time: '14:15:42', event: 'API key update', user: 'admin@codeoracle.io', ip: '192.168.1.5', status: 'success' },
  { time: '13:55:18', event: 'Failed login attempt', user: 'unknown@threat.io', ip: '45.33.32.156', status: 'failed' },
  { time: '13:40:07', event: 'Config export', user: 'oracle_agent@dev.com', ip: '127.0.0.1', status: 'success' },
];

export default function SecurityPage({ onBack, onNavigate }) {
  const [threats, setThreats] = useState(INITIAL_THREATS);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [activeTab, setActiveTab] = useState('threats');

  const scan = () => {
    setScanning(true); setScanned(false);
    setThreats(INITIAL_THREATS.map(t => ({ ...t, resolved: false })));
    setTimeout(() => { setScanning(false); setScanned(true); }, 2500);
  };

  const resolve = id => setThreats(prev => prev.map(t => t.id === id ? { ...t, resolved: true } : t));

  const active = threats.filter(t => !t.resolved);
  const resolved = threats.filter(t => t.resolved);
  const score = scanned ? Math.round(100 - (active.filter(t=>t.sev==='CRITICAL').length*15 + active.filter(t=>t.sev==='HIGH').length*8 + active.filter(t=>t.sev==='MED').length*4 + active.filter(t=>t.sev==='LOW').length*1)) : 100;
  const grade = score >= 95 ? 'A+' : score >= 88 ? 'A' : score >= 80 ? 'B+' : score >= 70 ? 'B' : 'C';
  const gradeColor = score >= 95 ? C.green : score >= 80 ? C.cyan : C.orange;

  const TABS = [
    { id: 'threats', label: 'Threat Report', count: active.length },
    { id: 'audit',   label: 'Audit Log',     count: AUDIT_EVENTS.length },
  ];

  return (
    <div className="relative min-h-screen bg-[#020308] text-white overflow-x-hidden">
      <PremiumBackground />
      <FloatingParticles />

      {/* Header */}
      <div className="relative z-10 border-b border-white/5 glass-panel-strong">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button whileHover={{ scale: 1.07, x: -3, boxShadow: `0 0 24px ${C.green}55`, borderColor: `${C.green}80` }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              onClick={onBack}
              className="flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest"
              style={{ background: `rgba(0,255,136,0.10)`, border: `2px solid rgba(0,255,136,0.35)`, color: C.green }}>
              <ArrowLeft size={15} strokeWidth={3} /> Back to Home
            </motion.button>
            <div className="w-px h-6 bg-white/10" />
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.4em] text-white/30">Enterprise Protection</p>
              <h1 className="text-xl font-black tracking-widest text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>SECURITY MATRIX</h1>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.04, boxShadow: `0 0 30px ${C.green}50` }} whileTap={{ scale: 0.97 }}
            onClick={scan} disabled={scanning}
            className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-black uppercase tracking-widest"
            style={{
              background: scanning ? `${C.green}10` : `linear-gradient(135deg,${C.green},#00e5d4)`,
              color: scanning ? C.green : '#000',
              border: scanning ? `1px solid ${C.green}30` : 'none',
              boxShadow: scanning ? 'none' : `0 0 18px ${C.green}35`,
              cursor: scanning ? 'not-allowed' : 'pointer',
            }}>
            {scanning ? <Loader2 size={15} className="animate-spin" /> : <Shield size={15} />}
            {scanning ? 'Scanning...' : 'Run Scan'}
          </motion.button>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-10 space-y-8">

        {/* Score row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Security Grade', val: grade,  color: gradeColor, sub: `Score: ${score}/100` },
            { label: 'Active Threats', val: active.length, color: active.length > 0 ? C.red : C.green, sub: `${resolved.length} resolved` },
            { label: 'Critical Issues', val: active.filter(t=>t.sev==='CRITICAL').length, color: C.red, sub: 'Requires immediate action' },
            { label: 'Encryption',   val: '100%', color: C.green, sub: 'AES-256 active' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4, borderColor: s.color, boxShadow: `0 16px 40px -10px ${s.color}30` }}
              className="p-6 rounded-2xl relative overflow-hidden"
              style={{ background: 'rgba(4,8,22,0.7)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(30px)' }}>
              <p className="text-xs font-mono uppercase tracking-widest text-white/30 mb-3">{s.label}</p>
              <p className="text-4xl font-black mb-2" style={{ color: s.color, textShadow: `0 0 20px ${s.color}40` }}>{s.val}</p>
              <p className="text-xs text-white/30">{s.sub}</p>
              <div className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg,transparent,${s.color}40,transparent)` }} />
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/5 pb-0">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-6 py-3 font-black text-sm uppercase tracking-widest border-b-2 transition-all"
              style={{
                borderColor: activeTab === tab.id ? C.green : 'transparent',
                color: activeTab === tab.id ? C.green : 'rgba(255,255,255,0.4)',
                background: 'transparent',
              }}>
              {tab.label}
              <span className="px-2 py-0.5 rounded-full text-xs font-black"
                style={{ background: `${activeTab === tab.id ? C.green : 'rgba(255,255,255,0.08)'}20`, color: activeTab === tab.id ? C.green : 'rgba(255,255,255,0.3)', border: `1px solid ${activeTab === tab.id ? C.green + '30' : 'rgba(255,255,255,0.08)'}` }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Threat Report */}
        <AnimatePresence mode="wait">
          {activeTab === 'threats' && (
            <motion.div key="threats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {!scanned && !scanning && (
                <div className="text-center py-16 text-white/30">
                  <Shield size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="text-base font-mono">Run a scan to detect security threats</p>
                </div>
              )}
              {scanning && (
                <div className="text-center py-16">
                  <Loader2 size={40} className="mx-auto mb-4 animate-spin" style={{ color: C.green }} />
                  <p className="text-base font-mono" style={{ color: C.green }}>Scanning codebase for vulnerabilities...</p>
                </div>
              )}
              {scanned && (
                <div className="space-y-3">
                  {threats.map((t, i) => {
                    const cfg = SEV_CONFIG[t.sev];
                    return (
                      <motion.div key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-5 rounded-2xl"
                        style={{ background: t.resolved ? 'rgba(0,255,136,0.04)' : cfg.bg, border: `1px solid ${t.resolved ? 'rgba(0,255,136,0.15)' : cfg.border}` }}>
                        <div className="flex items-center gap-4">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ background: t.resolved ? C.green : cfg.color, boxShadow: `0 0 8px ${t.resolved ? C.green : cfg.color}` }} />
                          <div>
                            <p className="text-base font-black text-white/90">{t.name}</p>
                            <p className="text-sm font-mono text-white/35 mt-0.5">{t.file} · line {t.line} · {t.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black px-3 py-1 rounded-xl"
                            style={{ background: `${cfg.color}15`, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                            {t.resolved ? 'RESOLVED' : t.sev}
                          </span>
                          {!t.resolved && (
                            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                              onClick={() => resolve(t.id)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest"
                              style={{ background: `${C.green}10`, border: `1px solid ${C.green}25`, color: C.green }}>
                              <CheckCircle size={13} /> Fix
                            </motion.button>
                          )}
                          {t.resolved && <Lock size={16} style={{ color: C.green }} />}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* Audit Log */}
          {activeTab === 'audit' && (
            <motion.div key="audit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="grid grid-cols-5 px-5 py-3 text-xs font-black uppercase tracking-widest text-white/30 font-mono"
                  style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span>Time</span><span>Event</span><span>User</span><span>IP Address</span><span>Status</span>
                </div>
                {AUDIT_EVENTS.map((ev, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                    className="grid grid-cols-5 px-5 py-4 text-sm items-center"
                    style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span className="font-mono text-white/40">{ev.time}</span>
                    <span className="font-black text-white/80">{ev.event}</span>
                    <span className="font-mono text-white/45 text-xs">{ev.user}</span>
                    <span className="font-mono text-white/35 text-xs">{ev.ip}</span>
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg w-fit"
                      style={{
                        background: ev.status === 'success' ? `${C.green}10` : `${C.red}10`,
                        color: ev.status === 'success' ? C.green : C.red,
                        border: `1px solid ${ev.status === 'success' ? C.green : C.red}25`,
                      }}>
                      {ev.status.toUpperCase()}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
