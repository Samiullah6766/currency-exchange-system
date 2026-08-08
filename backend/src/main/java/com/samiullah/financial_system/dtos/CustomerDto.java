package com.samiullah.financial_system.dtos;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String fatherName;
    private String email;
    private String number;
    private String address;
}
