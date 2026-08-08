package com.samiullah.financial_system.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CompanyInfoResponse {
    private Integer companyId;

    private String companyName;

    private String ownerName;

    private String address;

    private String phone;

    private String email;

    private String logoPath;
}
