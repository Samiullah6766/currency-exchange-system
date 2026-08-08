package com.samiullah.financial_system.controllers.userFiles;

import com.samiullah.financial_system.dtos.*;
import com.samiullah.financial_system.services.UserService;
import com.samiullah.financial_system.exceptions.UsernameAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService ) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse authResponse =  userService.authenticateUser(request);

        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/registerUser")
    public ResponseEntity<?> userCreate(@RequestBody RegisterUser request) {

        try {
            RegisterUserResponse registerUserResponse = userService.registerUser(request);
            return ResponseEntity.ok(registerUserResponse);
        } catch (UsernameAlreadyExistsException e) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(e.getMessage());
        }

    }
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getUsers() {
        List<UserDto> userDtoList = userService.AllUsers();

        return ResponseEntity.ok(userDtoList);
    }
}
