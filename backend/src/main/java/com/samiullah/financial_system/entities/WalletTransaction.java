package com.samiullah.financial_system.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
@Table(name = "wallet_transaction")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class WalletTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;
    @Column(nullable = false, unique = true, updatable = false)
    private UUID uuid;

    @Column(nullable = false)
    private Boolean synced = false;
    @ManyToOne
    @JoinColumn(name = "wallet_id")
    @JsonBackReference
    private Wallet wallet;

    @Enumerated(EnumType.STRING)
    private MoneyType moneyType;

    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    private BigDecimal amount;
    private String createdBy;

    private String note;

    private LocalDate date;

    @ManyToOne
    @JoinColumn(name="company_info_id")
    private CompanyInfo companyInfo;

    @UpdateTimestamp
    private LocalDateTime lastModified;

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
