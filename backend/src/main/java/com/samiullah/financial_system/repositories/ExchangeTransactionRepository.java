package com.samiullah.financial_system.repositories;

import com.samiullah.financial_system.entities.CompanyInfo;
import com.samiullah.financial_system.entities.ExchangeTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ExchangeTransactionRepository extends JpaRepository<ExchangeTransaction, Long> {
    List<ExchangeTransaction> findByTransactionDateAndCompanyInfo(LocalDate transactionDate,  CompanyInfo companyInfo);
    List<ExchangeTransaction> findAllByCompanyInfo(CompanyInfo companyInfo);
    Optional<ExchangeTransaction> findByUuid(UUID uuid);
    List<ExchangeTransaction> findBySyncedFalse();
}
