package ru.kata.spring.boot_security.demo.service;


import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserService {
    void create(User user);

    List<User> index();

    void delete(Long id);

    User getById(Long id);

    void update(User user);

    User getUserByUsername(String username);
}
