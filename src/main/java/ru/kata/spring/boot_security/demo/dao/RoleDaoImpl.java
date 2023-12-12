package ru.kata.spring.boot_security.demo.dao;

import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.model.Role;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Repository
public class RoleDaoImpl implements RoleDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Role> getAllRoles() {
        return entityManager.createQuery("SELECT r FROM Role r", Role.class).getResultList();
    }

    @Override
    public Role getRole(String roleName) {
        return entityManager.createQuery("SELECT r FROM Role r WHERE r.roleName =: rolename", Role.class)
                .setParameter("rolename", roleName)
                .getSingleResult();
    }

    @Override
    public Role getRoleById(Long id) {
        return entityManager.find(Role.class, id);
    }

    @Override
    public Set<Role> getAllRolesById(List<Long> id) {
        return new HashSet<>(entityManager.createQuery("SELECT r FROM Role r WHERE r.id in :id", Role.class)
                .setParameter("id", id)
                .getResultList());
    }

    @Override
    public void addRole(Role role) {
        entityManager.persist(role);
    }
}
