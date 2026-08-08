package com.samiullah.financial_system.dtos;

import com.samiullah.financial_system.entities.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDto {
    private Integer id;
    private String username;
    private Role role;
}
