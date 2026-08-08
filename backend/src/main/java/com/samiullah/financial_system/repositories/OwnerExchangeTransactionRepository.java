package com.samiullah.financial_system.repositories;

import com.samiullah.financial_system.entities.CompanyInfo;
import com.samiullah.financial_system.entities.OwnerExchangeTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OwnerExchangeTransactionRepository extends JpaRepository<OwnerExchangeTransaction, Long> {
    List<OwnerExchangeTransaction> findAllByCompanyInfo(CompanyInfo companyInfo);
    Optional<OwnerExchangeTransaction> findByUuid(UUID uuid);
    List<OwnerExchangeTransaction> findBySyncedFalse();

}
