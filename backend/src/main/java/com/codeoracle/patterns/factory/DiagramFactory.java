package com.codeoracle.patterns.factory;

public class DiagramFactory {

    public abstract static class Diagram {
        public abstract String render();
    }

    public static class ClassDiagram extends Diagram {
        @Override public String render() { return "Rendering UML Class Diagram..."; }
    }

    public static class SequenceDiagram extends Diagram {
        @Override public String render() { return "Rendering Interaction Sequence..."; }
    }

    public static Diagram createDiagram(String type) {
        switch (type.toLowerCase()) {
            case "class":    return new ClassDiagram();
            case "sequence": return new SequenceDiagram();
            default: throw new IllegalArgumentException("Unknown diagram type: " + type);
        }
    }
}
