package com.samiullah.financial_system.repositories;

import com.samiullah.financial_system.entities.CompanyInfo;
import com.samiullah.financial_system.entities.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WalletRepository extends JpaRepository<Wallet,Long> {

    Optional<Wallet> findFirstByCompanyInfo(CompanyInfo companyInfo);
    Optional<Wallet> findTopByCompanyInfo(CompanyInfo companyInfo);
    Optional<Wallet> findByIdAndCompanyInfo(Long id, CompanyInfo companyInfo);

    Optional<Wallet> findByUuid(UUID uuid);
    List<Wallet> findBySyncedFalse();
}
