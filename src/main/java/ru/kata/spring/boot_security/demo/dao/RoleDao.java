package ru.kata.spring.boot_security.demo.dao;

import ru.kata.spring.boot_security.demo.model.Role;

import java.util.List;
import java.util.Set;

public interface RoleDao {
    List<Role> getAllRoles();

    Role getRole(String roleName);

    Role getRoleById(Long id);

    Set<Role> getAllRolesById(List<Long> id);

    void addRole(Role role);
}
