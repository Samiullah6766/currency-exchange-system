package com.samiullah.financial_system.repositories;

import com.samiullah.financial_system.entities.CompanyInfo;
import com.samiullah.financial_system.entities.Remittance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RemittanceRepository extends JpaRepository<Remittance, Long> {
    List<Remittance> findAllByCompanyInfo(CompanyInfo companyInfo);
    Optional<Remittance> findByIdAndCompanyInfo(Long id, CompanyInfo companyInfo);
    Optional<Remittance> findByUuid(UUID uuid);
    List<Remittance> findBySyncedFalse();
}
