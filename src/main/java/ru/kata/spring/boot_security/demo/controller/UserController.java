package ru.kata.spring.boot_security.demo.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;

@Controller
@RequestMapping("/user")
public class UserController {
    private final UserService userDetails;

    @Autowired
    public UserController(UserService userDetails) {
        this.userDetails = userDetails;
    }

    @GetMapping()
    public String showUserPage(Principal principal, Model model) {
        User user = userDetails.getUserByUsername(principal.getName());
        model.addAttribute("user", user);
        return "user";
    }

}
