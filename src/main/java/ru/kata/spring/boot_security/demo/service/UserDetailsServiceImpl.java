package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.dao.UserDao;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.*;


@Service
public class UserDetailsServiceImpl implements UserService, UserDetailsService {

    private final PasswordEncoder passwordEncoder;
    private final UserDao userDao;
    private final RoleService roleService;

    @Autowired
    public UserDetailsServiceImpl(PasswordEncoder passwordEncoder, UserDao userDao, RoleService roleService) {
        this.passwordEncoder = passwordEncoder;
        this.userDao = userDao;
        this.roleService = roleService;
    }

    @Override
    public void setUserRoles(User user, String[] selectedRoles) {
        Set<Role> userRoles = new HashSet<>();
        for (String role : selectedRoles) {
            userRoles.add(roleService.getRole(role));
        }
        user.setRoles(userRoles);
    }

    @Override
    @Transactional
    public void createUserWithRoles(User user, String[] selectedRoles) {
        setUserRoles(user, selectedRoles);
        create(user);
    }

    @Override
    @Transactional
    public void editUserWithRoles(User user, String[] selectedRoles) {
        setUserRoles(user, selectedRoles);
        update(user);
    }

    @Override
    @Transactional
    public void create(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userDao.addUser(user);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        userDao.deleteUser(id);
    }

    @Override
    @Transactional(readOnly = true)
    public User getById(Long id) {
        return userDao.getById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userDao.getAllUsers();
    }

    @Override
    @Transactional
    public void update(User user) {
        if (!user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        } else {
            user.setPassword(getById(user.getId()).getPassword());
        }
        userDao.updateUser(user);
    }

    @Override
    @Transactional(readOnly = true)
    public User getUserByUsername(String username) {
        return userDao.getUserByUsername(username);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = Optional.ofNullable(getUserByUsername(username));
        if (user.isPresent()) {
            return user.get();
        } else {
            throw new UsernameNotFoundException(String.format("User %s not found", username));
        }
    }
}
