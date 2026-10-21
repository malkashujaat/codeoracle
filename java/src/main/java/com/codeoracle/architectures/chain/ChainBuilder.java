package com.codeoracle.architectures.chain;

public class ChainBuilder {
    public static RequestHandler buildAnalysisChain() {
        ValidationHandler validation = new ValidationHandler();
        LoggingHandler logging = new LoggingHandler();
        AnalysisHandler analysis = new AnalysisHandler();
        PersistenceHandler persistence = new PersistenceHandler();

        validation.setNext(logging).setNext(analysis).setNext(persistence);
        return validation;
    }
}
