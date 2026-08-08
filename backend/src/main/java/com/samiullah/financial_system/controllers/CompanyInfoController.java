package com.samiullah.financial_system.controllers;

import com.samiullah.financial_system.dtos.CompanyInfoRequest;
import com.samiullah.financial_system.dtos.CompanyInfoResponse;
import com.samiullah.financial_system.services.CompanyInfoService;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/companyInfo")
@AllArgsConstructor
public class CompanyInfoController {

    private final CompanyInfoService companyInfoService;

    @GetMapping("/isInitialized")
    public ResponseEntity<Boolean> isInitialized() {
        return ResponseEntity.ok(companyInfoService.isInitialized());
    }


    @PostMapping(
            value = "/saveInfo",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CompanyInfoResponse> saveCompanyInfo(
            @ModelAttribute CompanyInfoRequest companyInfoRequest) {
        System.out.println("===== CONTROLLER HIT =====");

        CompanyInfoResponse response =
                companyInfoService.saveCompanyInfo(companyInfoRequest);

        return ResponseEntity.ok(response);
    }


    @PutMapping(
            value = "/updateCompanyInfo",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<CompanyInfoResponse> updateCompanyInfo(
            @ModelAttribute CompanyInfoRequest companyInfoRequest
    ) {

        CompanyInfoResponse response =
                companyInfoService.updateCompanyInfo(companyInfoRequest);

        return ResponseEntity.ok(response);
    }


    @GetMapping("/getCompanyInfo")
    public ResponseEntity<CompanyInfoResponse> getCompanyInfo() {

        CompanyInfoResponse response =
                companyInfoService.getCompanyInfo();

        return ResponseEntity.ok(response);
    }
}