import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Search, Sparkles, Layout, Trash2, Settings,
  ChevronRight, Download, Loader2,
  History, Activity, LogOut,
  Plus, X, Wrench, Hash, Edit3, Database,
  Shield, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import html2pdf from 'html2pdf.js';
import { jsPDF } from 'jspdf';
import { apiUrl, jsonHeaders } from './api';
import { CodeOracleCore, UIBridge } from './architectures/CodeOracleCore';
import CodeEditor from './components/CodeEditor';
import AnalysisPanel from './components/AnalysisPanel';
import MermaidRenderer from './components/MermaidRenderer';
import SplashScreen from './components/SplashScreen';
import CursorTrail from './components/CursorTrail';
import FloatingParticles from './components/FloatingParticles';
import NeuralAnalysisPage from './components/modules/NeuralAnalysisPage';
import SecureVaultPage from './components/modules/SecureVaultPage';
import QuantumFlowPage from './components/modules/QuantumFlowPage';
import DataMatricesPage from './components/modules/DataMatricesPage';
import LandingPage from './components/pages/LandingPage';
import LoginPage from './components/pages/LoginPage';
import AnalyticsPage from './components/pages/AnalyticsPage';
import SecurityPage from './components/pages/SecurityPage';

const core = CodeOracleCore.getInstance();
const uiBridge = new UIBridge(core);
const adapter = core.getAdapter();

const INITIAL_FILES = [
  { id: '1', name: 'App.js', content: '// Enterprise Entry Point\nclass AppCore {\n  constructor() {\n    this.active = true;\n  }\n}', language: 'javascript' },
  { id: '2', name: 'SDA_Singleton.js', content: 'class SystemCore {\n  static instance = null;\n  static getInstance() {\n    if (!this.instance) this.instance = new SystemCore();\n    return this.instance;\n  }\n}', language: 'javascript' },
  { id: '3', name: 'SDA_Repository.js', content: 'class UserRepository {\n  async findById(id) {\n    return { id, name: "John Doe" };\n  }\n}', language: 'javascript' },
];

/* ────────────────────────────────────────────────────────────────
   ACTION BUTTON – Holographic neon style
──────────────────────────────────────────────────────────────── */
const ACTION_THEMES = {
  cyan: {
    bg: 'rgba(0,245,255,0.08)',
    border: 'rgba(0,245,255,0.25)',
    glow: '0 0 28px rgba(0,245,255,0.35), 0 0 55px rgba(0,245,255,0.15)',
    text: '#00f5ff',
    icon: '#00e5d4',
  },
  warm: {
    bg: 'rgba(255,107,43,0.08)',
    border: 'rgba(255,107,43,0.3)',
    glow: '0 0 28px rgba(255,51,85,0.35), 0 0 55px rgba(255,107,43,0.15)',
    text: '#ff6b2b',
    icon: '#ff3355',
  },
  purple: {
    bg: 'rgba(155,89,255,0.08)',
    border: 'rgba(155,89,255,0.25)',
    glow: '0 0 28px rgba(155,89,255,0.35), 0 0 55px rgba(204,68,255,0.15)',
    text: '#9b59ff',
    icon: '#cc44ff',
  },
  emerald: {
    bg: 'rgba(0,255,136,0.07)',
    border: 'rgba(0,255,136,0.22)',
    glow: '0 0 28px rgba(0,255,136,0.3), 0 0 55px rgba(0,229,212,0.12)',
    text: '#00ff88',
    icon: '#00e5d4',
  },
};

function ActionBtn({ icon, label, active, color, onClick }) {
  const t = ACTION_THEMES[color] || ACTION_THEMES.cyan;
  return (
    <motion.button
      whileHover={{ scale: 1.06, y: -4, boxShadow: t.glow }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      style={{
        background: t.bg,
        border: `1px solid ${t.border}`,
        color: t.text,
        transition: 'all 0.25s ease',
      }}
      className="flex-1 h-24 font-black text-xs uppercase tracking-[0.2em] rounded-2xl flex flex-col items-center justify-center gap-2 relative overflow-hidden group"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06), transparent)' }} />
      {active
        ? <Loader2 size={24} className="animate-spin" style={{ color: t.icon }} />
        : React.cloneElement(icon, { size: 24, style: { color: t.icon } })
      }
      <span className="text-white/80">{label}</span>
    </motion.button>
  );
}

/* ────────────────────────────────────────────────────────────────
   METRIC CARD
──────────────────────────────────────────────────────────────── */
const CARD_ACCENTS = [
  { from: '#00f5ff', to: '#00e5d4', glow: 'rgba(0,245,255,0.3)' },
  { from: '#9b59ff', to: '#cc44ff', glow: 'rgba(155,89,255,0.3)' },
  { from: '#ff3355', to: '#ff6b2b', glow: 'rgba(255,51,85,0.3)' },
  { from: '#00ff88', to: '#00e5d4', glow: 'rgba(0,255,136,0.3)' },
];

function MetricCard({ card, index }) {
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: `0 25px 60px -20px ${accent.glow}` }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="glass-card rounded-3xl p-7 relative overflow-hidden"
      style={{ border: `1px solid rgba(255,255,255,0.06)` }}
    >
      {/* Gradient corner blob */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20"
        style={{ background: `radial-gradient(circle, ${accent.from}, transparent)`, filter: 'blur(24px)', transform: 'translate(30%, -30%)' }}
      />
      <span className="text-xs uppercase tracking-[0.38em] font-black" style={{ color: 'rgba(255,255,255,0.45)' }}>
        {card.label}
      </span>
      <div className="mt-4 flex items-end gap-3">
        <h3 className="text-4xl font-black text-white leading-tight"
          style={{ textShadow: `0 0 20px ${accent.from}40` }}>
          {card.value}
        </h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
        {card.meta}
      </p>
      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-6 right-6 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent.from}60, transparent)` }}
      />
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────
   MAIN APP
──────────────────────────────────────────────────────────────── */
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showHomepage, setShowHomepage] = useState(false);
  const [showAccessPage, setShowAccessPage] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // currentPage: 'landing'|'login'|'dashboard'|'analytics'|'security'|'neural'|'secure'|'quantum'|'data'
  const [currentPage, setCurrentPage] = useState('landing');
  const [files, setFiles] = useState(() =>
    JSON.parse(localStorage.getItem('oracle_workspace') || JSON.stringify(INITIAL_FILES))
  );
  const [activeFileId, setActiveFileId] = useState(files[0]?.id || '1');
  const activeFile = useMemo(() => files.find(f => f.id === activeFileId) || files[0], [files, activeFileId]);

  const [activeTab, setActiveTab] = useState('analyze');
  const [apiKey, setApiKey] = useState(core.getModule('ai').apiKey);
  const [showSettings, setShowSettings] = useState(false);
  const [results, setResults] = useState({ analyze: '', optimize: '', diagram: '', fix: '' });
  const [streaming, setStreaming] = useState({ analyze: false, optimize: false, diagram: false, fix: false });
  const [history, setHistory] = useState(() =>
    JSON.parse(localStorage.getItem('oracle_history') || '[]')
  );
  const [expandedDiagram, setExpandedDiagram] = useState(null);
  const [editingFileId, setEditingFileId] = useState(null);
  const [tempFileName, setTempFileName] = useState('');
  const [isDbConnected, setIsDbConnected] = useState(false);

  const analyticsMetrics = core.getDashboardMetrics();

  /* ── DB Sync Monitor ── */
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(apiUrl('/api/files'));
        setIsDbConnected(res.ok);
      } catch { setIsDbConnected(false); }
    };
    check();
    const t = setInterval(check, 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    localStorage.setItem('oracle_workspace', JSON.stringify(files));
    if (isDbConnected) {
      fetch(apiUrl('/api/files'), {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify(adapter.adaptFileForApi(activeFile)),
      }).catch(() => { });
    }
  }, [files, activeFile, isDbConnected]);

  useEffect(() => { localStorage.setItem('oracle_history', JSON.stringify(history)); }, [history]);

  /* ── Analysis ── */
  const runProjectAnalysis = async (action) => {
    if (!activeFile?.content.trim() || streaming[action]) return;
    setResults(r => ({ ...r, [action]: '' }));
    setStreaming(s => ({ ...s, [action]: true }));
    setActiveTab(action);
    try {
      const request = await uiBridge.requestAnalysis(action, { files, activeFile, isDbConnected }, chunk => {
        setResults(r => ({ ...r, [action]: r[action] + chunk }));
      });
      if (request?.historyItem) setHistory(h => [{ ...request.historyItem }, ...h].slice(0, 10));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setStreaming(s => ({ ...s, [action]: false }));
    }
  };

  const detectLanguage = (code) => {
    if (code.includes('def ') || code.includes('import numpy') || code.includes('print(')) return 'python';
    if (code.includes('public class') || code.includes('System.out.print')) return 'java';
    if (code.includes(': string') || code.includes(': number') || code.includes('interface ') || code.includes('type ')) return 'typescript';
    return 'javascript';
  };

  const handleCodeChange = (newCode) => {
    const lang = detectLanguage(newCode);
    setFiles(files.map(f => f.id === activeFileId ? { ...f, content: newCode, language: lang } : f));
  };
  const restoreHistory = (item) => { setResults(r => ({ ...r, [item.type]: item.content })); setActiveTab(item.type); toast.success(`Recalled ${item.type}.`); };
  const deleteHistoryItem = (id, e) => { e.stopPropagation(); setHistory(h => h.filter(x => x.id !== id)); toast.success('Entry removed.'); };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('landing');
    toast.success('Logged out successfully.');
  };

  const navigate = (page) => setCurrentPage(page);
  const startRenaming = (id, name, e) => { e.stopPropagation(); setEditingFileId(id); setTempFileName(name); };
  const saveFileName = (id) => {
    if (!tempFileName.trim()) return setEditingFileId(null);
    setFiles(files.map(f => f.id === id ? { ...f, name: tempFileName } : f));
    setEditingFileId(null);
    toast.success('File renamed.');
  };
  // Convert an SVG string → base64 PNG via canvas (for PDF embedding)
  const svgToPngBase64 = (svgString, width = 700, height = 400) =>
    new Promise((resolve) => {
      try {
        if (!/xmlns=/.test(svgString)) {
          svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#0a0e1a';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL('image/png'));
          } catch (e) {
            URL.revokeObjectURL(url);
            resolve(null);
          }
        };
        img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
        img.src = url;
      } catch { resolve(null); }
    });

  const exportPDF = async () => {
    const hasData = Object.values(results).some(v => v.length > 0);
    if (!hasData && !(activeFile?.content && activeFile.content.trim())) return toast.error('Run an analysis first before exporting.');

    // Prepare a local copy of results for export; if empty, fall back to active file content
    const exportResults = { ...results };
    if (Object.values(exportResults).every(v => !v?.trim())) {
      exportResults.analyze = activeFile?.content || '';
    }

    toast.loading('Rendering diagrams for PDF...', { id: 'pdf-export' });
    try {
      const mermaid = (await import('mermaid')).default;

      // Re-init mermaid with light-friendly theme for PDF
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
          primaryColor: '#0d1b2a',
          primaryTextColor: '#e2f0ff',
          primaryBorderColor: '#00f5ff',
          lineColor: '#00f5ff',
          secondaryColor: '#111827',
          tertiaryColor: '#0a0e1a',
          fontFamily: 'Courier New, monospace',
          fontSize: '14px',
          nodeBorder: '#00f5ff',
          edgeLabelBackground: '#0d1b2a',
          defaultLinkColor: '#00f5ff',
        },
        securityLevel: 'loose',
        flowchart: { useMaxWidth: true, htmlLabels: false },
        sequence: { useMaxWidth: true },
        class: { useMaxWidth: true },
      });

      // Extract all mermaid code blocks from all result sections (use exportResults fallback)
      console.log('PDF export: exportResults keys lengths=', Object.keys(exportResults).map(k => `${k}:${(exportResults[k] || '').length}`).join(', '));
      const allText = Object.values(exportResults).join('\n');
      const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
      const diagramBlocks = [];
      let match;
      while ((match = mermaidRegex.exec(allText)) !== null) {
        diagramBlocks.push(match[1].trim());
      }

      // Render each mermaid block → SVG → PNG base64
      toast.loading(`Rendering ${diagramBlocks.length} diagram(s)...`, { id: 'pdf-export' });
      const diagramImages = [];
      const diagramSvgs = [];
      for (let i = 0; i < diagramBlocks.length; i++) {
        try {
          const uid = `pdf-diag-${i}-${Date.now()}`;
          const { svg } = await mermaid.render(uid, diagramBlocks[i]);
          diagramSvgs.push(svg);
          const png = await svgToPngBase64(svg, 900, 540);
          if (png) diagramImages.push(png);
        } catch (e) {
          console.warn('Diagram render failed:', e?.message || e);
        }
      }

      toast.loading('Building PDF...', { id: 'pdf-export' });

      const now = new Date();
      const timestamp = now.toLocaleString();
      const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      // Build diagram images HTML
      const diagramImagesHtml = diagramImages.length > 0
        ? diagramImages.map((src, i) => `
            <div style="margin-bottom:32px;border-radius:12px;overflow:hidden;border:1px solid #00f5ff22;page-break-inside:avoid;">
              <div style="background:#00f5ff0a;padding:10px 16px;border-bottom:1px solid #00f5ff18;font-size:11px;color:#00f5ff80;font-family:monospace;letter-spacing:2px;text-transform:uppercase;">
                📐 Diagram ${i + 1} of ${diagramImages.length}
              </div>
              <img src="${src}" style="width:100%;display:block;background:#0a0e1a;" alt="Architecture Diagram ${i + 1}" />
            </div>
          `).join('')
        : '<p style="color:#ffffff30;font-style:italic;font-family:monospace;">No rendered diagrams found — run Diagram analysis first.</p>';

      // Build non-diagram sections (raw text only, diagram section gets images)
      const buildSection = (id, title, icon, color) => {
        if (!exportResults[id]?.trim()) return '';
        if (id === 'diagram') {
          // For diagram section: images + raw Mermaid source collapsed
          const textWithoutCode = exportResults[id]
            .replace(/```mermaid[\s\S]*?```/g, '')
            .trim();
          return `
            <div style="page-break-before:always;padding:48px 0 32px;">
              <div style="display:flex;align-items:center;gap:14px;margin-bottom:28px;padding-bottom:18px;border-bottom:2px solid ${color}44;">
                <span style="font-size:28px;">${icon}</span>
                <h2 style="margin:0;font-size:22px;font-weight:900;color:${color};letter-spacing:1px;font-family:monospace;">${title}</h2>
              </div>
              <div id="__codeoracle_diagrams_container">
                ${diagramImagesHtml}
              </div>
              ${textWithoutCode ? `<div style="margin-top:24px;font-size:12px;line-height:1.8;color:#c8d8e880;white-space:pre-wrap;word-wrap:break-word;">${escapeHtml(textWithoutCode)}</div>` : ''}
            </div>
          `;
        }
        return `
          <div style="page-break-before:always;padding:48px 0 32px;">
            <div style="display:flex;align-items:center;gap:14px;margin-bottom:28px;padding-bottom:18px;border-bottom:2px solid ${color}44;">
              <span style="font-size:28px;">${icon}</span>
              <h2 style="margin:0;font-size:22px;font-weight:900;color:${color};letter-spacing:1px;font-family:monospace;">${title}</h2>
            </div>
            <div style="font-size:13px;line-height:1.9;color:#c8d8e8;white-space:pre-wrap;word-wrap:break-word;">${escapeHtml(results[id])}</div>
          </div>
        `;
      };

      const sectionsHtml = [
        buildSection('analyze', '1. Code Analysis Report', '🔍', '#00f5ff'),
        buildSection('diagram', '2. Architecture Diagrams', '🏛️', '#9b59ff'),
        buildSection('optimize', '3. Optimization Roadmap', '🚀', '#ff6b2b'),
        buildSection('fix', '4. Bug Detection & Fixes', '🔧', '#00ff88'),
      ].join('');

      const el = document.createElement('div');
      // place element visibly near top-left (absolute) so html2canvas reliably captures it
      el.style.cssText = 'width:794px;font-family:"Courier New",monospace;background:#0a0e1a;color:#c8d8e8;position:absolute;left:20px;top:20px;transform:none;z-index:99999;opacity:1;pointer-events:auto;';
      el.innerHTML = `
        <!-- COVER PAGE -->
        <div style="min-height:1050px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;background:linear-gradient(135deg,#020308,#060c1a);padding:80px 60px;">
          <div style="width:80px;height:80px;border-radius:20px;background:rgba(0,245,255,0.08);border:2px solid rgba(0,245,255,0.3);display:flex;align-items:center;justify-content:center;margin-bottom:32px;font-size:38px;">⚡</div>
          <div style="font-size:11px;letter-spacing:8px;color:rgba(0,245,255,0.5);margin-bottom:16px;font-family:monospace;text-transform:uppercase;">CodeOracle Intelligence Platform</div>
          <h1 style="font-size:44px;font-weight:900;color:#ffffff;margin:0 0 8px;letter-spacing:2px;font-family:monospace;">CODE ANALYSIS</h1>
          <h1 style="font-size:44px;font-weight:900;color:#00f5ff;margin:0 0 40px;letter-spacing:2px;font-family:monospace;">PORTFOLIO</h1>
          <div style="width:200px;height:2px;background:linear-gradient(90deg,transparent,#00f5ff,transparent);margin-bottom:40px;"></div>
          <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px 48px;margin-bottom:36px;min-width:380px;">
            <table style="width:100%;border-collapse:collapse;text-align:left;">
              <tr><td style="padding:8px 0;color:rgba(255,255,255,0.3);font-size:11px;letter-spacing:3px;width:120px;">FILE</td><td style="padding:8px 0;color:#00f5ff;font-weight:700;">${activeFile?.name || 'workspace'}</td></tr>
              <tr><td style="padding:8px 0;color:rgba(255,255,255,0.3);font-size:11px;letter-spacing:3px;">LANGUAGE</td><td style="padding:8px 0;color:#9b59ff;font-weight:700;">${(activeFile?.language || 'javascript').toUpperCase()}</td></tr>
              <tr><td style="padding:8px 0;color:rgba(255,255,255,0.3);font-size:11px;letter-spacing:3px;">DATE</td><td style="padding:8px 0;color:#00ff88;font-weight:700;">${dateStr}</td></tr>
              <tr><td style="padding:8px 0;color:rgba(255,255,255,0.3);font-size:11px;letter-spacing:3px;">DIAGRAMS</td><td style="padding:8px 0;color:#9b59ff;font-weight:700;">${diagramImages.length} rendered</td></tr>
              <tr><td style="padding:8px 0;color:rgba(255,255,255,0.3);font-size:11px;letter-spacing:3px;">SECTIONS</td><td style="padding:8px 0;color:#ff6b2b;font-weight:700;">${Object.values(results).filter(v => v?.trim()).length} / 4</td></tr>
            </table>
          </div>
          <div style="font-size:11px;color:rgba(255,255,255,0.15);letter-spacing:4px;font-family:monospace;">SECURE · ENCRYPTED · VERIFIED</div>
        </div>
        <!-- SECTIONS -->
        <div style="padding:0 56px 60px;">${sectionsHtml}</div>
        <!-- FOOTER -->
        <div style="padding:32px 56px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
          <p style="color:rgba(255,255,255,0.15);font-size:11px;font-family:monospace;letter-spacing:2px;">Generated by CodeOracle v4.0 · ${timestamp} · Powered by AI</p>
        </div>
      `;

      document.body.appendChild(el);

      // Diagnostic logs to help debug blank PDF
      console.log('PDF Export: diagramBlocks count=', diagramBlocks.length);
      console.log('PDF Export: svg count=', diagramSvgs.length, 'png count=', diagramImages.length);

      // If no PNGs were produced but we have SVGs, embed raw SVG markup into the sections
      if (diagramImages.length === 0 && diagramSvgs.length > 0) {
        const container = el.querySelector('#__codeoracle_diagrams_container');
        if (container) {
          container.innerHTML = diagramSvgs.map((s, i) => `
            <div style="margin-bottom:32px;border-radius:12px;overflow:hidden;border:1px solid #00f5ff22;page-break-inside:avoid;">
              <div style="background:#00f5ff0a;padding:10px 16px;border-bottom:1px solid #00f5ff18;font-size:11px;color:#00f5ff80;font-family:monospace;letter-spacing:2px;text-transform:uppercase;">📐 Diagram ${i + 1} of ${diagramSvgs.length}</div>
              ${s}
            </div>
          `).join('');
        }
      }

      // wait for any images (diagram PNGs) to finish loading into the DOM
      const imgs = el.querySelectorAll('img');
      if (imgs && imgs.length) {
        await Promise.all(Array.from(imgs).map(img => new Promise(resolve => {
          if (img.complete) return resolve();
          img.onload = img.onerror = () => resolve();
        })));
        // brief pause to let browser stabilize layout
        await new Promise(r => setTimeout(r, 150));
      }

      // Log innerHTML snapshot for debugging (trimmed)
      try { console.log('PDF export DOM snapshot:', el.innerHTML.slice(0, 4000)); } catch (e) { /* ignore */ }

      // Wait for any webfonts to load and let layout stabilize
      try { if (document.fonts && typeof document.fonts.ready !== 'undefined') await document.fonts.ready; } catch (e) { /* ignore */ }
      await new Promise(r => setTimeout(r, 500));

      // Render the DOM to canvas using html2canvas, then build a multi-page PDF via jsPDF
      try {
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: null, logging: false, allowTaint: true, willReadFrequently: true });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Calculate sizes in px for slicing
        const pxFullWidth = canvas.width;
        const pxPerMm = pxFullWidth / pageWidth;
        const sliceHeightPx = Math.floor(pageHeight * pxPerMm);

        let y = 0;
        let pageCount = 0;
        while (y < canvas.height) {
          const sliceHeight = Math.min(sliceHeightPx, canvas.height - y);
          const tmpCanvas = document.createElement('canvas');
          tmpCanvas.width = canvas.width;
          tmpCanvas.height = sliceHeight;
          const ctx = tmpCanvas.getContext('2d');
          ctx.drawImage(canvas, 0, y, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
          const sliceData = tmpCanvas.toDataURL('image/jpeg', 0.95);

          const imgHeightMm = sliceHeight / pxPerMm;
          if (pageCount > 0) pdf.addPage();
          pdf.addImage(sliceData, 'JPEG', 0, 0, pageWidth, imgHeightMm);

          y += sliceHeight;
          pageCount++;
        }

        const filename = `CodeOracle_${activeFile?.name?.replace(/\.[^.]+$/, '') || 'analysis'}_${now.toISOString().slice(0, 10)}.pdf`;
        pdf.save(filename);
      } catch (err) {
        // Fallback: try html2pdf as a last resort
        try {
          const pdfPromise = html2pdf()
            .set({
              margin: [8, 8, 8, 8],
              filename: `CodeOracle_${activeFile?.name?.replace(/\.[^.]+$/, '') || 'analysis'}_${now.toISOString().slice(0, 10)}.pdf`,
              image: { type: 'jpeg', quality: 0.95 },
              html2canvas: { scale: 2, useCORS: true, backgroundColor: null, logging: false, allowTaint: true },
              jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
              pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
            })
            .from(el)
            .save();

          await Promise.race([
            pdfPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('PDF generation timed out')), 30000)),
          ]);
        } catch (err2) {
          throw err2;
        }
      }

      document.body.removeChild(el);
      toast.success(`PDF saved with ${diagramImages.length} diagram(s)!`, { id: 'pdf-export' });
    } catch (err) {
      toast.error('PDF export failed: ' + err.message, { id: 'pdf-export' });
      console.error('[PDF Export]', err);
    }
  };

  // Helper to escape HTML in analysis text
  const escapeHtml = (str) => str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  /* ── Tab colors ── */
  const TAB_COLORS = { analyze: '#00f5ff', diagram: '#9b59ff', optimize: '#ff6b2b', fix: '#00ff88' };

  return (
    <>
      <CursorTrail />

      {/* ── SPLASH ── */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={() => { setShowSplash(false); setCurrentPage('landing'); }} />
        )}
      </AnimatePresence>

      {/* ── PAGE ROUTER ── */}
      {!showSplash && (
        <AnimatePresence mode="wait">

          {currentPage === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <LandingPage onNavigate={navigate} />
            </motion.div>
          )}

          {currentPage === 'login' && (
            <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <LoginPage
                onBack={() => navigate('landing')}
                onSuccess={() => { setIsAuthenticated(true); navigate('dashboard'); }}
              />
            </motion.div>
          )}

          {currentPage === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <AnalyticsPage onBack={() => navigate('landing')} onNavigate={navigate} />
            </motion.div>
          )}

          {currentPage === 'security' && (
            <motion.div key="security" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <SecurityPage onBack={() => navigate('landing')} onNavigate={navigate} />
            </motion.div>
          )}

          {currentPage === 'neural' && (
            <motion.div key="neural" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <NeuralAnalysisPage onBack={() => navigate('landing')} />
            </motion.div>
          )}

          {currentPage === 'secure' && (
            <motion.div key="secure" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <SecureVaultPage onBack={() => navigate('landing')} />
            </motion.div>
          )}

          {currentPage === 'quantum' && (
            <motion.div key="quantum" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <QuantumFlowPage onBack={() => navigate('landing')} />
            </motion.div>
          )}

          {currentPage === 'data' && (
            <motion.div key="data" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <DataMatricesPage onBack={() => navigate('landing')} />
            </motion.div>
          )}

          {currentPage === 'dashboard' && (
            <div
              className="flex h-screen overflow-hidden relative"
              style={{ background: '#020308', color: 'rgba(220,230,255,0.88)', fontFamily: 'Outfit, sans-serif' }}
            >
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: 'rgba(6,10,20,0.95)',
                    backdropFilter: 'blur(40px)',
                    border: '1px solid rgba(0,245,255,0.15)',
                    color: '#e2e8ff',
                    borderRadius: '1rem',
                  },
                }}
              />

              {/* ── Background layer ── */}
              <FloatingParticles />

              {/* ═══════════════════════════════════════
              SIDEBAR
          ═══════════════════════════════════════ */}
              <motion.aside
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-72 glass-sidebar flex flex-col z-30 relative"
              >
                {/* Logo */}
                <div className="p-8 pb-6 flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 180, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0,245,255,0.12), rgba(155,89,255,0.12))',
                      border: '1px solid rgba(0,245,255,0.2)',
                      boxShadow: '0 0 24px rgba(0,245,255,0.15)',
                    }}
                  >
                    <Activity size={22} style={{ color: '#00f5ff' }} />
                  </motion.div>
                  <div>
                    <h1 className="font-black text-2xl tracking-widest text-white" style={{ fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 20px rgba(0,245,255,0.4)' }}>
                      ORACLE
                    </h1>
                    <p className="text-xs font-black uppercase tracking-[0.4em]" style={{ color: '#9b59ff' }}>
                      Obsidian v4.0
                    </p>
                  </div>
                </div>

                {/* Files */}
                <div className="flex-1 overflow-hidden flex flex-col px-5">
                  <div className="flex items-center justify-between mb-5 px-1">
                    <span className="text-xs font-black uppercase tracking-[0.4em]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      Asset Explorer
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.3, rotate: 90 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setFiles([...files, { id: Date.now().toString(), name: 'asset.js', content: '', language: 'javascript' }])}
                      style={{ color: '#00f5ff' }}
                    >
                      <Plus size={18} />
                    </motion.button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scroll">
                    {files.map((f, i) => {
                      const isActive = activeFileId === f.id;
                      return (
                        <motion.div
                          key={f.id}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          whileHover={{ x: 4 }}
                          onClick={() => setActiveFileId(f.id)}
                          onDoubleClick={e => startRenaming(f.id, f.name, e)}
                          className="flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all"
                          style={{
                            background: isActive ? 'rgba(0,245,255,0.07)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${isActive ? 'rgba(0,245,255,0.2)' : 'rgba(255,255,255,0.04)'}`,
                            boxShadow: isActive ? '0 0 20px rgba(0,245,255,0.08)' : 'none',
                          }}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <Hash size={14} style={{ color: isActive ? '#00f5ff' : 'rgba(255,255,255,0.2)' }} />
                            {editingFileId === f.id ? (
                              <input
                                autoFocus
                                className="bg-transparent border-b text-sm font-black text-white w-full outline-none"
                                style={{ borderColor: 'rgba(0,245,255,0.4)', color: '#fff' }}
                                value={tempFileName}
                                onChange={e => setTempFileName(e.target.value)}
                                onBlur={() => saveFileName(f.id)}
                                onKeyDown={e => e.key === 'Enter' && saveFileName(f.id)}
                              />
                            ) : (
                              <span className="text-sm font-black tracking-tight" style={{ color: isActive ? '#e2e8ff' : 'rgba(255,255,255,0.4)' }}>
                                {f.name}
                              </span>
                            )}
                          </div>
                          {isActive && editingFileId !== f.id && (
                            <motion.button
                              whileHover={{ scale: 1.2 }}
                              onClick={e => startRenaming(f.id, f.name, e)}
                              style={{ color: 'rgba(0,245,255,0.4)' }}
                            >
                              <Edit3 size={12} />
                            </motion.button>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* History */}
                  <div className="mt-6 border-t pt-5 pb-4" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <div className="flex items-center gap-2 mb-4 px-1">
                      <History size={13} style={{ color: 'rgba(155,89,255,0.5)' }} />
                      <span className="text-xs font-black uppercase tracking-[0.4em]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        Strategic Vault
                      </span>
                    </div>
                    <div className="space-y-2">
                      {history.slice(0, 5).map(h => (
                        <motion.div
                          key={h.id}
                          whileHover={{ x: 4 }}
                          onClick={() => restoreHistory(h)}
                          className="flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer group transition-all"
                          style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: TAB_COLORS[h.type] || '#00f5ff' }} />
                            <span className="text-xs font-black uppercase tracking-tight" style={{ color: 'rgba(255,255,255,0.45)' }}>
                              {h.type}
                            </span>
                          </div>
                          <Trash2
                            size={12}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: '#ff3355' }}
                            onClick={e => deleteHistoryItem(h.id, e)}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Settings + Logout */}
                <div className="p-5 border-t flex flex-col gap-2" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(155,89,255,0.2)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowSettings(true)}
                    className="w-full flex items-center justify-between px-5 py-5 rounded-xl transition-all group"
                    style={{
                      background: 'rgba(155,89,255,0.06)',
                      border: '1px solid rgba(155,89,255,0.15)',
                    }}
                  >
                    <Settings size={16} className="group-hover:rotate-90 transition-transform duration-500" style={{ color: '#9b59ff' }} />
                    <span className="text-sm font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>Core Config</span>
                    <ChevronRight size={14} style={{ color: 'rgba(155,89,255,0.5)' }} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(255,51,85,0.25)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-5 py-5 rounded-xl transition-all group"
                    style={{
                      background: 'rgba(255,51,85,0.05)',
                      border: '1px solid rgba(255,51,85,0.15)',
                    }}
                  >
                    <LogOut size={16} style={{ color: '#ff3355' }} />
                    <span className="text-sm font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>Log Out</span>
                    <ChevronRight size={14} style={{ color: 'rgba(255,51,85,0.4)' }} />
                  </motion.button>
                </div>
              </motion.aside>

              {/* ═══════════════════════════════════════
              MAIN CONTENT
          ═══════════════════════════════════════ */}
              <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">

                {/* ── HEADER / NAV ── */}
                <motion.header
                  initial={{ y: -40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-20 flex items-center justify-between px-10 z-20 relative flex-shrink-0 glass-panel-strong"
                >
                  {/* Left: title */}
                  <div className="flex items-center gap-5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0,245,255,0.1), rgba(155,89,255,0.1))',
                        border: '1px solid rgba(0,245,255,0.18)',
                        boxShadow: '0 0 30px rgba(0,245,255,0.1)',
                      }}
                    >
                      <span className="text-lg font-black" style={{ color: '#00f5ff' }}>⌐</span>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] font-black" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        Command Interface
                      </p>
                      <h1 className="text-lg font-black tracking-widest text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                        CODEORACLE PRIME
                      </h1>
                    </div>
                  </div>

                  {/* Right: status + active file + export */}
                  <div className="flex items-center gap-3">
                    {/* DB status */}
                    <div
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.3em]"
                      style={{
                        background: isDbConnected ? 'rgba(0,255,136,0.06)' : 'rgba(255,51,85,0.06)',
                        border: `1px solid ${isDbConnected ? 'rgba(0,255,136,0.2)' : 'rgba(255,51,85,0.2)'}`,
                        color: isDbConnected ? '#00ff88' : '#ff3355',
                      }}
                    >
                      <div className="w-2 h-2 rounded-full animate-pulse-soft"
                        style={{ background: isDbConnected ? '#00ff88' : '#ff3355' }} />
                      {isDbConnected ? 'Bridge Active' : 'Offline'}
                    </div>

                    {/* Active file badge */}
                    <div
                      className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs uppercase tracking-[0.25em]"
                      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <span style={{ color: 'rgba(255,255,255,0.3)' }}>Asset</span>
                      <span className="font-black" style={{ color: '#00f5ff' }}>{activeFile?.name}</span>
                    </div>

                    {/* Export */}
                    <motion.button
                      whileHover={{ scale: 1.04, boxShadow: '0 0 28px rgba(255,107,43,0.3)' }}
                      whileTap={{ scale: 0.96 }}
                      onClick={exportPDF}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-[0.25em] transition-all"
                      style={{
                        background: 'rgba(255,107,43,0.08)',
                        border: '1px solid rgba(255,107,43,0.25)',
                        color: '#ff6b2b',
                      }}
                    >
                      <Download size={15} /> Export PDF
                    </motion.button>
                  </div>
                </motion.header>

                {/* ── WORKSPACE ── */}
                <div className="flex-1 flex p-6 gap-5 overflow-hidden relative">
                  {/* Editor column */}
                  <div className="flex-[1.35] flex flex-col gap-4 relative">
                    {/* Code editor card */}
                    <div className="flex-1 glass-card rounded-3xl relative overflow-hidden holo-border" style={{ minHeight: 0 }}>
                      <div className="scanning-line" />
                      <CodeEditor
                        code={activeFile?.content || ''}
                        setCode={handleCodeChange}
                        language={activeFile?.language || 'javascript'}
                        handlePaste={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            if (text) {
                              handleCodeChange(text);
                              toast.success('Code pasted & language detected!');
                            }
                          } catch { toast.error('Clipboard access denied.'); }
                        }}
                        theme="obsidian"
                      />
                    </div>

                    {/* Action buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="h-[88px] glass-card rounded-2xl flex items-center px-5 gap-3"
                      style={{ flexShrink: 0 }}
                    >
                      <ActionBtn icon={<Search />} label="Analyze" active={streaming.analyze} color="cyan" onClick={() => runProjectAnalysis('analyze')} />
                      <ActionBtn icon={<Layout />} label="Diagram" active={streaming.diagram} color="purple" onClick={() => runProjectAnalysis('diagram')} />
                      <ActionBtn icon={<Sparkles />} label="Optimize" active={streaming.optimize} color="warm" onClick={() => runProjectAnalysis('optimize')} />
                      <ActionBtn icon={<Wrench />} label="Heal" active={streaming.fix} color="emerald" onClick={() => runProjectAnalysis('fix')} />
                    </motion.div>
                  </div>

                  {/* Analysis panel */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 }}
                      className="flex-1 glass-card rounded-3xl flex flex-col overflow-hidden glow-border"
                      style={{ minHeight: 0 }}
                    >
                      {/* Tab bar */}
                      <div
                        className="h-16 border-b flex items-center px-6 gap-6 flex-shrink-0"
                        style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.015)' }}
                      >
                        {['analyze', 'diagram', 'optimize', 'fix'].map(tab => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="h-full text-xs font-black uppercase tracking-[0.4em] border-b-2 transition-all px-1"
                            style={{
                              borderColor: activeTab === tab ? TAB_COLORS[tab] : 'transparent',
                              color: activeTab === tab ? TAB_COLORS[tab] : 'rgba(255,255,255,0.5)',
                              textShadow: activeTab === tab ? `0 0 12px ${TAB_COLORS[tab]}` : 'none',
                            }}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>

                      {/* Content */}
                      <div className="flex-1 overflow-hidden p-4" style={{ minHeight: 0 }}>
                        <AnalysisPanel
                          content={results[activeTab]}
                          streaming={streaming[activeTab]}
                          onDiagramClick={setExpandedDiagram}
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* ── METRICS ROW ── */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 xl:grid-cols-4 gap-4 px-6 pb-6 flex-shrink-0"
                >
                  {analyticsMetrics.map((card, i) => <MetricCard key={card.label} card={card} index={i} />)}
                </motion.div>
              </main>

              {/* ═══════════════════════════════════════
              EXPANDED DIAGRAM MODAL
          ═══════════════════════════════════════ */}
              <AnimatePresence>
                {expandedDiagram && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-16 cursor-zoom-out"
                    style={{ background: 'rgba(2,3,8,0.97)', backdropFilter: 'blur(40px)' }}
                    onClick={() => setExpandedDiagram(null)}
                  >
                    <motion.div
                      initial={{ scale: 0.6, rotateY: 90 }}
                      animate={{ scale: 1, rotateY: 0 }}
                      exit={{ scale: 0.6, rotateY: -90 }}
                      transition={{ type: 'spring', damping: 22 }}
                      className="w-full h-full max-w-6xl max-h-[78vh] relative"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="absolute -top-12 right-0 flex items-center gap-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: '#00f5ff' }}>
                          <div className="w-2 h-2 rounded-full animate-ping" style={{ background: '#00f5ff' }} />
                          Neural Projection Active
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1, background: '#ff3355' }}
                          onClick={() => setExpandedDiagram(null)}
                          className="p-2.5 rounded-full transition-all"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                          <X size={20} className="text-white" />
                        </motion.button>
                      </div>
                      <div
                        className="w-full h-full glass-card rounded-3xl p-16 overflow-hidden flex items-center justify-center"
                        style={{ border: '1px solid rgba(0,245,255,0.12)', boxShadow: '0 0 80px rgba(0,245,255,0.1)' }}
                      >
                        <MermaidRenderer chart={expandedDiagram} id="expanded-view" expanded />
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ═══════════════════════════════════════
              SETTINGS MODAL
          ═══════════════════════════════════════ */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-10"
                    style={{ background: 'rgba(2,3,8,0.96)', backdropFilter: 'blur(60px)' }}
                  >
                    <motion.div
                      initial={{ scale: 0.85, y: 30 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.85, y: 30 }}
                      className="glass-card rounded-3xl p-14 max-w-lg w-full relative text-center holo-border"
                      style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 0 80px rgba(155,89,255,0.15)' }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.1, color: '#ff3355' }}
                        onClick={() => setShowSettings(false)}
                        className="absolute top-8 right-8 transition-colors"
                        style={{ color: 'rgba(255,255,255,0.3)' }}
                      >
                        <X size={28} />
                      </motion.button>

                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                        style={{
                          background: 'linear-gradient(135deg, rgba(155,89,255,0.12), rgba(0,245,255,0.08))',
                          border: '1px solid rgba(155,89,255,0.25)',
                          boxShadow: '0 0 30px rgba(155,89,255,0.2)',
                        }}
                      >
                        <Settings size={28} className="animate-spin-slow" style={{ color: '#9b59ff' }} />
                      </div>

                      <h2 className="text-3xl font-black tracking-widest mb-2 text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                        CORE CONFIG
                      </h2>
                      <p className="text-[10px] uppercase tracking-[0.45em] font-black mb-10" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        Intelligence Synchronization
                      </p>

                      <div className="text-left space-y-6">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-[0.4em] mb-3 ml-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                            Neural Access Key
                          </label>
                          <input
                            type="password"
                            value={apiKey}
                            onChange={e => { setApiKey(e.target.value); core.getModule('ai').setApiKey(e.target.value); }}
                            className="w-full rounded-xl px-5 py-4 text-sm font-mono outline-none transition-all"
                            style={{
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(155,89,255,0.2)',
                              color: '#9b59ff',
                            }}
                            placeholder="Enter vault cipher…"
                            onFocus={e => e.target.style.borderColor = 'rgba(155,89,255,0.5)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(155,89,255,0.2)'}
                          />
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(155,89,255,0.4)' }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setShowSettings(false)}
                          className="w-full py-5 rounded-xl font-black uppercase tracking-[0.4em] text-sm transition-all"
                          style={{
                            background: 'linear-gradient(135deg, #9b59ff, #cc44ff, #4488ff)',
                            color: '#fff',
                            boxShadow: '0 0 20px rgba(155,89,255,0.25)',
                          }}
                        >
                          Initialize Sync
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </AnimatePresence>
      )}
    </>
  );
}
