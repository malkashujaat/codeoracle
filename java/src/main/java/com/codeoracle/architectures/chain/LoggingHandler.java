package com.codeoracle.architectures.chain;

public class LoggingHandler extends RequestHandler {
    @Override
    public Request handle(Request request) throws Exception {
        System.out.println("[RequestChain] Processing " + request.getAction() + " " + (request.getActiveFile() != null ? request.getActiveFile().getName() : "<none>"));
        return super.handle(request);
    }
}
