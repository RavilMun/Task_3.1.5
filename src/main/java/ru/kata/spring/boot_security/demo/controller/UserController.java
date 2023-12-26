package ru.kata.spring.boot_security.demo.controller;


import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.DTO.UserDTO;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;

@RestController
@RequestMapping("/api")
public class UserController {
    private final UserService userDetails;
    private final ModelMapper modelMapper;

    @Autowired
    public UserController(UserService userDetails, ModelMapper modelMapper) {
        this.userDetails = userDetails;
        this.modelMapper = modelMapper;
    }

    @GetMapping("/user")
    public ResponseEntity<UserDTO> getUser(Principal principal) {
        User user = userDetails.getUserByUsername(principal.getName());
        UserDTO userDTO = convertToUserDto(user);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    private UserDTO convertToUserDto(User user) {
        return modelMapper.map(user, UserDTO.class);
    }

}
