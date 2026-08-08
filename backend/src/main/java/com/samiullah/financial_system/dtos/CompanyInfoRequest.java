package com.samiullah.financial_system.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CompanyInfoRequest {
    private String companyName;

    private String ownerName;

    private String address;

    private String phone;

    private String email;

    private MultipartFile logo;
}
