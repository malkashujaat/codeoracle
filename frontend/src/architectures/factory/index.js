/**
 * ═══════════════════════════════════════════════════════════
 * 🏛️  FACTORY PATTERN
 * ═══════════════════════════════════════════════════════════
 * Intent:
 *   Define an interface for creating objects, but let subclasses
 *   (or a switch) decide which class to instantiate. Decouples
 *   object creation from usage.
 *
 * Used in CodeOracle:
 *   - OracleFactory.createModule('ai' | 'adapter')
 *       → creates AIService or DataAdapter without exposing constructors
 *   - DiagramFactory.createDiagram('class' | 'sequence')
 *       → creates diagram objects without coupling to concrete types
 * ═══════════════════════════════════════════════════════════
 */

import { AIService } from '../ai/index.js';
import { DataAdapter } from '../adapter/index.js';

export class OracleFactory {
    static createModule(type) {
        switch (type) {
            case 'ai': return new AIService();
            case 'adapter': return new DataAdapter();
            default: throw new Error(`[OracleFactory] Unknown module type: "${type}"`);
        }
    }
}

class Diagram { render() { throw new Error('render() must be implemented by subclass'); } }
class ClassDiagram extends Diagram { render() { return 'Rendering UML Class Diagram...'; } }
class SequenceDiagram extends Diagram { render() { return 'Rendering Interaction Sequence...'; } }

export class DiagramFactory { static createDiagram(type) { switch (type) { case 'class': return new ClassDiagram(); case 'sequence': return new SequenceDiagram(); default: throw new Error(`[DiagramFactory] Unknown diagram type: "${type}"`); } } }

export default OracleFactory;
