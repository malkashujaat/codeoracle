import { OracleFactory } from '../factory/index.js';
import { ComponentNode } from '../composite/index.js';
import { buildAnalysisChain } from '../chain/index.js';

export class CodeOracleCore {
    static instance = null;
    static getInstance() {
        if (!this.instance) {
            this.instance = new CodeOracleCore();
        }
        return this.instance;
    }

    constructor() {
        if (CodeOracleCore.instance) {
            return CodeOracleCore.instance;
        }

        this.modules = {};
        this.adapter = OracleFactory.createModule('adapter');
        this._initModules();
        this.requestChain = buildAnalysisChain();
        this.uiComposite = this._buildComponentTree();
        CodeOracleCore.instance = this;
    }

    // ── Private init ──────────────────────────────────────────
    _initModules() {
        this.modules.ai = OracleFactory.createModule('ai');
    }

    _buildComponentTree() {
        const root = new ComponentNode('Dashboard');
        const sidebar = new ComponentNode('Sidebar');
        const main = new ComponentNode('MainPanel');
        const metrics = new ComponentNode('AnalyticsMetrics');

        metrics
            .add(new ComponentNode('Neural Throughput', { value: '98.4%', meta: 'Realtime prediction fidelity', accentClass: 'text-cyan-400' }))
            .add(new ComponentNode('Latency', { value: '12ms', meta: 'Stream response', accentClass: 'text-violet-400' }))
            .add(new ComponentNode('Signal Strength', { value: '4.9/5', meta: 'Secure connection band', accentClass: 'text-emerald-400' }))
            .add(new ComponentNode('Integrity', { value: 'A+', meta: 'Codebase trust score', accentClass: 'text-sky-400' }));

        root.add(sidebar).add(main).add(metrics);
        return root;
    }

    // ── Public API ────────────────────────────────────────────
    getModule(name) { return this.modules[name]; }
    getAdapter() { return this.adapter; }

    getDashboardMetrics() {
        const metrics = this.uiComposite.find('AnalyticsMetrics');
        return metrics
            ? metrics.children.map(c => ({ label: c.name, ...c.data }))
            : [];
    }

    async handleRequest(request) {
        return this.requestChain.handle(request);
    }
}

export default CodeOracleCore;
