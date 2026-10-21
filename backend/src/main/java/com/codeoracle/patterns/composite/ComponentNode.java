package com.codeoracle.patterns.composite;

public interface ComponentNode {
    String getName();
    int    getSize();
    void   printStructure(String indent);
}
