package ru.kata.spring.boot_security.demo.dao;


import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserDao {

    void addUser(User user);

    User getById(Long id);

    void deleteUser(Long userId);

    List<User> index();

    void updateUser(User user);

    User getUserByUsername(String username);

}
