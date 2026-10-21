package com.codeoracle.patterns.composite;

public class FileNode implements ComponentNode {

    private final String name;
    private final String content;
    private final String language;

    public FileNode(String name, String content, String language) {
        this.name     = name;
        this.content  = content  != null ? content  : "";
        this.language = language != null ? language : "text";
    }

    @Override public String getName() { return name; }
    @Override public int    getSize() { return content.length(); }
    public String getLanguage()       { return language; }

    @Override
    public void printStructure(String indent) {
        System.out.printf("%s- 📄 %s [%s, %d bytes]%n", indent, name, language, getSize());
    }
}
