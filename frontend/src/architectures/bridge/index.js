/**
 * ═══════════════════════════════════════════════════════════
 * 🏛️  BRIDGE PATTERN
 * ═══════════════════════════════════════════════════════════
 * Intent:
 *   Decouple an abstraction from its implementation so that
 *   the two can vary independently. The "bridge" connects the
 *   high-level UI actions to the low-level core logic.
 *
 * Used in CodeOracle:
 *   - UIBridge → thin layer between React components (abstraction)
 *     and CodeOracleCore (implementation).
 *     Components call bridge.requestAnalysis(…) and never touch
 *     the chain of responsibility or AI service directly.
 * ═══════════════════════════════════════════════════════════
 */

export class UIBridge {
    constructor(core) { this.core = core; }
    async requestAnalysis(action, payload, onChunk) {
        const request = { action, files: payload.files, activeFile: payload.activeFile, isDbConnected: payload.isDbConnected, aiService: this.core.getModule('ai'), adapter: this.core.getAdapter(), onChunk };
        await this.core.handleRequest(request);
        return request;
    }
}

export default UIBridge;
