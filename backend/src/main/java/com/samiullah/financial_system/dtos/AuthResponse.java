package com.samiullah.financial_system.dtos;

import com.samiullah.financial_system.entities.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AuthResponse {
    private String token;
    private String username;
    private Role role;
    private Integer userId;

}
