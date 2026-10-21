import { ConfigBuilder } from '../builder/index.js';
import { apiUrl, jsonHeaders } from '../../api';

function parseCode(code) {
    const lang = detectLanguage(code);
    if (lang === 'java') return parseJava(code);
    return parseJS(code);
}

function detectLanguage(code) {
    if (/public\s+(class|interface|enum)\s+\w+/.test(code)) return 'java';
    if (/def\s+\w+\s*\(/.test(code) && /import\s+\w+/.test(code)) return 'python';
    return 'js';
}

function parseJS(code) {
    const classes = [];
    // Match: class Foo [extends Bar] {
    const classRe = /class\s+(\w+)(?:\s+extends\s+(\w+))?\s*\{/g;
    let cm;
    while ((cm = classRe.exec(code)) !== null) {
        const name = cm[1];
        const parent = cm[2] || null;
        const start = cm.index;
        const body = extractBlock(code, start);

        // Extract fields: this.xxx = | static xxx = | #xxx        const fields = [];
        const fieldRe = /(?:this\.|static\s+|#)(\w+)\s*=/g;
        let fm;
        while ((fm = fieldRe.exec(body)) !== null) {
            const fname = fm[1];
            if (!['instance', 'constructor'].includes(fname)) {
                const isPrivate = body[fm.index] === '#' || /\bprivate\b/.test(body.slice(Math.max(0, fm.index - 10), fm.index));
                const isStatic  = /\bstatic\b/.test(body.slice(Math.max(0, fm.index - 20), fm.index));
                fields.push({ name: fname, visibility: isPrivate ? '-' : '+', isStatic });
            }
        }

        const methods = [];
        const methodRe = /(?:async\s+)?(?:static\s+)?(\w+)\s*\(([^)]*)\)\s*(?::\s*\w+)?\s*\{/g;
        let mm;
        const skip = new Set(['if','for','while','switch','catch','try','else','do','function']);
        while ((mm = methodRe.exec(body)) !== null) {
            const mname = mm[1];
            if (skip.has(mname) || mname === name) continue;
            const isAsync  = /async\s+/.test(body.slice(Math.max(0, mm.index - 10), mm.index + 10));
            const isStatic = /static\s+/.test(body.slice(Math.max(0, mm.index - 15), mm.index + 15));
            const params   = mm[2].trim();
            const ret      = isAsync ? 'Promise' : 'void';
            methods.push({ name: mname, params, ret, isStatic, visibility: '+' });
        }

        classes.push({ name, parent, fields: dedup(fields,'name'), methods: dedup(methods,'name') });
    }

    // Standalone functions
    const funcs = [];
    const funcRe = /(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)/g;
    let fr;
    while ((fr = funcRe.exec(code)) !== null) {
        funcs.push({ name: fr[1], params: fr[2].trim() });
    }

    // Imports
    const imports = [];
    const impRe = /import\s+.*?from\s+['"](.+?)['"]/g;
    let ir;
    while ((ir = impRe.exec(code)) !== null) imports.push(ir[1]);

    return { lang: 'js', classes, funcs, imports };
}

function parseJava(code) {
    const classes = [];
    // Match: [public] [abstract] class/interface/enum Foo [extends Bar] [implements Baz,Qux]
    const classRe = /(?:public\s+)?(?:abstract\s+)?(?:class|interface|enum)\s+(\w+)(?:\s+extends\s+(\w+))?(?:\s+implements\s+([\w,\s]+))?\s*\{/g;
    let cm;
    while ((cm = classRe.exec(code)) !== null) {
        const name = cm[1];
        const parent = cm[2] || null;
        const interfaces = cm[3] ? cm[3].split(',').map(s => s.trim()) : [];
        const body = extractBlock(code, cm.index);

        const fields = [];
        const fieldRe = /\b(private|public|protected)\s+(static\s+)?(\w+(?:<[\w<>, ?]+>)?)\s+(\w+)\s*[=;]/g;
        let ff;
        while ((ff = fieldRe.exec(body)) !== null) {
            fields.push({
                name: ff[4],
                type: ff[3],
                visibility: ff[1] === 'private' ? '-' : '+',
                isStatic: !!ff[2]
            });
        }

        const methods = [];
        const methodRe = /\b(public|private|protected)\s+(static\s+)?(\w+(?:<[\w<>, ?]+>)?)\s+(\w+)\s*\(([^)]*)\)/g;
        let mf;
        while ((mf = methodRe.exec(body)) !== null) {
            const mname = mf[4];
            if (mname === name) continue;
            methods.push({
                name: mname,
                params: mf[5].trim().replace(/\w+(?:<[\w<>, ?]+>)?\s+(\w+)/g, '$1'),
                ret: mf[3],
                visibility: mf[1] === 'private' ? '-' : '+',
                isStatic: !!mf[2]
            });
        }

        classes.push({ name, parent, interfaces, fields: dedup(fields,'name'), methods: dedup(methods,'name') });
    }

    // Imports
    const imports = [];
    const impRe = /import\s+([\w.]+);/g;
    let ir;
    while ((ir = impRe.exec(code)) !== null) imports.push(ir[1].split('.').pop());

    return { lang: 'java', classes, funcs: [], imports };
}

function extractBlock(code, startIdx) {
    let depth = 0, i = code.indexOf('{', startIdx);
    if (i === -1) return '';
    const start = i;
    while (i < code.length) {
        if (code[i] === '{') depth++;
        else if (code[i] === '}') { depth--; if (depth === 0) return code.slice(start, i + 1); }
        i++;
    }
    return code.slice(start);
}

function dedup(arr, key) {
    const seen = new Set();
    return arr.filter(x => { if (seen.has(x[key])) return false; seen.add(x[key]); return true; });
}

function buildClassDiagram(parsed) {
    if (!parsed.classes.length) return null;
    const lines = ['classDiagram', '    direction TB'];

    for (const cls of parsed.classes) {
        lines.push(`    class ${cls.name} {`);        for (const f of cls.fields.slice(0, 6)) {
            const s = f.isStatic ? '$' : '';
            lines.push(`        ${f.visibility}${f.name}${f.type ? ': ' + f.type : ''}${s}`);
        }
        for (const m of cls.methods.slice(0, 8)) {
            const s = m.isStatic ? '$' : '';
            const p = m.params.length > 30 ? m.params.slice(0, 28) + '..' : m.params;
            lines.push(`        ${m.visibility}${m.name}(${p}) ${m.ret || ''}${s}`);
        }
        lines.push('    }');
    }

    for (const cls of parsed.classes) {
        if (cls.parent) lines.push(`    ${cls.name} --|> ${cls.parent} : extends`);
        if (cls.interfaces) {
            for (const iface of cls.interfaces) {
                lines.push(`    ${cls.name} ..|> ${iface} : implements`);
            }
        }
    }

    const classNames = new Set(parsed.classes.map(c => c.name));
    for (const cls of parsed.classes) {
        for (const f of cls.fields) {
            if (f.type && classNames.has(f.type) && f.type !== cls.name) {
                lines.push(`    ${cls.name} --> ${f.type} : has`);
            }
        }
    }

    return lines.join('\n');
}

function buildFlowchart(parsed) {
    if (!parsed.classes.length && !parsed.funcs.length) return null;
    const lines = ['flowchart TD'];
    const classNames = parsed.classes.map(c => c.name);

    for (const cls of parsed.classes) {
        const label = cls.parent ? `${cls.name}\\n extends ${cls.parent}` : cls.name;
        lines.push(`    ${cls.name}["${label}"]`);
    }

    for (const fn of parsed.funcs.slice(0, 6)) {
        lines.push(`    ${fn.name}["${fn.name}()"]`);
    }

    for (const cls of parsed.classes) {
        if (cls.parent && classNames.includes(cls.parent)) {
            lines.push(`    ${cls.parent} --> ${cls.name}`);
        }
    }

    const seen = new Set();
    const classSet = new Set(classNames);
    for (const cls of parsed.classes) {
        for (const f of cls.fields) {
            if (f.type && classSet.has(f.type) && f.type !== cls.name) {
                const key = `${cls.name}-${f.type}`;
                if (!seen.has(key)) { seen.add(key); lines.push(`    ${cls.name} -->|"${f.name}"| ${f.type}`); }
            }
        }
    }

    return lines.join('\n');
}

function buildSequenceDiagram(parsed) {
    if (!parsed.classes.length) return null;
    const lines = ['sequenceDiagram', '    autonumber'];

    const participants = parsed.classes.slice(0, 5);
    for (const cls of participants) {
        lines.push(`    participant ${cls.name}`);
    }

    for (let i = 0; i < participants.length - 1; i++) {
        const from = participants[i];
        const to   = participants[i + 1];
        const method = to.methods[0];
        if (method) {
            lines.push(`    ${from.name}->>${to.name}: ${method.name}(${method.params || ''})`);
            lines.push(`    ${to.name}-->>${from.name}: return`);
        }
    }

    return lines.join('\n');
}

export class AIService {
    constructor() {
        this.apiKey = localStorage.getItem('oracle_api_key') || '';
        const stored = localStorage.getItem('oracle_engine_config');
        const defaultConfig = new ConfigBuilder().build();
        this.config = new ConfigBuilder()
            .merge(stored ? JSON.parse(stored) : defaultConfig)
            .build();
    }

    setConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        localStorage.setItem('oracle_engine_config', JSON.stringify(this.config));
    }

    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('oracle_api_key', key);
    }

    async call(systemPrompt, userMessage, onChunk) {

        if (!this.apiKey || this.apiKey.toLowerCase() === 'demo') {
            const lower = systemPrompt.toLowerCase();
            const isDiagram  = lower.includes('mermaid') || lower.includes('diagram');
            const isOptimize = lower.includes('optimize') || lower.includes('performance');
            const isFix      = lower.includes('fix') || lower.includes('bug') || lower.includes('debug');

            const codeMatch = userMessage.match(/```(?:\w+)?\n([\s\S]*?)```/);
            const rawCode   = codeMatch ? codeMatch[1] : userMessage;

            let report = '';

            if (isDiagram) {
                const parsed = parseCode(rawCode);
                const classDiag = buildClassDiagram(parsed);
                const flowDiag  = buildFlowchart(parsed);
                const seqDiag   = buildSequenceDiagram(parsed);

                const classCount  = parsed.classes.length;
                const methodCount = parsed.classes.reduce((s, c) => s + c.methods.length, 0);
                const fieldCount  = parsed.classes.reduce((s, c) => s + c.fields.length, 0);

                report = `## 🏛️ Architectural Diagrams — Generated from Your Code

> Parsed **${classCount}** class(es) · **${methodCount}** method(s) · **${fieldCount}** field(s)

---

### 1. UML Class Diagram

${classDiag ? `\`\`\`mermaid\n${classDiag}\n\`\`\`` : '> ⚠️ No classes detected. Paste code with class definitions.'}

---

### 2. System Flowchart

${flowDiag ? `\`\`\`mermaid\n${flowDiag}\n\`\`\`` : '> ⚠️ No structure detected.'}

---

### 3. Interaction Sequence Diagram

${seqDiag ? `\`\`\`mermaid\n${seqDiag}\n\`\`\`` : '> ⚠️ Need at least 2 classes to generate sequence diagram.'}

---

### 4. Detected Structure Summary

${parsed.classes.map(cls => `**\`${cls.name}\`**${cls.parent ? ` extends \`${cls.parent}\`` : ''}
- Fields: ${cls.fields.map(f => `\`${f.name}\``).join(', ') || 'none'}
- Methods: ${cls.methods.map(m => `\`${m.name}()\``).join(', ') || 'none'}`).join('\n\n')}

${parsed.funcs.length ? `**Functions:** ${parsed.funcs.map(f => `\`${f.name}()\``).join(', ')}` : ''}
${parsed.imports.length ? `**Imports:** ${parsed.imports.slice(0,8).join(', ')}` : ''}
`;

            } else if (isOptimize) {
                const parsed  = parseCode(rawCode);
                const classes = parsed.classes;

                report = `## 🚀 Optimization Report

### 📊 Code Metrics

| Metric | Value |
|--------|-------|
| Classes | ${classes.length} |
| Total methods | ${classes.reduce((s,c)=>s+c.methods.length,0)} |
| Total fields | ${classes.reduce((s,c)=>s+c.fields.length,0)} |
| Language | ${parsed.lang.toUpperCase()} |

---

${classes.map(cls => {
    const issues = [];
    if (cls.fields.length > 8) issues.push(`🟠 Too many fields (${cls.fields.length}) — consider splitting into smaller classes (Single Responsibility)`);
    if (cls.methods.length > 10) issues.push(`🟠 Too many methods (${cls.methods.length}) — consider extracting to sub-classes`);
    if (!cls.parent && cls.methods.some(m => m.name === 'getInstance')) issues.push('🔷 Singleton detected — ensure thread-safe double-checked locking');
    if (cls.methods.some(m => m.name.startsWith('create') || m.name.startsWith('make'))) issues.push('🏭 Factory methods detected — consider abstracting to a Factory class');
    if (issues.length === 0) issues.push('✅ No immediate issues — structure looks clean');
    return `### \`${cls.name}\`\n${issues.map(i=>`- ${i}`).join('\n')}`;
}).join('\n\n')}

---

### 🔮 Recommendations

1. **Apply SDA Patterns** where missing (Singleton, Factory, Repository)
2. **Reduce coupling** — inject dependencies via constructor instead of instantiating inside methods
3. **Add error boundaries** — wrap public methods in try/catch
4. **Naming** — ensure methods follow verb-noun convention (e.g., \`getUserById\` not \`user\`)
`;

            } else if (isFix) {
                const parsed  = parseCode(rawCode);
                const classes = parsed.classes;

                const bugs = [];
                for (const cls of classes) {
                    if (cls.fields.some(f => f.name.toLowerCase().includes('password') && !f.name.toLowerCase().includes('hash'))) {
                        bugs.push({ severity: '🔴', cls: cls.name, issue: 'Plain-text password field detected — store only hashed values (SHA-256 minimum, bcrypt recommended)' });
                    }
                    if (cls.methods.length > 0 && !rawCode.includes('catch') && !rawCode.includes('throws')) {
                        bugs.push({ severity: '🟡', cls: cls.name, issue: 'No exception handling detected — wrap DB/IO operations in try/catch' });
                    }
                    if (cls.methods.some(m => m.name === 'getInstance') && !rawCode.includes('synchronized') && !rawCode.includes('volatile')) {
                        bugs.push({ severity: '🟠', cls: cls.name, issue: 'Singleton without synchronization — use double-checked locking or enum Singleton for thread safety' });
                    }
                    const publicFields = cls.fields.filter(f => f.visibility === '+');
                    if (publicFields.length > 0) {
                        bugs.push({ severity: '🟡', cls: cls.name, issue: `Public fields: ${publicFields.map(f=>`\`${f.name}\``).join(', ')} — use private + getters/setters` });
                    }
                }

                if (bugs.length === 0) bugs.push({ severity: '✅', cls: 'All', issue: 'No obvious bugs detected in the structure' });

                report = `## 🔧 Bug Detection Report

### Issues Found

| Severity | Class | Issue |
|----------|-------|-------|
${bugs.map(b => `| ${b.severity} | \`${b.cls}\` | ${b.issue} |`).join('\n')}

---

### 📋 Detected Classes

${classes.map(cls => `**\`${cls.name}\`** — ${cls.fields.length} fields, ${cls.methods.length} methods`).join('\n')}
`;

            } else {
                const parsed  = parseCode(rawCode);
                const classes = parsed.classes;

                const patterns = [];
                for (const cls of classes) {
                    if (cls.methods.some(m => m.name === 'getInstance')) patterns.push(`**Singleton** in \`${cls.name}\``);
                    if (cls.methods.some(m => m.name.startsWith('create') || m.name === 'createModule')) patterns.push(`**Factory** in \`${cls.name}\``);
                    if (cls.methods.some(m => m.name === 'handle' || m.name === 'setNext')) patterns.push(`**Chain of Responsibility** in \`${cls.name}\``);
                    if (cls.methods.some(m => m.name === 'build' || m.name === 'setModel')) patterns.push(`**Builder** in \`${cls.name}\``);
                    if (cls.methods.some(m => m.name === 'adapt' || m.name === 'adaptToAnthropicFormat')) patterns.push(`**Adapter** in \`${cls.name}\``);
                    if (cls.methods.some(m => m.name === 'findById' || m.name === 'save' || m.name === 'findByEmail')) patterns.push(`**Repository** in \`${cls.name}\``);
                    if (cls.parent) patterns.push(`**Inheritance**: \`${cls.name}\` extends \`${cls.parent}\``);
                }

                report = `## 🔍 Code Analysis Report

### 📊 Summary

| Metric | Value |
|--------|-------|
| Classes | ${classes.length} |
| Methods | ${classes.reduce((s,c)=>s+c.methods.length,0)} |
| Fields | ${classes.reduce((s,c)=>s+c.fields.length,0)} |
| Imports | ${parsed.imports.length} |
| Language | ${parsed.lang.toUpperCase()} |

---

### ✅ Detected Patterns

${patterns.length ? patterns.map(p => `- ${p}`).join('\n') : '- No well-known SDA patterns detected yet'}

---

### 🏗️ Class Structure

${classes.map(cls => `#### \`${cls.name}\`${cls.parent ? ` *(extends ${cls.parent})*` : ''}
| Type | Name | Visibility |
|------|------|------------|
${cls.fields.map(f=>`| Field | \`${f.name}\` | ${f.visibility==='+'?'public':'private'} |`).join('\n')}
${cls.methods.map(m=>`| Method | \`${m.name}()\` | ${m.visibility==='+'?'public':'private'} |`).join('\n')}`).join('\n\n')}

---

### 🔷 SOLID Audit

| Principle | Status | Reason |
|-----------|--------|--------|
| Single Responsibility | ${classes.every(c=>c.methods.length<=8)?'✅':'⚠️'} | ${classes.every(c=>c.methods.length<=8)?'Each class is focused':'Some classes have many methods'} |
| Open/Closed | ⚠️ | Check if new features require modifying existing classes |
| Liskov Substitution | ${classes.some(c=>c.parent)?'✅':'N/A'} | Inheritance detected |
| Interface Segregation | ✅ | Methods appear focused |
| Dependency Inversion | ${patterns.some(p=>p.includes('Factory'))?'✅':'⚠️'} | ${patterns.some(p=>p.includes('Factory'))?'Factory pattern present':'Consider abstracting dependencies'} |
`;
            }

            // Stream word-by-word
            const words = report.split(/(\s+)/);
            for (const word of words) {
                await new Promise(r => setTimeout(r, word.includes('```') ? 3 : 6));
                onChunk(word);
            }
            return;
        }

        const proxyRes = await fetch(apiUrl('/api/ai'), {
            method: 'POST',
            headers: jsonHeaders,
            body: JSON.stringify({
                system: systemPrompt,
                messages: [{ role: 'user', content: userMessage }],
                model: this.config.model,
                temperature: this.config.temp,
                max_tokens: 4000,
                apiKey: this.apiKey,
            }),
        });

        const proxyData = await proxyRes.json();
        if (!proxyRes.ok) throw new Error(proxyData.error || 'AI proxy connection failed.');

        const output = proxyData.output || '';
        if (!output) throw new Error('AI returned an empty response.');

        const words = output.split(/(\s+)/);
        for (const word of words) {
            await new Promise(r => setTimeout(r, 6));
            if (typeof onChunk === 'function') onChunk(word);
        }
    }
}

export default AIService;
