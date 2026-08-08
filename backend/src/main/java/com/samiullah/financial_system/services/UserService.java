package com.samiullah.financial_system.services;

import com.samiullah.financial_system.JWT.Util.JwtService;
import com.samiullah.financial_system.dtos.*;
import com.samiullah.financial_system.entities.CompanyInfo;
import com.samiullah.financial_system.entities.User;
import com.samiullah.financial_system.exceptions.CompanyNotFoundException;
import com.samiullah.financial_system.exceptions.CustomerNotFoundException;
import com.samiullah.financial_system.exceptions.UsernameAlreadyExistsException;
import com.samiullah.financial_system.repositories.CompanyInfoRepository;
import com.samiullah.financial_system.repositories.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final CompanyInfoRepository companyInfoRepository;

    public UserService(UserRepository userRepository,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService,
                       PasswordEncoder passwordEncoder,
                       CompanyInfoRepository companyInfoRepository) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.companyInfoRepository = companyInfoRepository;

    }

    public AuthResponse authenticateUser(LoginRequest loginRequest) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                user.getUsername(),
                user.getRole(),
                user.getId()
        );
    }
    public RegisterUserResponse registerUser(RegisterUser  registerUser) {
        Optional<User> existingUser = userRepository.findByUsername(registerUser.getUsername());
        if (existingUser.isPresent()) {
            throw new UsernameAlreadyExistsException(
                    "Username already exists. Please choose another username."
            );
        }
        CompanyInfo companyInfo =  companyInfoRepository.findTopByOrderByIdAsc().orElseThrow(() -> new CompanyNotFoundException("Company Info not found"));

        User user = new User();
        user.setUsername(registerUser.getUsername());
        user.setPassword(passwordEncoder.encode(registerUser.getPassword()));
        user.setRole(registerUser.getRole());
        user.setCompanyInfo(companyInfo);
        User savedUser = userRepository.save(user);
        RegisterUserResponse registerUserResponse = new RegisterUserResponse();
        registerUserResponse.setUserId(savedUser.getId());
        registerUserResponse.setUsername(savedUser.getUsername());
        registerUserResponse.setPassword(savedUser.getPassword());
        registerUserResponse.setRole(savedUser.getRole());


        return registerUserResponse;

    }

    public List<UserDto> AllUsers() {
       List<User> users = userRepository.findAll();

       List<UserDto> userDtos =  users.stream().map((user -> new UserDto(
               user.getId(),
               user.getUsername(),
               user.getRole()
       ))).toList();
       return userDtos;
    }

}
