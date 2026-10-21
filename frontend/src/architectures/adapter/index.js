/**
 * ═══════════════════════════════════════════════════════════
 * 🏛️  ADAPTER PATTERN
 * ═══════════════════════════════════════════════════════════
 * Intent:
 *   Convert the interface of a class into another interface
 *   that clients expect. Lets incompatible interfaces work
 *   together without modifying their source.
 *
 * Used in CodeOracle:
 *   - DataAdapter → translates internal file/analysis objects
 *     into the exact JSON shapes required by the REST API and
 *     the PDF export renderer.
 * ═══════════════════════════════════════════════════════════
 */

export class DataAdapter {
    adaptFileForApi(file) { return { id: file.id, name: file.name, content: file.content, language: file.language }; }
    adaptAnalysisRecord(fileId, type, result) { return { file_id: fileId, type, result, timestamp: new Date().toISOString() }; }
    formatExportHtml(activeFileName, results) {
        return `<h1 style="color:#00f2ff;font-size:40px;margin-bottom:10px;">OBSIDIAN MASTER PORTFOLIO</h1><p style="color:#666;text-transform:uppercase;letter-spacing:5px;">CodeOracle Strategic Asset</p><hr style="border:0;border-top:1px solid #222;margin:40px 0;"/><div style="margin-bottom:40px;"><h3>1. System Logic</h3>${results.analyze || 'Pending Analysis...'}</div><div style="margin-bottom:40px;"><h3>2. Architectural Blueprint</h3>${results.diagram || 'Pending Generation...'}</div><div style="margin-bottom:40px;"><h3>3. Performance Roadmap</h3>${results.optimize || 'Pending Optimization...'}</div><div style="margin-bottom:40px;"><h3>4. Self-Healing Log</h3>${results.fix || 'Pending Scan...'}</div>`;
    }
}
export default DataAdapter;
