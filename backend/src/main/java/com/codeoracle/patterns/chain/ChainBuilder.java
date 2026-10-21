package com.codeoracle.patterns.chain;

public class ChainBuilder {

    public static RequestHandler buildAnalysisChain() {
        RequestHandler validation  = new ValidationHandler();
        RequestHandler logging     = new LoggingHandler();
        RequestHandler analysis    = new AnalysisHandler();
        RequestHandler persistence = new PersistenceHandler();

        validation.setNext(logging).setNext(analysis).setNext(persistence);
        return validation;
    }
}
