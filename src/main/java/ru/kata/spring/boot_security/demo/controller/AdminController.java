package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Controller
@RequestMapping("/admin")
public class AdminController {
    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping()
    public String index(Model model) {
        List<User> users = userService.index();
        model.addAttribute("users", users);
        return "adminPage";
    }

    @GetMapping("new")
    public String addUser(@ModelAttribute("user") User user) {
        return "adminPage";
    }


    @PostMapping()
    public String create(@ModelAttribute("user") User user, @RequestParam("roles") String[] roles) {
        Set<Role> userRoles = new HashSet<>();
        for (String role : roles) {
            userRoles.add(roleService.getRole(role));
        }
        user.setRoles(userRoles);
        userService.create(user);
        return "redirect:/admin";
    }

    @GetMapping("edit")
    public String editUser(@RequestParam("id") Long userId, Model model) {
        User user = userService.getById(userId);
        model.addAttribute("user", user);
        return "/edit";
    }

    @PostMapping("/edit")
    public String editUserSubmit(@ModelAttribute User editedUser, @RequestParam("roles") String[] roles) {
        Set<Role> userRoles = new HashSet<>();
        for (String role : roles) {
            System.out.println(role);
            userRoles.add(roleService.getRole(role));
        }
        editedUser.setRoles(userRoles);
        userService.update(editedUser);
        return "redirect:/admin";
    }

    @GetMapping("delete")
    public String deleteUser(@RequestParam("id") Long userId, Model model) {
        User user = userService.getById(userId);
        model.addAttribute("user", user);
        return "adminPage";
    }

    @PostMapping("/delete")
    public String deleteUserSubmit(@ModelAttribute User user) {
        userService.delete(user.getId());
        return "redirect:/admin";
    }
}