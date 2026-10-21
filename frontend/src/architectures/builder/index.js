/**
 * ═══════════════════════════════════════════════════════════
 * 🏛️  BUILDER PATTERN
 * ═══════════════════════════════════════════════════════════
 * Intent:
 *   Separate the construction of a complex object from its
 *   representation so that the same construction process can
 *   create different representations.
 *
 * Used in CodeOracle:
 *   - ConfigBuilder → fluently constructs AI engine configuration
 *     objects with setModel(), setTemp(), merge(), build()
 * ═══════════════════════════════════════════════════════════
 */

export class ConfigBuilder {
    constructor() { this.reset(); }
    reset() { this.config = { model: 'claude-3-5-sonnet-latest', temp: 0.7 }; return this; }
    setModel(model) { this.config.model = model; return this; }
    setTemp(temp) { this.config.temp = temp; return this; }
    merge(config = {}) { this.config = { ...this.config, ...config }; return this; }
    build() { return { ...this.config }; }
}
export default ConfigBuilder;
