package com.samiullah.financial_system.repositories;

import com.samiullah.financial_system.entities.CompanyInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CompanyInfoRepository extends JpaRepository<CompanyInfo,Integer> {
    Optional<CompanyInfo> findFirstBy();
    Optional<CompanyInfo> findTopByOrderByIdAsc();
    Optional<CompanyInfo> findByUuid(UUID uuid);
    List<CompanyInfo> findBySyncedFalse();
}
