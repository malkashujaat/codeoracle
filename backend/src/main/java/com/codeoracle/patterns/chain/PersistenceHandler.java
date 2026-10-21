package com.codeoracle.patterns.chain;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

public class PersistenceHandler extends RequestHandler {

    @Override
    public void handle(Request request) throws Exception {
        Map<String, Object> item = new HashMap<>();
        item.put("id",      System.currentTimeMillis());
        item.put("date",    LocalTime.now().toString());
        item.put("type",    request.getAction());
        item.put("snippet", request.getActiveFile() != null
                ? request.getActiveFile().getOrDefault("name", "<none>")
                : "<none>");
        item.put("content", request.getOutput());
        request.setHistoryItem(item);

        passToNext(request);
    }
}
