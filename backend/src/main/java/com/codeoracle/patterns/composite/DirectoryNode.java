package com.codeoracle.patterns.composite;

import java.util.ArrayList;
import java.util.List;

public class DirectoryNode implements ComponentNode {

    private final String name;
    private final List<ComponentNode> children = new ArrayList<>();

    public DirectoryNode(String name) { this.name = name; }

    public void addComponent(ComponentNode c)    { children.add(c); }
    public void removeComponent(ComponentNode c) { children.remove(c); }

    @Override public String getName() { return name; }
    @Override public int getSize()    { return children.stream().mapToInt(ComponentNode::getSize).sum(); }

    @Override
    public void printStructure(String indent) {
        System.out.printf("%s+ 📁 %s%n", indent, name);
        for (ComponentNode child : children) child.printStructure(indent + "  ");
    }
}
