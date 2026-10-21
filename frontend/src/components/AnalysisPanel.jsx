import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Cpu, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import MermaidRenderer from './MermaidRenderer';

/**
 * AnalysisPanel – renders streaming markdown + mermaid diagram output
 * from the AI analysis engine.
 *
 * Props:
 *   content       – string, the accumulated AI output
 *   streaming     – boolean, whether AI is still streaming
 *   onDiagramClick – (chartString) => void, called when a diagram is clicked
 */
const AnalysisPanel = ({ content, streaming, onDiagramClick }) => {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom while streaming
  useEffect(() => {
    if (streaming && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [content, streaming]);

  // ── Empty state ──────────────────────────────────────────────
  if (!content && !streaming) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-5 text-center px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: 'rgba(0,245,255,0.05)',
            border: '1px solid rgba(0,245,255,0.12)',
            boxShadow: '0 0 30px rgba(0,245,255,0.08)',
          }}
        >
          <Cpu size={28} style={{ color: 'rgba(0,245,255,0.4)' }} />
        </motion.div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] mb-2"
            style={{ color: 'rgba(255,255,255,0.2)' }}>
            Awaiting Input
          </p>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.15)' }}>
            Select an action above to begin analysis
          </p>
        </div>
      </div>
    );
  }

  // ── Streaming spinner ────────────────────────────────────────
  if (streaming && !content) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 size={28} style={{ color: '#00f5ff' }} />
        </motion.div>
      </div>
    );
  }

  // ── Parse and render content ──────────────────────────────────
  // Split content into segments: mermaid code blocks vs regular markdown
  const segments = [];
  // match fenced mermaid blocks robustly (handles CRLF and optional whitespace)
  const mermaidRegex = /```mermaid\s*([\s\S]*?)```/gi;
  let lastIndex = 0;
  let match;

  while ((match = mermaidRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'markdown', text: content.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'mermaid', chart: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    segments.push({ type: 'markdown', text: content.slice(lastIndex) });
  }

  return (
    <div className="h-full overflow-y-auto custom-scroll pr-2">
      <div className="space-y-4 pb-4">
        {segments.map((seg, i) =>
          seg.type === 'mermaid' ? (
            <MermaidRenderer
              key={i}
              chart={seg.chart}
              id={`analysis-${i}`}
              onClick={onDiagramClick}
            />
          ) : (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="prose prose-invert prose-sm max-w-none"
              style={{
                color: 'rgba(220,230,255,0.82)',
                lineHeight: '1.75',
                fontSize: '0.825rem',
              }}
            >
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-lg font-black tracking-wider text-white mb-3 mt-5 first:mt-0"
                      style={{ fontFamily: 'Orbitron, sans-serif', color: '#00f5ff' }}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base font-black tracking-wider mb-2 mt-4"
                      style={{ color: '#9b59ff' }}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-black tracking-wide mb-2 mt-3"
                      style={{ color: '#00ff88' }}>
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-3 leading-relaxed" style={{ color: 'rgba(220,230,255,0.75)' }}>
                      {children}
                    </p>
                  ),
                  code: ({ inline, children }) =>
                    inline ? (
                      <code
                        className="px-1.5 py-0.5 rounded text-[11px] font-mono"
                        style={{
                          background: 'rgba(0,245,255,0.08)',
                          border: '1px solid rgba(0,245,255,0.15)',
                          color: '#00f5ff',
                        }}
                      >
                        {children}
                      </code>
                    ) : (
                      <code className="block">{children}</code>
                    ),
                  pre: ({ children }) => (
                    <pre
                      className="rounded-xl p-4 overflow-x-auto text-[11px] font-mono leading-relaxed mb-4"
                      style={{
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(0,245,255,0.1)',
                        color: 'rgba(0,245,255,0.85)',
                      }}
                    >
                      {children}
                    </pre>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-1.5 mb-3 ml-4 list-none">{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li className="flex items-start gap-2 text-xs" style={{ color: 'rgba(220,230,255,0.7)' }}>
                      <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                        style={{ background: '#00f5ff' }} />
                      <span>{children}</span>
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-black" style={{ color: '#fff' }}>{children}</strong>
                  ),
                  hr: () => (
                    <div className="my-4 h-px"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.2), transparent)' }} />
                  ),
                }}
              >
                {seg.text}
              </ReactMarkdown>
            </motion.div>
          )
        )}

        {/* Streaming cursor */}
        {streaming && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-2 h-4 ml-1 rounded-sm"
            style={{ background: '#00f5ff', verticalAlign: 'middle' }}
          />
        )}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

export default AnalysisPanel;
