package com.codeoracle.patterns.adapter;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

public class DataAdapter {

    public Map<String, Object> adaptFileForApi(String id, String name, String content, String language) {
        Map<String, Object> out = new HashMap<>();
        out.put("id",       id);
        out.put("name",     name);
        out.put("content",  content);
        out.put("language", language);
        return out;
    }

    public Map<String, Object> adaptAnalysisRecord(String fileId, String type, String result) {
        Map<String, Object> out = new HashMap<>();
        out.put("file_id",   fileId);
        out.put("type",      type);
        out.put("result",    result);
        out.put("timestamp", Instant.now().toString());
        return out;
    }
}
