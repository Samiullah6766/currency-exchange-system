package com.samiullah.financial_system.repositories;

import com.samiullah.financial_system.entities.CompanyInfo;
import com.samiullah.financial_system.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CustomerRepository  extends JpaRepository<Customer, Long> {
    List<Customer> findAllByFirstNameAndCompanyInfo(String firstName, CompanyInfo companyInfo);
    Optional<Customer> findByIdAndCompanyInfo(Long id, CompanyInfo companyInfo);
    Optional<Customer> findByFirstNameAndLastNameAndCompanyInfo(String firstName,
                                                                String lastName,
                                                                CompanyInfo companyInfo);
    List<Customer> findAllByCompanyInfo(CompanyInfo companyInfo);
    Optional<Customer> findByUuid(UUID uuid);
    List<Customer> findBySyncedFalse();
}
