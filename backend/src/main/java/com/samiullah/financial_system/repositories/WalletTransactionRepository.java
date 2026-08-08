package com.samiullah.financial_system.repositories;

import com.samiullah.financial_system.entities.CompanyInfo;
import com.samiullah.financial_system.entities.WalletTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {
    List<WalletTransaction> findAllByCompanyInfo(CompanyInfo companyInfo);
    Optional<WalletTransaction> findByUuid(UUID uuid);
    List<WalletTransaction> findBySyncedFalse();
}
