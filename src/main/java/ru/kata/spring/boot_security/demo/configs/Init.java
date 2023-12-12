package ru.kata.spring.boot_security.demo.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.annotation.PostConstruct;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
public class Init {
    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public Init(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @PostConstruct
    private void postConstruct() {
        Role roleAdmin = new Role("ROLE_ADMIN");
        Role roleUser = new Role("ROLE_USER");

        roleService.addRole(roleAdmin);
        roleService.addRole(roleUser);

        Set<Role> roleSetAdmin = Stream.of(roleAdmin, roleUser).collect(Collectors.toSet());
        Set<Role> roleSetUser = Stream.of(roleUser).collect(Collectors.toSet());

        User admin = new User("admin", "admin", "Ivan",
                "Ivanov", "ivanov@gmail.com", roleSetAdmin);
        User user = new User("user", "user", "Petr",
                "Petrov", "petrov@gmail.com", roleSetUser);

        userService.create(admin);
        userService.create(user);
    }
}
