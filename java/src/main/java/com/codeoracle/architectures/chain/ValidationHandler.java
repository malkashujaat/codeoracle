package com.codeoracle.architectures.chain;

public class ValidationHandler extends RequestHandler {
    @Override
    public Request handle(Request request) throws Exception {
        if (request.getActiveFile() == null || request.getActiveFile().getContent() == null || request.getActiveFile().getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("No active file content available for analysis.");
        }
        return super.handle(request);
    }
}
