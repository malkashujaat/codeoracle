package com.codeoracle.models;

public class ProjectFile {
    private String id;
    private String name;
    private String content;
    private String language;

    public String getId()                   { return id; }
    public void setId(String id)            { this.id = id; }
    public String getName()                 { return name; }
    public void setName(String name)        { this.name = name; }
    public String getContent()              { return content; }
    public void setContent(String content)  { this.content = content; }
    public String getLanguage()             { return language; }
    public void setLanguage(String lang)    { this.language = lang; }
}
