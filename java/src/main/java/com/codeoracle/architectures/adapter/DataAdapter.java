package com.codeoracle.architectures.adapter;

import com.codeoracle.models.ProjectFile;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

public class DataAdapter {
    public Map<String,Object> adaptFileForApi(ProjectFile file) { Map<String,Object> out = new HashMap<>(); out.put("id", file.getId()); out.put("name", file.getName()); out.put("content", file.getContent()); out.put("language", file.getLanguage()); return out; }
    public Map<String,Object> adaptAnalysisRecord(String fileId, String type, String result) { Map<String,Object> out = new HashMap<>(); out.put("file_id", fileId); out.put("type", type); out.put("result", result); out.put("timestamp", Instant.now().toString()); return out; }
    public String formatExportHtml(String activeFileName, Map<String,String> results) { return "<h1 style=\"color:#00f2ff;font-size:40px;margin-bottom:10px;\">OBSIDIAN MASTER PORTFOLIO</h1>"+"<p style=\"color:#666;text-transform:uppercase;letter-spacing:5px;\">CodeOracle Strategic Asset</p>"+"<hr style=\"border:0;border-top:1px solid #222;margin:40px 0;\"/>"+"<div style=\"margin-bottom:40px;\"><h3>1. System Logic</h3>"+(results.getOrDefault("analyze", "Pending Analysis..."))+"</div>"+"<div style=\"margin-bottom:40px;\"><h3>2. Architectural Blueprint</h3>"+(results.getOrDefault("diagram", "Pending Generation..."))+"</div>"+"<div style=\"margin-bottom:40px;\"><h3>3. Performance Roadmap</h3>"+(results.getOrDefault("optimize", "Pending Optimization..."))+"</div>"+"<div style=\"margin-bottom:40px;\"><h3>4. Self-Healing Log</h3>"+(results.getOrDefault("fix", "Pending Scan..."))+"</div>"; }
}
