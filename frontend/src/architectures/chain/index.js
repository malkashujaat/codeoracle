import { apiUrl, jsonHeaders } from '../../api';

export class RequestHandler {
    setNext(handler) { this.next = handler; return handler; }
    async handle(request) { if (this.next) return this.next.handle(request); return request; }
}

export class ValidationHandler extends RequestHandler {
    async handle(request) {
        if (!request.activeFile || !request.activeFile.content.trim()) throw new Error('No active file content available for analysis.');
        return super.handle(request);
    }
}

export class LoggingHandler extends RequestHandler {
    async handle(request) { console.debug('[RequestChain] Processing', request.action, request.activeFile?.name); return super.handle(request); }
}

export class AnalysisHandler extends RequestHandler {
    async handle(request) {
        const { action, activeFile, files, onChunk, aiService } = request;
        const codeContext = files.map(f => `### File: ${f.name}\n\`\`\`${f.language || 'javascript'}\n${f.content}\n\`\`\``).join('\n\n');
        const systemPrompts = {
            analyze: `You are a senior software architect and SDA (Software Design & Architecture) expert.\nAnalyze the provided codebase and produce a comprehensive report covering:...`,
            diagram: `You are an expert software architect specializing in UML and SDA diagrams. Generate comprehensive Mermaid diagrams...`,
            optimize: `You are a performance engineering expert and SDA architect.`,
            fix: `You are an expert debugger, code reviewer, and SDA architect.`
        };
        request.output = '';
        await aiService.call(systemPrompts[action] || systemPrompts.analyze, `Analyze this codebase:\n\n${codeContext}\n\nActive file: ${activeFile.name}`, (chunk) => { request.output += chunk; if (typeof onChunk === 'function') onChunk(chunk); });
        return super.handle(request);
    }
}

export class PersistenceHandler extends RequestHandler {
    async handle(request) {
        const { activeFile, action, output, isDbConnected, adapter } = request;
        request.historyItem = { id: Date.now(), date: new Date().toLocaleTimeString(), type: action, snippet: activeFile.name, content: output };
        if (isDbConnected) fetch(apiUrl('/api/analysis'), { method: 'POST', headers: jsonHeaders, body: JSON.stringify(adapter.adaptAnalysisRecord(activeFile.id, action, output)) }).catch(() => { });
        return super.handle(request);
    }
}

export function buildAnalysisChain() {
    const validation = new ValidationHandler();
    const logging = new LoggingHandler();
    const analysis = new AnalysisHandler();
    const persistence = new PersistenceHandler();

    validation.setNext(logging).setNext(analysis).setNext(persistence);
    return validation;
}

export default buildAnalysisChain;
