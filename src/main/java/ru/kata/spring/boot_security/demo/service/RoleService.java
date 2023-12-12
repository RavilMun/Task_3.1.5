package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.model.Role;

import java.util.List;
import java.util.Set;

public interface RoleService {
    List<Role> getAllRoles();

    Role getRole(String roleName);

    Role getRoleById(Long id);

    Set<Role> getAllRolesById(List<Long> id);

    void addRole(Role role);
}
