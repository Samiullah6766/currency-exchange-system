package com.samiullah.financial_system.repositories;

import com.samiullah.financial_system.entities.CompanyInfo;
import com.samiullah.financial_system.entities.Remittance;
import com.samiullah.financial_system.entities.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByCustomerIdAndCompanyInfo(Long customerId,  CompanyInfo companyInfo);
    List<Transaction> findAllByCompanyInfo(CompanyInfo companyInfo);
    Optional<Transaction> findByIdAndCompanyInfo(Long id, CompanyInfo companyInfo);

    Optional<Transaction> findByUuid(UUID uuid);
    List<Transaction> findBySyncedFalse();
}
