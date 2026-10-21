import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const SHAPES = [
  { size: 180, color: 'rgba(0,245,255,0.035)',    top: '8%',  left: '12%', delay: 0 },
  { size: 260, color: 'rgba(155,89,255,0.04)',    top: '60%', left: '5%',  delay: 2 },
  { size: 140, color: 'rgba(255,51,85,0.04)',     top: '20%', left: '78%', delay: 1.5 },
  { size: 320, color: 'rgba(0,255,136,0.025)',    top: '75%', left: '65%', delay: 3 },
  { size: 100, color: 'rgba(255,107,43,0.045)',   top: '45%', left: '42%', delay: 4 },
  { size: 200, color: 'rgba(68,136,255,0.035)',   top: '5%',  left: '50%', delay: 0.8 },
  { size: 160, color: 'rgba(204,68,255,0.04)',    top: '85%', left: '30%', delay: 2.5 },
  { size: 240, color: 'rgba(0,229,212,0.03)',     top: '38%', left: '88%', delay: 1 },
];

// Tiny floating dots
const DOTS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  size: 1 + Math.random() * 2.5,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  delay: Math.random() * 6,
  duration: 6 + Math.random() * 8,
  color: ['#00f5ff', '#9b59ff', '#ff3355', '#00ff88', '#ff6b2b', '#cc44ff'][
    Math.floor(Math.random() * 6)
  ],
}));

export default function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {/* Blurred atmospheric blobs */}
      {SHAPES.map((s, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: s.color,
            filter: `blur(${s.size * 0.45}px)`,
          }}
          animate={{
            y: [0, -24, 12, 0],
            x: [0, 16, -10, 0],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{
            duration: 12 + i * 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: s.delay,
          }}
        />
      ))}

      {/* Tiny floating dot particles */}
      {DOTS.map((d) => (
        <motion.div
          key={d.id}
          style={{
            position: 'absolute',
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            borderRadius: '50%',
            background: d.color,
            boxShadow: `0 0 ${d.size * 3}px ${d.color}`,
          }}
          animate={{
            y: [0, -40, 20, 0],
            x: [0, 15, -8, 0],
            opacity: [0.2, 0.8, 0.3, 0.2],
          }}
          transition={{
            duration: d.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: d.delay,
          }}
        />
      ))}

      {/* Grid overlay */}
      <div
        className="absolute inset-0 bg-grid opacity-100"
        style={{ mixBlendMode: 'overlay' }}
      />
    </div>
  );
}
