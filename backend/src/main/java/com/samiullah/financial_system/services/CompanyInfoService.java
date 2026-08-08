package com.samiullah.financial_system.services;

import com.samiullah.financial_system.dtos.CompanyInfoRequest;
import com.samiullah.financial_system.dtos.CompanyInfoResponse;
import com.samiullah.financial_system.entities.CompanyInfo;
import com.samiullah.financial_system.exceptions.CompanyAlreadyExistsException;
import com.samiullah.financial_system.exceptions.CompanyNotFoundException;
import com.samiullah.financial_system.repositories.CompanyInfoRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service

public class CompanyInfoService {

    private final CompanyInfoRepository companyInfoRepository;

    @Value("${upload.folder}")
    private String uploadFolder;

    public CompanyInfoService(CompanyInfoRepository companyInfoRepository) {
        this.companyInfoRepository = companyInfoRepository;
    }
    public boolean isInitialized() {
        return companyInfoRepository.count() > 0;
    }
    public CompanyInfoResponse saveCompanyInfo(
            CompanyInfoRequest companyInfoRequest
    ) {
        if (companyInfoRepository.count() > 0) {
            throw new CompanyAlreadyExistsException(
                    "Company Info Already Exists"
            );
        }
        CompanyInfo companyInfo = new CompanyInfo();

        companyInfo.setUuid(UUID.randomUUID());

        companyInfo.setCompanyName(companyInfoRequest.getCompanyName());
        companyInfo.setOwnerName(companyInfoRequest.getOwnerName());
        companyInfo.setAddress(companyInfoRequest.getAddress());
        companyInfo.setPhone(companyInfoRequest.getPhone());
        companyInfo.setEmail(companyInfoRequest.getEmail());


        String logoPath = saveLogo(companyInfoRequest.getLogo());

        companyInfo.setLogoPath(logoPath);


        CompanyInfo savedCompanyInfo =
                companyInfoRepository.save(companyInfo);


        return mapToResponse(savedCompanyInfo);
    }



    public CompanyInfoResponse updateCompanyInfo(
            CompanyInfoRequest companyInfoRequest) {
        CompanyInfo companyInfo = companyInfoRepository.findTopByOrderByIdAsc().orElseThrow(
                () -> new CompanyNotFoundException("Company not found"));


        companyInfo.setCompanyName(companyInfoRequest.getCompanyName());
        companyInfo.setOwnerName(companyInfoRequest.getOwnerName());
        companyInfo.setAddress(companyInfoRequest.getAddress());
        companyInfo.setPhone(companyInfoRequest.getPhone());
        companyInfo.setEmail(companyInfoRequest.getEmail());
        companyInfo.setSynced(false);


        if (companyInfoRequest.getLogo() != null &&
                !companyInfoRequest.getLogo().isEmpty()) {

            String logoPath =
                    saveLogo(companyInfoRequest.getLogo());

            companyInfo.setLogoPath(logoPath);
        }


        CompanyInfo updatedCompanyInfo =
                companyInfoRepository.save(companyInfo);


        return mapToResponse(updatedCompanyInfo);
    }
    public CompanyInfoResponse getCompanyInfo() {

        CompanyInfo companyInfo =
                companyInfoRepository.findFirstBy()
                        .orElseThrow(() ->
                                new CompanyNotFoundException(
                                        "Company not found"
                                )
                        );
        return mapToResponse(companyInfo);
    }

    private String saveLogo(MultipartFile logo) {

        if (logo == null || logo.isEmpty()) {
            return null;
        }
        try {
            Files.createDirectories(Paths.get(uploadFolder));

            String fileName =
                    UUID.randomUUID() + "_" + logo.getOriginalFilename();

            Path filePath = Paths.get(uploadFolder, fileName);

            Files.copy(
                    logo.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );
            return "uploads/logos/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Could not save logo", e);
        }
    }

    private CompanyInfoResponse mapToResponse(
            CompanyInfo companyInfo
    ) {

        CompanyInfoResponse response =
                new CompanyInfoResponse();
        response.setCompanyId(companyInfo.getId());
        response.setCompanyName(companyInfo.getCompanyName());
        response.setOwnerName(companyInfo.getOwnerName());
        response.setAddress(companyInfo.getAddress());
        response.setPhone(companyInfo.getPhone());
        response.setEmail(companyInfo.getEmail());
        response.setLogoPath(companyInfo.getLogoPath());
        return response;
    }

}