package com.codeoracle.architectures.chain;

public abstract class RequestHandler {
    protected RequestHandler next;

    public RequestHandler setNext(RequestHandler handler) { this.next = handler; return handler; }

    public Request handle(Request request) throws Exception {
        if (this.next != null) return this.next.handle(request);
        return request;
    }
}
