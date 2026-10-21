package com.codeoracle.patterns.repository;

public class UserRepository {

    private final Object db;

    public UserRepository(Object db) { this.db = db; }

    public User findById(String id) {
        return new User(id, "John Doe", "john@codeoracle.io");
    }

    public User findByEmail(String email) {
        return new User("1", "Oracle Agent", email);
    }

    public boolean save(User user) {
        System.out.printf("[UserRepository] Persisting user \"%s\" to database...%n", user.getName());
        return true;
    }

    public boolean delete(String id) {
        System.out.printf("[UserRepository] Deleting user id=\"%s\"...%n", id);
        return true;
    }
}
