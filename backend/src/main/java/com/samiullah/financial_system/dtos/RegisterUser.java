package com.samiullah.financial_system.dtos;

import com.samiullah.financial_system.entities.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RegisterUser {
    private String username;
    private String password;
    private Role role;
}
