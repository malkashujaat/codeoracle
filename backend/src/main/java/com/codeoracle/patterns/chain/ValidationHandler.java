package com.codeoracle.patterns.chain;

public class ValidationHandler extends RequestHandler {

    @Override
    public void handle(Request request) throws Exception {
        if (request.getActiveFile() == null || request.getActiveFile().isEmpty()) {
            throw new IllegalArgumentException("No active file available for analysis.");
        }
        String content = request.getActiveFile().get("content");
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Active file is empty.");
        }
        passToNext(request);
    }
}
