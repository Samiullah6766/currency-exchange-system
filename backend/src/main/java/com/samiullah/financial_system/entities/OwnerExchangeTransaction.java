package com.samiullah.financial_system.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "owner_exchange_Transaction")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class OwnerExchangeTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;
    @Column(nullable = false, unique = true, updatable = false)
    private UUID uuid;

    @Column(nullable = false)
    private Boolean synced = false;

    private BigDecimal fromAmount;

    @Enumerated(EnumType.STRING)
    private MoneyType fromCurrency;

    private BigDecimal toAmount;

    @Enumerated(EnumType.STRING)
    private MoneyType toCurrency;

    private Double buyingExchangeRate;

    private Double sellingExchangeRate;

    private BigDecimal interest;

    private LocalDate transactionDate;


    @UpdateTimestamp
    private LocalDateTime lastModified;


    @ManyToOne
    @JoinColumn(name="company_info_id")
    private CompanyInfo companyInfo;

    private String notes;
    @PrePersist
    public void prePersist() {

        if (uuid == null) {
            uuid = UUID.randomUUID();
        }

        if (synced == null) {
            synced = false;
        }
    }

}
