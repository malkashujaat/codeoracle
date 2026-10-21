package com.codeoracle.patterns.chain;

public class LoggingHandler extends RequestHandler {

    @Override
    public void handle(Request request) throws Exception {
        String fileName = request.getActiveFile() != null
                ? request.getActiveFile().getOrDefault("name", "unknown")
                : "unknown";
        System.out.printf("[RequestChain] action=%s  file=%s%n", request.getAction(), fileName);
        passToNext(request);
    }
}
