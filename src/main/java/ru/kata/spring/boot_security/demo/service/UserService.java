package ru.kata.spring.boot_security.demo.service;


import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserService {
    void create(User user);

    List<User> getAllUsers();

    void delete(Long id);

    User getById(Long id);

    void update(User user);

    User getUserByUsername(String username);

    void createUserWithRoles(User user, String[] selectedRoles);

    void editUserWithRoles(User user, String[] selectedRoles);

    void setUserRoles(User user, String[] selectedRoles);
}
