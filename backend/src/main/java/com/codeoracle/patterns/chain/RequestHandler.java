package com.codeoracle.patterns.chain;

public abstract class RequestHandler {

    protected RequestHandler next;

    public RequestHandler setNext(RequestHandler handler) {
        this.next = handler;
        return handler;
    }

    public abstract void handle(Request request) throws Exception;

    protected void passToNext(Request request) throws Exception {
        if (next != null) next.handle(request);
    }
}
