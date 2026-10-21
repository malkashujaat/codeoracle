import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Cpu, Radio } from 'lucide-react';

const BOOT_LINES = [
  '> Initializing CodeOracle v4.0...',
  '> Neural Core:           ✦ ACTIVE',
  '> Database Bridge:       ✦ CONNECTED',
  '> Holographic Layer:     ✦ LOADED',
  '> Security Protocols:    ✦ ENGAGED',
  '> AI Engine:             ✦ BOOTING',
  '> System Ready.',
];

const STATUS_ICONS = [
  { icon: Zap,    label: 'Neural Core',     color: '#00f5ff' },
  { icon: Shield, label: 'Security',        color: '#9b59ff' },
  { icon: Cpu,    label: 'AI Engine',       color: '#ff3355' },
  { icon: Radio,  label: 'DB Bridge',       color: '#00ff88' },
];

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [termText, setTermText] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  const [activeStatus, setActiveStatus] = useState(0);

  // Terminal typing effect
  useEffect(() => {
    let lineIdx = 0, charIdx = 0, current = '';
    const interval = setInterval(() => {
      if (lineIdx < BOOT_LINES.length) {
        const line = BOOT_LINES[lineIdx];
        if (charIdx < line.length) {
          current += line[charIdx++];
          setTermText(current);
        } else {
          current += '\n';
          charIdx = 0;
          lineIdx++;
          setTermText(current);
        }
      } else {
        clearInterval(interval);
      }
    }, 38);
    return () => clearInterval(interval);
  }, []);

  // Progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + Math.random() * 22;
        return next >= 100 ? 100 : next;
      });
    }, 280);
    return () => clearInterval(interval);
  }, []);

  // Status icon rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStatus(s => (s + 1) % STATUS_ICONS.length);
    }, 700);
    return () => clearInterval(interval);
  }, []);

  // Auto-exit
  useEffect(() => {
    const t = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onComplete, 900);
    }, 3800);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 1.04 : 1 }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] overflow-hidden flex flex-col items-center justify-center"
      style={{ background: '#020308' }}
    >
      {/* ── Atmospheric background ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid */}
        <div className="absolute inset-0 bg-grid opacity-40" />

        {/* Blobs */}
        <motion.div
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.08) 0%, transparent 65%)', filter: 'blur(80px)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(155,89,255,0.07) 0%, transparent 65%)', filter: 'blur(100px)' }}
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.6, 0.4, 0.6] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-[30%] right-[10%] w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,51,85,0.06) 0%, transparent 65%)', filter: 'blur(70px)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 w-full max-w-xl px-6 flex flex-col items-center gap-8">

        {/* Logo */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center gap-4"
        >
          {/* Spinning ring logo */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Outer rotating ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: '1px solid transparent',
                background: 'linear-gradient(#020308, #020308) padding-box, linear-gradient(135deg, #ff3355, #9b59ff, #00f5ff, #00ff88) border-box',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
            {/* Inner glow ring */}
            <motion.div
              className="absolute inset-2 rounded-full"
              style={{
                border: '1px solid transparent',
                background: 'linear-gradient(#020308, #020308) padding-box, linear-gradient(225deg, #ff6b2b, #cc44ff, #00f5ff) border-box',
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />
            {/* Icon */}
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap
                className="w-10 h-10"
                style={{ color: '#00f5ff', filter: 'drop-shadow(0 0 16px #00f5ff)' }}
              />
            </motion.div>
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.15em' }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-5xl font-black tracking-widest aurora-text"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            CODEORACLE
          </motion.h1>
          <p className="text-[11px] font-mono uppercase tracking-[0.35em]" style={{ color: 'rgba(0,245,255,0.5)' }}>
            Architect Intelligence System v4.0
          </p>
        </motion.div>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="w-full rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(4,8,18,0.85)',
            border: '1px solid rgba(0,245,255,0.12)',
            backdropFilter: 'blur(40px)',
          }}
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ borderColor: 'rgba(0,245,255,0.08)' }}>
            <div className="w-3 h-3 rounded-full" style={{ background: '#ff3355', boxShadow: '0 0 6px #ff3355' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#ffaa00', boxShadow: '0 0 6px #ffaa00' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#00ff88', boxShadow: '0 0 6px #00ff88' }} />
            <span className="ml-auto text-[10px] font-mono" style={{ color: 'rgba(0,245,255,0.35)' }}>SYSTEM.BOOT</span>
          </div>
          {/* Terminal body */}
          <div className="px-5 py-4 font-mono text-xs leading-relaxed min-h-[130px]" style={{ color: 'rgba(0,245,255,0.8)' }}>
            <span className="whitespace-pre-wrap">{termText}</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.55, repeat: Infinity }}
              style={{ color: '#9b59ff' }}
            >█</motion.span>
          </div>
        </motion.div>

        {/* Status icons row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center gap-4"
        >
          {STATUS_ICONS.map(({ icon: Icon, label, color }, i) => (
            <motion.div
              key={i}
              animate={{
                scale: activeStatus === i ? [1, 1.15, 1] : 1,
                opacity: activeStatus === i ? 1 : 0.35,
              }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-1"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: activeStatus === i ? `${color}18` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${activeStatus === i ? color + '40' : 'rgba(255,255,255,0.05)'}`,
                  boxShadow: activeStatus === i ? `0 0 16px ${color}40` : 'none',
                  transition: 'all 0.4s ease',
                }}
              >
                <Icon size={16} style={{ color: activeStatus === i ? color : 'rgba(255,255,255,0.3)' }} />
              </div>
              <span className="text-[9px] font-mono uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="w-full"
        >
          <div className="flex justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'rgba(0,245,255,0.45)' }}>
              Initializing
            </span>
            <span className="text-[10px] font-mono font-bold" style={{ color: '#00f5ff' }}>
              {Math.floor(progress)}%
            </span>
          </div>
          <div
            className="h-[3px] rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundImage: 'linear-gradient(90deg, #ff3355, #9b59ff, #00f5ff, #00ff88)',
                backgroundSize: '200% auto',
                boxShadow: '0 0 12px rgba(0,245,255,0.6)',
              }}
              initial={{ width: '0%' }}
              animate={{
                width: `${Math.min(progress, 100)}%`,
                backgroundPosition: ['0% center', '200% center'],
              }}
              transition={{ width: { ease: 'easeOut' }, backgroundPosition: { duration: 2, repeat: Infinity, ease: 'linear' } }}
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom scanline accent */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #00f5ff, #9b59ff, transparent)' }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Scanlines overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,245,255,0.015) 3px, rgba(0,245,255,0.015) 4px)',
          zIndex: 20,
        }}
      />
    </motion.div>
  );
}
