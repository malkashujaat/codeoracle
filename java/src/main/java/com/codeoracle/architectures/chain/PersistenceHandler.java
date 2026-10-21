package com.codeoracle.architectures.chain;

import java.util.HashMap;
import java.util.Map;

public class PersistenceHandler extends RequestHandler {
    @Override
    public Request handle(Request request) throws Exception {
        Map<String,Object> history = new HashMap<>();
        history.put("id", System.currentTimeMillis());
        history.put("date", java.time.LocalTime.now().toString());
        history.put("type", request.getAction());
        history.put("snippet", request.getActiveFile() != null ? request.getActiveFile().getName() : "<none>");
        history.put("content", request.getOutput());

        request.setHistoryItem(history);

        if (request.isDbConnected()) {
            // Placeholder: integrate DB save logic here (HTTP POST or DB client)
        }
        return super.handle(request);
    }
}
